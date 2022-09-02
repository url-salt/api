import * as AWS from "aws-sdk";
import stream from "stream";
import { Repository } from "typeorm";
import type { FileUpload } from "graphql-upload";
import { v4 as generateUUID } from "uuid";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { File } from "@file/entities/File.model";

import { readStreamToBuffer } from "@utils/readStreamToBuffer";
import { getFileType } from "@utils/getFileType";
import getImageSize from "@utils/getImageSize";

const ALLOWED_IMAGE_TYPE_REGEX = /^image\/(png|jpeg|jpg|bmp)$/;

@Injectable()
export class FileService {
    private readonly s3: AWS.S3;
    public readonly defaultBucket = "usalt-images";
    public readonly region = process.env.S3_REGION;

    public constructor(@InjectRepository(File) private readonly fileRepository: Repository<File>) {
        if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
            throw new Error("서버를 시작하기 위해 AWS 키 항목을 설정해야 합니다.");
        }

        this.s3 = new AWS.S3({
            apiVersion: "2006-03-01",
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
            region: process.env.S3_REGION,
        });
    }

    private async checkBucketExists(bucketName: string) {
        try {
            await this.s3
                .headBucket({
                    Bucket: bucketName,
                })
                .promise();

            return true;
        } catch (error) {
            return false;
        }
    }
    private async ensureBucket(bucketName: string) {
        if (await this.checkBucketExists(bucketName)) {
            return;
        }

        await this.s3
            .createBucket({
                Bucket: bucketName,
            })
            .promise();
    }

    public async uploadFile(upload: Promise<FileUpload>, bucketName = this.defaultBucket) {
        const { createReadStream } = await upload;
        const buffer = await readStreamToBuffer(createReadStream());
        const fileType = await getFileType(buffer);
        if (!fileType || !ALLOWED_IMAGE_TYPE_REGEX.test(fileType.mime)) {
            throw new Error("파일 형식이 올바르지 않습니다.");
        }

        const fileStreamGenerator = () => stream.Readable.from(buffer);
        const fileName = `${generateUUID()}.${fileType.ext}`;
        let fileEntity = this.fileRepository.create();
        fileEntity.mime = fileType.mime;
        fileEntity.name = fileName;
        fileEntity.bucketName = bucketName;
        fileEntity.size = buffer.length;
        fileEntity.region = process.env.S3_REGION;
        fileEntity.extension = fileType.ext;

        if (ALLOWED_IMAGE_TYPE_REGEX.test(fileType.mime)) {
            const imageSize = await getImageSize(buffer);
            if (!imageSize.width || !imageSize.height) {
                throw new Error("이미지 크기를 얻어오는데 실패 하였습니다.");
            }

            fileEntity.width = imageSize.width;
            fileEntity.height = imageSize.height;
        }

        fileEntity = await this.fileRepository.save(fileEntity);

        await this.ensureBucket(bucketName);

        const writeStream = new stream.PassThrough();
        const uploadPromise = this.s3
            .upload({
                Bucket: bucketName,
                Key: fileName,
                Body: writeStream,
                ACL: "public-read",
            })
            .promise();

        this.s3.putObject();

        fileStreamGenerator().pipe(writeStream);
        await uploadPromise;

        return fileEntity;
    }

    public async get(fileId: File["id"]) {
        return this.fileRepository.findOne({
            where: {
                id: fileId,
            },
        });
    }
}

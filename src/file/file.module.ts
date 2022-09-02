import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FileService } from "@file/file.service";

import { File } from "@file/entities/File.model";

@Module({
    imports: [TypeOrmModule.forFeature([File])],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule {}

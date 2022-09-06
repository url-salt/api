import { JSDOM } from "jsdom";
import { Repository } from "typeorm";
import fetch from "node-fetch";
import * as base62 from "base62";
import * as _ from "lodash";

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UrlEntry } from "@url/entities/URLEntry.model";
import { UrlCache } from "@url/entities/UrlCache.model";
import { ShortenerSettings } from "@url/entities/ShortenerSettings.model";

import { FileService } from "@file/file.service";
import { File } from "@file/entities/File.model";

import { parseTitleImageFromDocument } from "@utils/parseTitleImageFromDocument";
import { MAXIMUM_EXTERNAL_IMAGE_FILE_SIZE, MINIMUM_URL_DIGITS, URL_AVAILABLE_CHARACTERS } from "@utils/constants";
import { sleep } from "@utils/sleep";
import { Nullable } from "@utils/types";

base62.setCharacterSet(URL_AVAILABLE_CHARACTERS);

@Injectable()
export class UrlService {
    public constructor(
        @InjectRepository(UrlEntry) private readonly urlEntryRepository: Repository<UrlEntry>,
        @InjectRepository(UrlCache) private readonly urlCacheRepository: Repository<UrlCache>,
        @Inject(FileService) private readonly fileService: FileService,
    ) {}

    public getIndexRange(digits: number): [number, number, number] {
        const firstLetter = URL_AVAILABLE_CHARACTERS[0];
        const lastLetter = URL_AVAILABLE_CHARACTERS.at(-1);
        const startIndex = digits === 1 ? 0 : base62.decode("B".padEnd(digits - 1, firstLetter));
        const endIndex = base62.decode("".padStart(digits, lastLetter));

        return [startIndex, endIndex, endIndex - startIndex];
    }
    public async checkIfIndexNumberTaken(value: number) {
        const data = await this.urlEntryRepository
            .createQueryBuilder()
            .select("COUNT(*)", "count")
            .where("indexNo = :id", { id: value })
            .getRawOne<{ count: string }>();

        if (!data) {
            throw new Error("Failed to get index number taken status.");
        }

        return parseInt(data.count, 10) > 0;
    }
    public async getIndexUsageCount(digits: number) {
        const [startIndex, endIndex] = this.getIndexRange(digits);
        const data = await this.urlEntryRepository
            .createQueryBuilder()
            .select("COUNT(*)", "count")
            .where("indexNo BETWEEN :start AND :end", { start: startIndex, end: endIndex })
            .getRawOne<{ count: string }>();

        if (!data) {
            throw new Error("Failed to get index usage count.");
        }

        return parseInt(data.count, 10);
    }
    public async generateNextIndexNumber() {
        let digits = MINIMUM_URL_DIGITS;
        while (true) {
            const [start, end, total] = this.getIndexRange(digits);
            const usage = await this.getIndexUsageCount(digits);

            if (usage >= total) {
                ++digits;
                continue;
            }

            while (true) {
                const target = _.random(start, end);
                const taken = await this.checkIfIndexNumberTaken(target);
                if (taken) {
                    continue;
                }

                return target;
            }
        }
    }

    public async get(id: string | number) {
        if (typeof id === "number") {
            return this.urlEntryRepository.findOneOrFail({
                where: {
                    id,
                },
            });
        }

        return this.urlEntryRepository
            .createQueryBuilder("ue")
            .where("BINARY `ue`.`uniqueId` = :id", { id })
            .getOneOrFail();
    }
    public async shortenUrl(url: string, settings: Nullable<ShortenerSettings>) {
        await sleep(1500);

        const index = await this.generateNextIndexNumber();
        const entry = this.urlEntryRepository.create();
        entry.originalUrl = url;
        entry.uniqueId = base62.encode(index);
        entry.indexNo = index;
        entry.file = settings?.thumbnail ? await this.fileService.uploadFile(settings.thumbnail) : null;
        entry.title = settings?.title || null;
        entry.description = settings?.description || null;

        return this.urlEntryRepository.save(entry);
    }

    public async getUrlCache(entry: UrlEntry): Promise<UrlCache> {
        let cache: UrlCache | null;
        if (entry.cacheId) {
            cache = await this.urlCacheRepository.findOne({
                where: {
                    id: entry.cacheId,
                },
            });

            if (cache) {
                return cache;
            }
        }

        const { description, image, title } = await this.parseData(entry.originalUrl);
        cache = this.urlCacheRepository.create();

        let file: File | null = null;
        if (entry.fileId) {
            file = await this.fileService.get(entry.fileId);
        } else if (image) {
            const imageBuffer = await fetch(image).then(res => res.buffer());
            if (imageBuffer.length <= MAXIMUM_EXTERNAL_IMAGE_FILE_SIZE) {
                file = await this.fileService.uploadFileFromBuffer(imageBuffer);
            }
        }

        if (file) {
            cache.image = `https://${this.fileService.defaultBucket}.s3.${this.fileService.region}.amazonaws.com/${file.name}`;
        }

        cache.title = entry.title || title || null;
        cache.description = entry.description || description || null;
        cache.image = cache.image || image || null;

        const result = await this.urlCacheRepository.save(cache);

        entry.cache = cache;
        await this.urlEntryRepository.save(entry);

        return result;
    }
    public async parseData(url: string) {
        const htmlCode = await fetch(url, {
            headers: {
                "user-agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
            },
        }).then(res => res.text());
        const {
            window: { document },
        } = new JSDOM(htmlCode);

        const title = document.querySelector("title");
        const description = document.querySelector('meta[name="description"]');
        const opengraph = {
            title: document.querySelector('meta[property="og:title"]'),
            description: document.querySelector('meta[property="og:description"]'),
            image: document.querySelector('meta[property="og:image"]'),
        };

        let image: Nullable<string>;
        if (opengraph.image) {
            image = opengraph.image.getAttribute("content");
        } else {
            image = parseTitleImageFromDocument(document);
        }

        return {
            title: opengraph.title?.getAttribute("content") || title?.textContent || null,
            description: opengraph.description?.getAttribute("content") || description?.getAttribute("content") || null,
            image,
        };
    }
}

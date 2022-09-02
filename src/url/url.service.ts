import { JSDOM } from "jsdom";
import { Repository } from "typeorm";

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UrlEntry } from "@url/entities/URLEntry.model";
import { UrlCache } from "@url/entities/UrlCache.model";
import { ShortenerSettings } from "@url/entities/ShortenerSettings.model";

import { FileService } from "@file/file.service";

import { generateCharacterArray } from "@utils/generateCharacterArray";
import { sleep } from "@utils/sleep";
import { Nullable } from "@utils/types";

@Injectable()
export class UrlService {
    private readonly availableCharacters: string = [
        ...generateCharacterArray("A", "Z"), // A~Z
        ...generateCharacterArray("a", "z"), // a~z,
        ...generateCharacterArray("0", "9"), // 0~9
    ].join("");

    public constructor(
        @InjectRepository(UrlEntry) private readonly urlEntryRepository: Repository<UrlEntry>,
        @InjectRepository(UrlCache) private readonly urlCacheRepository: Repository<UrlCache>,
        @Inject(FileService) private readonly fileService: FileService,
    ) {}

    private convertToUniqueId(targetValue: number) {
        const radix = this.availableCharacters.length;
        const arr: string[] = [];
        let mod: number;

        do {
            mod = targetValue % radix;
            targetValue = (targetValue - mod) / radix;
            arr.unshift(this.availableCharacters[mod]);
        } while (targetValue);

        return arr.join("");
    }

    public async get(id: string) {
        return this.urlEntryRepository.createQueryBuilder("ue").where("BINARY `ue`.`uniqueId` = :id", { id }).getOne();
    }
    public async generateNextUniqueId() {
        const entryCount = await this.urlEntryRepository.count();
        return this.convertToUniqueId(entryCount);
    }
    public async shortenUrl(url: string, settings: Nullable<ShortenerSettings>) {
        await sleep(1500);

        const entry = this.urlEntryRepository.create();
        entry.originalUrl = url;
        entry.uniqueId = await this.generateNextUniqueId();
        entry.file = settings?.thumbnail ? await this.fileService.uploadFile(settings.thumbnail) : null;
        entry.title = settings?.title || null;
        entry.description = settings?.description || null;

        return this.urlEntryRepository.save(entry);
    }

    public async getUrlCache(entry: UrlEntry): Promise<UrlCache> {
        let cache: UrlCache | null;
        if (Boolean(entry.cacheId)) {
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
        if (entry.fileId) {
            const file = await this.fileService.get(entry.fileId);
            if (file) {
                cache.image = `https://${this.fileService.defaultBucket}.s3.${this.fileService.region}.amazonaws.com/${file.name}`;
            }
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
        try {
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

            return {
                title: opengraph.title?.getAttribute("content") || title?.textContent || null,
                description:
                    opengraph.description?.getAttribute("content") || description?.getAttribute("content") || null,
                image: opengraph.image?.getAttribute("content"),
            };
        } catch {
            return null;
        }
    }
}

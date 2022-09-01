import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UrlEntry } from "@url/entities/URLEntry.model";
import { generateCharacterArray } from "@utils/generateCharacterArray";

@Injectable()
export class UrlService {
    private readonly availableCharacters: string = [
        ...generateCharacterArray("A", "Z"), // A~Z
        ...generateCharacterArray("a", "z"), // a~z,
        ...generateCharacterArray("0", "9"), // 0~9
    ].join("");

    public constructor(@InjectRepository(UrlEntry) private readonly urlEntryRepository: Repository<UrlEntry>) {}

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

    public async shortenUrl(url: string) {
        const entry = this.urlEntryRepository.create();
        entry.originalUrl = url;
        entry.uniqueId = await this.generateNextUniqueId();

        return this.urlEntryRepository.save(entry);
    }
}

import { Repository } from "typeorm";

import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { StartedTime } from "@hello-world/entities/StartedTime.model";

@Injectable()
export class HelloWorldService implements OnModuleInit {
    public constructor(
        @InjectRepository(StartedTime) private readonly startedTimeRepository: Repository<StartedTime>,
    ) {}

    public async onModuleInit() {
        const item = this.startedTimeRepository.create();
        item.startedAt = new Date();

        await this.startedTimeRepository.save(item);
    }

    public async getLatestStartedTime() {
        const items = await this.startedTimeRepository.find({
            take: 1,
            order: {
                id: "DESC",
            },
        });

        return items[0];
    }
}

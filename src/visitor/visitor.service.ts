import * as _ from "lodash";

import { Queue } from "bull";
import type { Request } from "express";
import { In, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { InjectRepository } from "@nestjs/typeorm";

import { UrlEntry } from "@url/entities/URLEntry.model";

import { VisitorRegisterData } from "@visitor/visitor.processor";
import { VisitLog } from "@visitor/entities/VisitLog.model";

import { Nullable } from "@utils/types";

@Injectable()
export class VisitorService {
    public constructor(
        @InjectQueue("visitor") private readonly visitorQueue: Queue,
        @InjectRepository(VisitLog) private readonly visitLogRepository: Repository<VisitLog>,
    ) {}

    public async getVisitLogCountFromUrlEntity(entity: UrlEntry) {
        const data = await this.visitLogRepository
            .createQueryBuilder("s")
            .select("COUNT(`s`.`id`)", "count")
            .where("`s`.`urlEntryId` = :entityId", { entityId: entity.id })
            .orderBy("`s`.`id`", "DESC")
            .getRawOne<{ count: string }>();

        if (!data) {
            throw new Error("방문 기록 데이터 수를 불러오는데 문제가 발생 하였습니다.");
        }

        return data.count;
    }
    public async getVisitLogsFromUrlEntity(entity: UrlEntry, take: number, before: Nullable<VisitLog["id"]>) {
        let builder = this.visitLogRepository
            .createQueryBuilder("s")
            .select("`s`.`id`")
            .where("`s`.`urlEntryId` = :entityId", { entityId: entity.id })
            .skip(0)
            .take(take)
            .orderBy("`s`.`id`", "DESC");

        if (before) {
            builder = builder.andWhere("`s`.`id` < :before", { before });
        }

        const targetIds = await builder
            .getRawMany<{ id: string }>()
            .then(res => res.map(item => parseInt(item.id, 10)));

        const result = await this.visitLogRepository.find({
            where: {
                id: In(targetIds),
            },
        });

        const resultMap = _.chain(result)
            .keyBy(i => i.id)
            .mapValues(i => i)
            .value();

        return targetIds.map(id => resultMap[id]);
    }

    public async registerVisitor(req: Request, urlEntry: UrlEntry) {
        const data: VisitorRegisterData = {
            userAgent: req.headers["user-agent"],
            ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
            urlEntryId: urlEntry.id,
        };

        await this.visitorQueue.add("register", data);
    }
}

import { Job } from "bull";
import fetch from "node-fetch";
import parseUserAgent from "ua-parser-js";
import { Repository } from "typeorm";
import isBot from "isbot";

import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { InjectRepository } from "@nestjs/typeorm";

import { VisitLog } from "@visitor/entities/VisitLog.model";

import { UrlService } from "@url/url.service";
import { UrlEntry } from "@url/entities/URLEntry.model";

import { IPAPIResult } from "@utils/types";
import { pubSub } from "@utils/pubSub";
import { VISIT_LOG_ADDED_SUBSCRIPTION } from "@visitor/visitor.resolver";

export interface VisitorRegisterData {
    ip?: string;
    userAgent?: string;
    urlEntryId: UrlEntry["id"];
}

@Injectable()
@Processor("visitor")
export class VisitorProcessor {
    private readonly logger = new Logger(VisitorProcessor.name);
    private readonly ipBlacklists: ReadonlyArray<string> = ["::1"];
    private readonly userAgentBlacklists: ReadonlyArray<string> = [];

    public constructor(
        @InjectRepository(VisitLog) private readonly visitLogRepository: Repository<VisitLog>,
        @Inject(UrlService) private readonly urlService: UrlService,
    ) {}

    public async getCountryFromIP(ip: string) {
        const result: IPAPIResult = await fetch(`http://ip-api.com/json/${ip}?fields=49411`).then(res => res.json());
        if (result.status === "fail") {
            throw new Error(result.message);
        }

        return result;
    }

    @Process("register")
    public async handleRegisterVisitor(job: Job<VisitorRegisterData>) {
        const { data } = job;
        this.logger.log(`Requested to process a new visitor data: [${data.ip}, ${data.userAgent}]`);

        if (!data.ip || this.ipBlacklists.includes(data.ip)) {
            throw new Error("Invalid IP Address.");
        }

        if (!data.userAgent || this.userAgentBlacklists.includes(data.userAgent)) {
            throw new Error("Invalid User Agent.");
        }

        const log = this.visitLogRepository.create();

        try {
            const { country, countryCode, timezone } = await this.getCountryFromIP(data.ip);
            log.country = country;
            log.countryCode = countryCode;
            log.timezone = timezone;
        } catch {}

        try {
            const { browser, os } = parseUserAgent(data.userAgent);
            log.browser = browser.name;
            log.browserVersion = browser.version;
            log.os = os.name;
            log.osVersion = os.version;
        } catch {}

        log.ip = data.ip;
        log.userAgent = data.userAgent;
        log.isBot = isBot(data.userAgent);
        log.urlEntry = await this.urlService.get(data.urlEntryId);

        const visitLog = await this.visitLogRepository.save(log);
        await pubSub.publish(VISIT_LOG_ADDED_SUBSCRIPTION, { [VISIT_LOG_ADDED_SUBSCRIPTION]: visitLog });

        this.logger.log(`Successfully registered visitor information: [${data.ip}, ${data.userAgent}]`);
    }

    @OnQueueFailed({ name: "register" })
    public async onRegisterQueueFailed({ data }: Job<VisitorRegisterData>, error: Error) {
        this.logger.error(`Failed to process visitor data: [${data.ip}, ${data.userAgent}], ${error.message}`);
    }
}

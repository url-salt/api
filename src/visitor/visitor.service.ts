import { Queue } from "bull";
import type { Request } from "express";

import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";

import { UrlEntry } from "@url/entities/URLEntry.model";

import { VisitorRegisterData } from "@visitor/visitor.processor";

@Injectable()
export class VisitorService {
    public constructor(@InjectQueue("visitor") private readonly visitorQueue: Queue) {}

    public async registerVisitor(req: Request, urlEntry: UrlEntry) {
        const data: VisitorRegisterData = {
            userAgent: req.headers["user-agent"],
            ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
            urlEntryId: urlEntry.id,
        };

        await this.visitorQueue.add("register", data);
    }
}

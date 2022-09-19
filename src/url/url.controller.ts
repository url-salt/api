import type { Request, Response } from "express";
import isBot from "isbot";

import { Controller, Get, Inject, Param, Req, Res } from "@nestjs/common";

import { UrlService } from "@url/url.service";
import { UrlEntry } from "@url/entities/URLEntry.model";

import { FileService } from "@file/file.service";
import { VisitorService } from "@visitor/visitor.service";

import { generateBotCode } from "@utils/generateBotCode";
import { Nullable } from "@utils/types";

@Controller("/")
export class UrlController {
    private readonly appUrl: string;

    public constructor(
        @Inject(UrlService) private readonly urlService: UrlService,
        @Inject(FileService) private readonly fileService: FileService,
        @Inject(VisitorService) private readonly visitorService: VisitorService,
    ) {
        this.appUrl = `http${process.env.NODE_ENV === "production" ? "s" : ""}://${process.env.APP_URL}`;
    }

    @Get("/")
    public async root(@Res() response: Response) {
        response.redirect(302, this.appUrl);
    }

    @Get("/:id/analytics")
    public async analytics(@Param("id") id: string, @Res() response: Response) {
        if (!id) {
            response.redirect(302, this.appUrl);
            return;
        }

        const entry = await this.urlService.get(id);
        if (!entry) {
            response.redirect(302, this.appUrl);
            return;
        }

        response.redirect(302, `${this.appUrl}/analytics/${id}`);
    }

    @Get("/:id")
    public async processGet(@Param("id") id: string, @Res() response: Response, @Req() request: Request) {
        if (!id) {
            response.redirect(302, this.appUrl);
            return;
        }

        let entry: Nullable<UrlEntry> = null;
        try {
            entry = await this.urlService.get(id);
        } catch {
            response.redirect(302, this.appUrl);
            return;
        }

        if (!entry) {
            response.redirect(302, this.appUrl);
            return;
        }

        await this.visitorService.registerVisitor(request, entry);
        if (isBot(request.headers["user-agent"])) {
            const { title, description, image } = await this.urlService.getUrlCache(entry);
            response.send(
                generateBotCode({
                    title,
                    description,
                    image,
                    url: entry.originalUrl,
                }),
            );
            return;
        }

        return response.redirect(302, entry.originalUrl);
    }
}

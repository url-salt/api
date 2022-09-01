import type { Response } from "express";

import { Controller, Get, Inject, Param, Res } from "@nestjs/common";

import { UrlService } from "@url/url.service";

@Controller("shorts")
export class UrlController {
    public constructor(@Inject(UrlService) private readonly urlService: UrlService) {}

    @Get("/:id")
    public async processGet(@Param("id") id: string, @Res() response: Response) {
        if (!id) {
            response.redirect(302, `https://${process.env.APP_URL}`);
            return;
        }

        const entry = await this.urlService.get(id);
        if (!entry) {
            response.redirect(302, `https://${process.env.APP_URL}`);
            return;
        }

        console.log(entry);

        return response.redirect(302, entry.originalUrl);
    }
}

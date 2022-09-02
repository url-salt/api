import type { Response, Request } from "express";
import isBot from "isbot";

import { Controller, Get, Inject, Param, Req, Res } from "@nestjs/common";

import { UrlService } from "@url/url.service";
import { FileService } from "@file/file.service";

@Controller("/")
export class UrlController {
    public constructor(
        @Inject(UrlService) private readonly urlService: UrlService,
        @Inject(FileService) private readonly fileService: FileService,
    ) {}

    @Get("/")
    public async root(@Res() response: Response) {
        response.redirect(302, `https://${process.env.APP_URL}`);
    }

    @Get("/:id")
    public async processGet(@Param("id") id: string, @Res() response: Response, @Req() request: Request) {
        if (!id) {
            response.redirect(302, `https://${process.env.APP_URL}`);
            return;
        }

        const entry = await this.urlService.get(id);
        if (!entry) {
            response.redirect(302, `https://${process.env.APP_URL}`);
            return;
        }

        if (isBot(request.headers["user-agent"])) {
            const { title, description, image } = await this.urlService.getUrlCache(entry);

            response.send(`
<!DOCTYPE HTML>
<html lang="ko">
    <head>
        <title>${title || ""}</title>
        <meta name="description" content="${description || ""}" />
        <meta property="og:title" content="${title || ""}" />
        <meta property="og:description" content="${description || ""}" />
        ${image ? `<meta property="og:image" content="${image || ""}" />` : ""}
    </head>
    <body>
    </body>
</html>
            `);
            return;
        }

        return response.redirect(302, entry.originalUrl);
    }
}

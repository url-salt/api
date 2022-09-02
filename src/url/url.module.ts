import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UrlService } from "@url/url.service";
import { UrlResolver } from "@url/url.resolver";
import { UrlController } from "@url/url.controller";

import { UrlEntry } from "@url/entities/URLEntry.model";
import { UrlCache } from "@url/entities/UrlCache.model";

import { FileModule } from "@file/file.module";

@Module({
    imports: [TypeOrmModule.forFeature([UrlEntry, UrlCache]), FileModule],
    providers: [UrlService, UrlResolver],
    controllers: [UrlController],
})
export class UrlModule {}

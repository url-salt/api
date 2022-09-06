import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VisitorModule } from "@visitor/visitor.module";
import { FileModule } from "@file/file.module";

import { UrlService } from "@url/url.service";
import { UrlResolver } from "@url/url.resolver";
import { UrlController } from "@url/url.controller";

import { UrlEntry } from "@url/entities/URLEntry.model";
import { UrlCache } from "@url/entities/UrlCache.model";

@Module({
    imports: [TypeOrmModule.forFeature([UrlEntry, UrlCache]), FileModule, VisitorModule],
    providers: [UrlService, UrlResolver],
    controllers: [UrlController],
    exports: [UrlService],
})
export class UrlModule {}

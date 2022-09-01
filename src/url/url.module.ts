import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UrlService } from "@url/url.service";
import { UrlResolver } from "@url/url.resolver";

import { UrlEntry } from "@url/entities/URLEntry.model";
import { UrlController } from "./url.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UrlEntry])],
    providers: [UrlService, UrlResolver],
    controllers: [UrlController],
})
export class UrlModule {}

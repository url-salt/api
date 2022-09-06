import { forwardRef, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";

import { TypeOrmModule } from "@nestjs/typeorm";

import { VisitorService } from "@visitor/visitor.service";
import { VisitorResolver } from "@visitor/visitor.resolver";
import { VisitorProcessor } from "@visitor/visitor.processor";

import { VisitLog } from "@visitor/entities/VisitLog.model";

import { UrlModule } from "@url/url.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([VisitLog]),
        BullModule.registerQueue({
            name: "visitor",
        }),
        forwardRef(() => UrlModule),
    ],
    providers: [VisitorService, VisitorResolver, VisitorProcessor],
    exports: [VisitorService],
})
export class VisitorModule {}

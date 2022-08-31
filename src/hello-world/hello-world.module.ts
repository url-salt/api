import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { HelloWorldService } from "@hello-world/hello-world.service";
import { HelloWorldResolver } from "@hello-world/hello-world.resolver";

import { StartedTime } from "@hello-world/entities/StartedTime.model";

@Module({
    imports: [TypeOrmModule.forFeature([StartedTime])],
    providers: [HelloWorldService, HelloWorldResolver],
})
export class HelloWorldModule {}

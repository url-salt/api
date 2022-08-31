import { Inject } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { HelloWorldService } from "@hello-world/hello-world.service";

import { StartedTime } from "@hello-world/entities/StartedTime.model";

@Resolver()
export class HelloWorldResolver {
    public constructor(@Inject(HelloWorldService) private readonly helloWorldService: HelloWorldService) {}

    @Query(() => String)
    public async helloWorld() {
        return "Hello World";
    }

    @Query(() => StartedTime)
    public async latestStartedTime() {
        return this.helloWorldService.getLatestStartedTime();
    }
}

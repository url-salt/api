import { Args, ResolveField, Resolver, Root, Subscription } from "@nestjs/graphql";

import { VisitLog } from "@visitor/entities/VisitLog.model";

import { pubSub } from "@utils/pubSub";

export const VISIT_LOG_ADDED_SUBSCRIPTION = "visitLogAdded";

@Resolver(() => VisitLog)
export class VisitorResolver {
    @Subscription(() => VisitLog, {
        name: VISIT_LOG_ADDED_SUBSCRIPTION,
        filter: (payload, variables) => {
            return payload[VISIT_LOG_ADDED_SUBSCRIPTION].urlEntry.uniqueId === variables.uniqueId;
        },
        nullable: true,
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async visitLogAdded(@Args("uniqueId", { type: () => String }) uniqueId: string) {
        return pubSub.asyncIterator(VISIT_LOG_ADDED_SUBSCRIPTION);
    }

    @ResolveField(() => String)
    public async ip(@Root() root: VisitLog) {
        return [...root.ip.split(".").slice(0, 2), "*", "*"].join(".");
    }
}

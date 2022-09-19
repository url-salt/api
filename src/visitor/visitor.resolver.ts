import { Args, Int, ResolveField, Resolver, Root, Subscription } from "@nestjs/graphql";

import { VisitLog } from "@visitor/entities/VisitLog.model";

import { pubSub } from "@utils/pubSub";

export const VISIT_LOG_ADDED_SUBSCRIPTION = "visitLogAdded";
export const HIT_COUNT_CHANGED_SUBSCRIPTION = "hitCountChanged";

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

    @Subscription(() => Int, {
        name: HIT_COUNT_CHANGED_SUBSCRIPTION,
        resolve: value => {
            return value[HIT_COUNT_CHANGED_SUBSCRIPTION].count;
        },
        filter: (payload, variables) => {
            return payload[HIT_COUNT_CHANGED_SUBSCRIPTION].uniqueId === variables.uniqueId;
        },
        nullable: false,
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async hitCountChanged(@Args("uniqueId", { type: () => String }) uniqueId: string) {
        return pubSub.asyncIterator(HIT_COUNT_CHANGED_SUBSCRIPTION);
    }

    @ResolveField(() => String)
    public async ip(@Root() root: VisitLog) {
        return [...root.ip.split(".").slice(0, 2), "*", "*"].join(".");
    }
}

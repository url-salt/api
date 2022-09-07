import { ResolveField, Resolver, Root } from "@nestjs/graphql";
import { VisitLog } from "@visitor/entities/VisitLog.model";

@Resolver(() => VisitLog)
export class VisitorResolver {
    @ResolveField(() => String)
    public async ip(@Root() root: VisitLog) {
        return [...root.ip.split(".").slice(0, 2), "*", "*"].join(".");
    }
}

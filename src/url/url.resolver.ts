import { Inject } from "@nestjs/common";
import { Args, Int, Mutation, Query, ResolveField, Resolver, Root } from "@nestjs/graphql";

import { UrlService } from "@url/url.service";
import { ProxyService } from "@proxy/proxy.service";

import { VisitorService } from "@visitor/visitor.service";
import { VisitLog } from "@visitor/entities/VisitLog.model";

import { UrlEntry } from "@url/entities/URLEntry.model";
import { ShortenerSettings } from "@url/entities/ShortenerSettings.model";
import { Nullable } from "@utils/types";

@Resolver(() => UrlEntry)
export class UrlResolver {
    public constructor(
        @Inject(UrlService) private readonly urlService: UrlService,
        @Inject(VisitorService) private readonly visitorService: VisitorService,
        @Inject(ProxyService) private readonly proxyService: ProxyService,
    ) {}

    @Query(() => UrlEntry, { nullable: true })
    public async url(@Args("id", { type: () => String }) id: string) {
        return this.urlService.get(id);
    }

    @Mutation(() => UrlEntry)
    public async shortenUrl(
        @Args("url", { type: () => String }) url: string,
        @Args("settings", { type: () => ShortenerSettings, nullable: true }) settings: Nullable<ShortenerSettings>,
    ) {
        return this.urlService.shortenUrl(url, settings);
    }

    @ResolveField(() => String, { name: "url" })
    public async urlField(@Root() root: UrlEntry) {
        return `${this.proxyService.getApiUrl()}${root.uniqueId}`;
    }

    @ResolveField(() => [VisitLog])
    public async visitLogs(
        @Root() root: UrlEntry,
        @Args("take", { type: () => Int }) take: number,
        @Args("before", { type: () => Int, nullable: true }) before: Nullable<number>,
    ) {
        return this.visitorService.getVisitLogsFromUrlEntity(root, take, before);
    }

    @ResolveField(() => Int)
    public async hits(@Root() root: UrlEntry) {
        return this.visitorService.getVisitLogCountFromUrlEntity(root);
    }
}

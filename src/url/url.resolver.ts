import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, ResolveField, Resolver, Root } from "@nestjs/graphql";

import { UrlService } from "@url/url.service";

import { UrlEntry } from "@url/entities/URLEntry.model";
import { ShortenerSettings } from "@url/entities/ShortenerSettings.model";
import { Nullable } from "@utils/types";

@Resolver(() => UrlEntry)
export class UrlResolver {
    public constructor(@Inject(UrlService) private readonly urlService: UrlService) {}

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
        return `${process.env.SHORTENED_BASE_URL}${root.uniqueId}`;
    }
}

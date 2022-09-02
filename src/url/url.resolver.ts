import { Inject } from "@nestjs/common";
import { Args, Mutation, ResolveField, Resolver, Root } from "@nestjs/graphql";

import { UrlService } from "@url/url.service";

import { UrlEntry } from "@url/entities/URLEntry.model";
import { ShortenerSettings } from "@url/entities/ShortenerSettings.model";
import { Nullable } from "@utils/types";

@Resolver(() => UrlEntry)
export class UrlResolver {
    public constructor(@Inject(UrlService) private readonly urlService: UrlService) {}

    @Mutation(() => UrlEntry)
    public async shortenUrl(
        @Args("url", { type: () => String }) url: string,
        @Args("settings", { type: () => ShortenerSettings, nullable: true }) settings: Nullable<ShortenerSettings>,
    ) {
        return this.urlService.shortenUrl(url, settings);
    }

    @ResolveField(() => String)
    public async url(@Root() root: UrlEntry) {
        return `${process.env.SHORTENED_BASE_URL}${root.uniqueId}`;
    }
}

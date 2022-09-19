import { JSDOM } from "jsdom";

import { Nullable } from "@utils/types";

export enum SEOItemType {
    Title,
    MetaName,
    MetaProperty,
}

export type SEOItem =
    | SEOItemType.Title
    | [SEOItemType.MetaProperty | SEOItemType.MetaName, string]
    | [SEOItemType.MetaProperty | SEOItemType.MetaName, string, string];

const SEO_ITEMS: Record<string, SEOItem[]> = {
    title: [SEOItemType.Title, [SEOItemType.MetaProperty, "og:title"], [SEOItemType.MetaName, "twitter:title"]],
    description: [
        [SEOItemType.MetaName, "description"],
        [SEOItemType.MetaProperty, "og:description"],
        [SEOItemType.MetaName, "twitter:description"],
    ],
    image: [
        [SEOItemType.MetaProperty, "og:image"],
        [SEOItemType.MetaName, "twitter:image"],
        [SEOItemType.MetaName, "twitter:card", "photo"],
    ],
    url: [[SEOItemType.MetaProperty, "og:url"]],
};

export function generateBotCode(values: Record<string, Nullable<string>>) {
    const jsdom = new JSDOM(
        `
<!DOCTYPE HTML>
<html lang="ko">
    <head></head>
    <body></body>
</html>
`.trim(),
    );

    const {
        window: { document },
    } = jsdom;

    for (const [name, items] of Object.entries(SEO_ITEMS)) {
        const targetValue = values[name];
        for (const item of items) {
            if (!targetValue) {
                return;
            }

            if (Array.isArray(item)) {
                const targetName = item[0] === SEOItemType.MetaName ? "name" : "property";
                const meta = document.createElement("meta");

                meta.setAttribute(targetName, item[1]);
                meta.setAttribute("content", item.length > 2 ? item[2] || targetValue : targetValue);
                document.head.appendChild(meta);
            } else {
                const title = document.createElement("title");
                title.innerHTML = targetValue;
                document.head.appendChild(title);
            }
        }
    }

    return jsdom.serialize();
}

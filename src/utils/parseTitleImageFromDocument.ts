export function parseTitleImageFromDocument(document: Document) {
    const allImages = document.querySelectorAll("img");
    if (allImages.length <= 0) {
        return null;
    }

    const [{ src }] = allImages;
    if (!src) {
        return null;
    }

    return src;
}

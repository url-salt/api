import sharp from "sharp";

export default async function getImageSize(buffer: Buffer) {
    const metadata = await sharp(buffer).metadata();

    return { width: metadata.width, height: metadata.height };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function getFileType(buffer: Buffer) {
    const { fileTypeFromBuffer } = await import("file-type");
    return fileTypeFromBuffer(buffer);
}

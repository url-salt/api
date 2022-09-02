import * as stream from "stream";

export async function readStreamToBuffer(stream: stream.Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const buffer = Array<any>();

        stream.on("data", chunk => buffer.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(buffer)));
        stream.on("error", err => reject(`error converting stream - ${err}`));
    });
}

import * as ngrok from "ngrok";

import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class ProxyService implements OnModuleInit {
    private url: string | null = null;

    public async onModuleInit() {
        if (process.env.NODE_ENV === "production") {
            return;
        }

        if (!process.env.NGROK_AUTH_TOKEN) {
            throw new Error("You should provide ngrok auth token data.");
        }

        this.url = await ngrok.connect({
            region: "jp",
            proto: "http",
            authtoken: process.env.NGROK_AUTH_TOKEN,
            addr: 30001,
        });

        this.url = `${this.url}/`;
    }

    public getApiUrl() {
        if (process.env.NODE_ENV === "production") {
            if (!process.env.SHORTENED_BASE_URL) {
                throw new Error("You should provide shortened base url data.");
            }

            return process.env.SHORTENED_BASE_URL;
        }

        if (!this.url) {
            throw new Error("Proxy backed base url data wasn't initialized.");
        }

        return this.url;
    }
}

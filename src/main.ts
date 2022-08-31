import * as path from "path";
import { config } from "dotenv";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "@root/app.module";

config({
    path: path.join(process.cwd(), process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"),
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(30001);
}

bootstrap();

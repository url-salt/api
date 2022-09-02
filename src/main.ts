import * as path from "path";
import { config } from "dotenv";
import { graphqlUploadExpress } from "graphql-upload";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "@root/app.module";

config({
    path: path.join(process.cwd(), process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"),
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

    await app.listen(30001);
}

bootstrap();

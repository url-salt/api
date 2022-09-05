import * as path from "path";
import { config } from "dotenv";
import { graphqlUploadExpress } from "graphql-upload";

import * as Sentry from "@sentry/node";
import { SentryInterceptor } from "@sentry/sentry.interceptor";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "@root/app.module";

config({
    path: path.join(process.cwd(), process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"),
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
    app.useGlobalInterceptors(new SentryInterceptor());

    Sentry.init({
        environment: process.env.NODE_ENV === "production" ? "prod" : "dev",
        dsn: process.env.SENTRY_DSN,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });

    await app.listen(30001);
}

bootstrap();

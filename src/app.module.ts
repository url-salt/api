import * as path from "path";

import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";

import { UrlModule } from "@url/url.module";
import { FileModule } from "@file/file.module";
import { VisitorModule } from "@visitor/visitor.module";

import { createGraphQLContext } from "@utils/createGraphQLContext";

@Module({
    imports: [
        BullModule.forRootAsync({
            useFactory: () => {
                return {
                    redis: {
                        host: process.env.REDIS_HOST || "localhost",
                        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
                    },
                };
            },
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => {
                return {
                    type: "mysql",
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                    entities: ["./dist/**/*.model{.ts,.js}"],
                    autoLoadEntities: true,
                    dropSchema: false,
                    synchronize: false,
                    migrationsRun: true,
                    timezone: "Z",
                    logging: false,
                    migrations: ["dist/src/migrations/**/*{.ts,.js}"],
                };
            },
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [],
            inject: [],
            useFactory: () => {
                return {
                    cors: {
                        origin: "http://localhost:30000",
                        credentials: true,
                    },
                    installSubscriptionHandlers: true,
                    autoSchemaFile: path.join(
                        process.cwd(),
                        process.env.NODE_ENV === "production" ? "./schema.gql" : "../app/schema.gql",
                    ),
                    context: createGraphQLContext,
                };
            },
        }),
        UrlModule,
        FileModule,
        VisitorModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

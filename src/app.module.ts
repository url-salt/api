import * as path from "path";

import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";

import { HelloWorldModule } from "@hello-world/hello-world.module";
import { UrlModule } from "@url/url.module";

import { createGraphQLContext } from "@utils/createGraphQLContext";

@Module({
    imports: [
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
        HelloWorldModule,
        UrlModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

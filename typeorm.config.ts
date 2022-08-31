import { DataSource } from "typeorm";
import { config } from "dotenv";
import * as path from "path";

config({
    path: path.join(process.cwd(), ".env.development"),
});

export default new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dropSchema: false,
    entities: ["./src/**/entities/*.model.ts"],
    synchronize: false,
    migrationsRun: true,
    logging: false,
    timezone: "Z",
    migrations: ["dist/migrations/**/*{.ts,.js}"],
});

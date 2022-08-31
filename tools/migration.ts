// eslint-disable-next-line @typescript-eslint/no-var-requires
import { commandSync } from "execa";
import * as fs from "fs-extra";
import * as path from "path";

(async () => {
    const migrationName = process.argv.at(-1);
    const { stdout } = commandSync(
        `yarn typeorm-ts-node-commonjs migration:generate -d ./typeorm.config.ts --dr ${migrationName}`,
    );
    const firstLineIndex = stdout.split("\n").findIndex(line => line.startsWith("import { MigrationInterface"));
    const content = stdout.split("\n").slice(firstLineIndex).join("\n").trim();
    const targetDirectory = path.join(process.cwd(), "src", "migrations");
    const matches = /export class [A-Za-z]*?([0-9]*?) implements MigrationInterface/g.exec(content);

    fs.ensureDirSync(targetDirectory);
    await fs.writeFile(path.join(targetDirectory, `${matches[1]}-${process.argv.at(-1)}.ts`), content);
})();

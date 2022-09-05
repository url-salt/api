import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlIndexNumberColumn1662363443756 implements MigrationInterface {
    name = "AddUrlIndexNumberColumn1662363443756";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_016f10a5444ca91a35b037094f\` ON \`url-entries\``);
        await queryRunner.query(`ALTER TABLE \`url-entries\` ADD \`indexNo\` int NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE \`url-entries\` ADD UNIQUE INDEX \`IDX_ce62f0809343c5833775b28549\` (\`indexNo\`)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP INDEX \`IDX_ce62f0809343c5833775b28549\``);
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP COLUMN \`indexNo\``);
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`IDX_016f10a5444ca91a35b037094f\` ON \`url-entries\` (\`cacheId\`)`,
        );
    }
}

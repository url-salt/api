import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlEntryOriginalUrlColumn1661996014820 implements MigrationInterface {
    name = "AddUrlEntryOriginalUrlColumn1661996014820";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`url-entries\` ADD \`originalUrl\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP COLUMN \`originalUrl\``);
    }
}

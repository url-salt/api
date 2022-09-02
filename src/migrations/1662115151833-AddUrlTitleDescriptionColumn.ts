import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlTitleDescriptionColumn1662115151833 implements MigrationInterface {
    name = "AddUrlTitleDescriptionColumn1662115151833";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`url-entries\` ADD \`title\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`url-entries\` ADD \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP COLUMN \`title\``);
    }
}

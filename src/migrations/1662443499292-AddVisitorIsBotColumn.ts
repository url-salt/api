import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVisitorIsBotColumn1662443499292 implements MigrationInterface {
    name = "AddVisitorIsBotColumn1662443499292";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`visit-logs\` ADD \`isBot\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`visit-logs\` DROP COLUMN \`isBot\``);
    }
}

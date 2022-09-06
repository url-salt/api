import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVisitorBrowserOSVersionColumn1662444782821 implements MigrationInterface {
    name = "AddVisitorBrowserOSVersionColumn1662444782821";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`visit-logs\` ADD \`browserVersion\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`visit-logs\` ADD \`osVersion\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`visit-logs\` DROP COLUMN \`osVersion\``);
        await queryRunner.query(`ALTER TABLE \`visit-logs\` DROP COLUMN \`browserVersion\``);
    }
}

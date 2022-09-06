import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVisitorTimeZoneColumn1662444249341 implements MigrationInterface {
    name = "AddVisitorTimeZoneColumn1662444249341";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`visit-logs\` ADD \`timezone\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`visit-logs\` DROP COLUMN \`timezone\``);
    }
}

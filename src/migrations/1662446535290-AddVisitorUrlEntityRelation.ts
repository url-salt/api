import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVisitorUrlEntityRelation1662446535290 implements MigrationInterface {
    name = "AddVisitorUrlEntityRelation1662446535290";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`visit-logs\` ADD \`urlEntryId\` int NULL`);
        await queryRunner.query(
            `ALTER TABLE \`visit-logs\` ADD CONSTRAINT \`FK_f4fcb34543d7192927a90c216ec\` FOREIGN KEY (\`urlEntryId\`) REFERENCES \`url-entries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`visit-logs\` DROP FOREIGN KEY \`FK_f4fcb34543d7192927a90c216ec\``);
        await queryRunner.query(`ALTER TABLE \`visit-logs\` DROP COLUMN \`urlEntryId\``);
    }
}

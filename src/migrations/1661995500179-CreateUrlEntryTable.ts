import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrlEntryTable1661995500179 implements MigrationInterface {
    name = "CreateUrlEntryTable1661995500179";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`url-entries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uniqueId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`url-entries\``);
    }
}

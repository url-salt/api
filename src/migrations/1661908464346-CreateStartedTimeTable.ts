import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStartedTimeTable1661908464346 implements MigrationInterface {
    name = "CreateStartedTimeTable1661908464346";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`started-time\` (\`id\` int NOT NULL AUTO_INCREMENT, \`startedAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`started-time\``);
    }
}

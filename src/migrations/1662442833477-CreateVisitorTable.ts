import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVisitorTable1662442833477 implements MigrationInterface {
    name = "CreateVisitorTable1662442833477";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`visit-logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ip\` varchar(35) NOT NULL, \`userAgent\` text NOT NULL, \`country\` varchar(255) NULL, \`countryCode\` varchar(15) NULL, \`browser\` varchar(255) NULL, \`os\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`visit-logs\``);
    }
}

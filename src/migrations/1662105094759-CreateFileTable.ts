import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileTable1662105094759 implements MigrationInterface {
    name = "CreateFileTable1662105094759";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`files\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`mime\` varchar(100) NOT NULL, \`size\` int NOT NULL, \`extension\` varchar(25) NOT NULL, \`bucketName\` varchar(255) NOT NULL, \`region\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(`ALTER TABLE \`url-entries\` ADD \`fileId\` int NULL`);
        await queryRunner.query(
            `ALTER TABLE \`url-entries\` ADD UNIQUE INDEX \`IDX_1447282bf4014367b2e6bebc90\` (\`fileId\`)`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`REL_1447282bf4014367b2e6bebc90\` ON \`url-entries\` (\`fileId\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`url-entries\` ADD CONSTRAINT \`FK_1447282bf4014367b2e6bebc908\` FOREIGN KEY (\`fileId\`) REFERENCES \`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP FOREIGN KEY \`FK_1447282bf4014367b2e6bebc908\``);
        await queryRunner.query(`DROP INDEX \`REL_1447282bf4014367b2e6bebc90\` ON \`url-entries\``);
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP INDEX \`IDX_1447282bf4014367b2e6bebc90\``);
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP COLUMN \`fileId\``);
        await queryRunner.query(`DROP TABLE \`files\``);
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrlCacheTable1662119601669 implements MigrationInterface {
    name = "CreateUrlCacheTable1662119601669";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`url-caches\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` text NULL, \`description\` text NULL, \`image\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(`ALTER TABLE \`url-entries\` ADD \`cacheId\` int NULL`);
        await queryRunner.query(
            `ALTER TABLE \`url-entries\` ADD UNIQUE INDEX \`IDX_016f10a5444ca91a35b037094f\` (\`cacheId\`)`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`REL_016f10a5444ca91a35b037094f\` ON \`url-entries\` (\`cacheId\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`url-entries\` ADD CONSTRAINT \`FK_016f10a5444ca91a35b037094f1\` FOREIGN KEY (\`cacheId\`) REFERENCES \`url-caches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP FOREIGN KEY \`FK_016f10a5444ca91a35b037094f1\``);
        await queryRunner.query(`DROP INDEX \`REL_016f10a5444ca91a35b037094f\` ON \`url-entries\``);
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP INDEX \`IDX_016f10a5444ca91a35b037094f\``);
        await queryRunner.query(`ALTER TABLE \`url-entries\` DROP COLUMN \`cacheId\``);
        await queryRunner.query(`DROP TABLE \`url-caches\``);
    }
}

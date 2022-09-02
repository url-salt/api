import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileImageDimensionColumn1662108716091 implements MigrationInterface {
    name = "AddFileImageDimensionColumn1662108716091";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_1447282bf4014367b2e6bebc90\` ON \`url-entries\``);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`width\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`height\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`height\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`width\``);
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`IDX_1447282bf4014367b2e6bebc90\` ON \`url-entries\` (\`fileId\`)`,
        );
    }
}

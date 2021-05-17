import { Germany } from "./../seed/germany"

import { getRepository, MigrationInterface, QueryRunner } from "typeorm"

export class Cities1603628811970 implements MigrationInterface {
  public async up(): Promise<void> {
    await getRepository("city").save(Germany)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

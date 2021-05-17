import { Role } from "src/components/user/user.entity";
import { getRepository, MigrationInterface, QueryRunner } from "typeorm";

export class user1609245609130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository("user").save({
      email: process.env.ADMIN_USER_EMAIL,
      name: process.env.ADMIN_USER_NAME,
      roles: Role.Admin,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

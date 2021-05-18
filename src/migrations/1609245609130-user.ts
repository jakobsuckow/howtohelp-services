import { Role } from "src/components/user/user.entity";
import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";
export class user1609245609130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedEmail = await bcrypt.hash(process.env.ADMIN_USER_EMAIL as string, 10);
    await getRepository("user").save({
      email: hashedEmail,
      name: process.env.ADMIN_USER_NAME,
      roles: Role.Admin,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

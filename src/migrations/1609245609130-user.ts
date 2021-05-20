import { Role } from "src/components/user/user.entity";
import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { CryptoService } from "src/components/crypto/crypto.service";
export class user1609245609130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const cryptoService = new CryptoService();
    await getRepository("user").save({
      email: await cryptoService.hash(process.env.ADMIN_USER_EMAIL as string),
      name: process.env.ADMIN_USER_NAME,
      roles: Role.Admin,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmailDto, VerificationDto } from "./user.dto";
import { UserEntity } from "./user.entity";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { TwilioService } from "../twilio/twilio.service";
import { LoggerService } from "../logger/logger.service";
import { Role } from "../roles/roles.enum";
import { CryptoService } from "../crypto/crypto.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
    private readonly loggerService: LoggerService,
    private readonly cryptoService: CryptoService
  ) {}
  async upsert(data: any): Promise<UserEntity> {
    return await this.userRepository.save(data);
  }

  async findOne(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async findall(): Promise<UserEntity[]> {
    const query = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.pins", "pin")
      .getMany();
    return query;
  }

  private async userExistsCheck({ email }: { email: string }): Promise<UserEntity> {
    this.loggerService.log(email);
    const hash = await this.cryptoService.hash(email);
    this.loggerService.log(hash);
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.email = :hash", { hash })
      .getOne();
    if (user) return user;
  }

  private async generateJWT(user: UserEntity) {
    const accessToken = jwt.sign(
      {
        name: user.name,
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      this.configService.get("JWT_SECRET"),
      {
        expiresIn: "2h",
      }
    );
    const refreshToken = jwt.sign(
      {
        name: user.name,
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      this.configService.get("JWT_SECRET"),
      {
        expiresIn: "14d",
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public async verifyToken(token: string): Promise<UserEntity> {
    let decoded = null;

    try {
      decoded = jwt.verify(token, this.configService.get("JWT_SECRET"));
    } catch (error) {
      throw new HttpException("User not verified", HttpStatus.FORBIDDEN);
    }

    const user = await this.findOne(decoded.id);

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async createUser({ email, name }): Promise<UserEntity> {
    // Check if user email is already connected to a user
    const existingUser = await this.userExistsCheck({ email });

    if (existingUser) {
      return existingUser;
    }

    let user = new UserEntity();
    user.email = email;
    user.name = name;

    const saved = await this.userRepository.save(user);
    if (!saved) {
      throw new HttpException("User not created", HttpStatus.BAD_REQUEST);
    }
    return saved;
  }

  public async loginAttempt({ email }: EmailDto): Promise<Boolean> {
    const existingUser = await this.userExistsCheck({ email });

    if (!existingUser) {
      return false;
    }
    const sendToken = await this.twilioService.sendCodeEmail(email);
    if (!sendToken)
      throw new HttpException("Error sending validtion email", HttpStatus.BAD_REQUEST);
    return true;
  }

  public async verifyLogin(method: VerificationDto) {
    this.loggerService.log("Verifying Login");
    const { email } = method;
    const verified = await this.twilioService.verify(method);
    if (!verified) {
      throw new HttpException("Not verified", HttpStatus.FORBIDDEN);
    }
    const existingUser = await this.userExistsCheck({ email });

    return await this.generateJWT(existingUser);
  }

  public async addPinToUser({ id, email }: { id: string; email: string }): Promise<UserEntity> {
    let user = await this.userExistsCheck({ email });
    user.pins.push(id);

    const saved = await this.userRepository.save(user);
    return saved;
  }

  public async promote(id: string): Promise<UserEntity> {
    let user = await this.userRepository.findOne(id);

    user.roles = [Role.User];

    await this.userRepository.save(user);

    return user;
  }
}

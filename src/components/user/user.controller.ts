import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Put,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { Logger } from "../logger/logger.decorator";
import { LoggerService } from "../logger/logger.service";
import { Roles } from "../roles/roles.decorator";
import { Role } from "../roles/roles.enum";
import { EmailDto, VerificationDto } from "../user/user.dto";
import { User } from "./user.decorator";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Logger("UserController") private readonly loggerService: LoggerService
  ) {}

  @Get()
  @HttpCode(200)
  async getOne(@User() user: UserEntity) {
    return await this.userService.findOne(user.id);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post("login")
  @HttpCode(200)
  @ApiBody({ type: EmailDto })
  @ApiResponse({ type: Boolean, status: 200 })
  async login(@Body() login: EmailDto) {
    return await this.userService.loginAttempt(login);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post("login/verify")
  @HttpCode(201)
  @ApiResponse({ description: "returns JWT for verified login attempt" })
  async verify(
    @Body() method: VerificationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.userService.verifyLogin(method);
    const origin = req.get("origin");
    this.loggerService.log(`origin: ${origin}`);

    res
      .set("Access-Control-Allow-Credentials", "true")
      .set("Access-Control-Allow-Origin", origin)
      .cookie("accessToken", accessToken, {
        maxAge: 60 * 60 * 2,
        sameSite: "none",
        domain: process.env.NODE_ENV === "development" ? "localhost" : ".howtohelp.guide",
        secure: true,
        httpOnly: false,
      });

    return {
      accessToken,
      refreshToken,
    };
  }

  @Get("logout")
  @HttpCode(200)
  @ApiResponse({ description: "Logs out user" })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.status(200).clearCookie("accessToken");
  }

  @Get("all")
  @HttpCode(200)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiResponse({ type: UserEntity, status: 200 })
  async getAll(@User() user: UserEntity): Promise<UserEntity[]> {
    if (user.roles.includes(Role.Admin)) {
      return await this.userService.findall();
    } else {
      throw new HttpException("FORBIDDEN", 403);
    }
  }
}

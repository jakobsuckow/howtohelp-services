import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CryptoService } from "./crypto.service";

@ApiTags("Cryptp")
@Controller("crypto")
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post("encrypt")
  @ApiOperation({ description: "encrypting" })
  async encrypt(@Body() string: any) {
    return await this.cryptoService.encrypt(string.string);
  }

  @Post("decrypt")
  @ApiOperation({ description: "decrypting" })
  async decrypt(@Body() string: any) {
    console.log(string);
    return await this.cryptoService.decrypt(string);
  }
}

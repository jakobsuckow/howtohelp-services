import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, MaxLength } from "class-validator";

export class EmailDto {
  @ApiProperty({ example: "exampe@email.com" })
  @Transform((o: any) => o.toLowerCase().trim())
  @IsEmail()
  email: string;
}

export class VerificationDto {
  @ApiProperty({ example: "exampe@email.com" })
  @Transform((o: any) => o.toLowerCase().trim())
  @IsEmail()
  email: string;

  @ApiProperty({ example: "1111" })
  @MaxLength(4)
  code: string;
}

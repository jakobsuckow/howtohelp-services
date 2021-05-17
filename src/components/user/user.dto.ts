import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

// export class CreateUserDto {
//   @ApiProperty({ example: "jakob.suckow94@googlemail.com" })
//   @IsEmail()
//   email: string;

//   @ApiProperty({ example: "Jakob" })
//   @IsNotEmpty()
//   name: string;
// }
export class EmailDto {
  @ApiProperty({ example: "jakob.suckow94@googlemail.com" })
  @Transform((o: any) => o.toLowerCase().trim())
  @IsEmail()
  email: string;
}

export class VerificationDto {
  @ApiProperty({ example: "jakob.suckow94@googlemail.com" })
  @Transform((o: any) => o.toLowerCase().trim())
  @IsEmail()
  email: string;

  @ApiProperty({ example: "1111" })
  @MaxLength(4)
  code: string;
}

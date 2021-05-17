import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  sendee: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;
}

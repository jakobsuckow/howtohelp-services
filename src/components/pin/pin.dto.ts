import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty } from "class-validator";
import { Trait, Type } from "./pin.entity";

export class CreatePinDto {
  @ApiProperty({ type: String, nullable: false, example: "Lorem Ipsum" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, nullable: false, example: "example@email.de" })
  @IsNotEmpty()
  @Transform((o: any) => o.toLowerCase().trim())
  @IsEmail()
  email: string;

  @ApiProperty({ nullable: false, example: "Hardenbergstraße 33, 10623 Berlin" })
  @IsNotEmpty()
  @Expose()
  address: string;

  @ApiProperty({ nullable: false, example: new Array(Trait.Donations) })
  @IsNotEmpty()
  @IsArray()
  @Expose()
  traits: Array<Trait>;

  @ApiProperty({ nullable: false, example: Type.Hand })
  @IsNotEmpty()
  @Expose()
  type: string;
}

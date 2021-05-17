import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateLocation {
  @ApiProperty({ type: String, example: "Germany" })
  @IsOptional()
  country: string;

  @ApiProperty({ type: String, example: "Berlin" })
  @IsOptional()
  city: string;

  @ApiProperty({ type: String, example: "12101" })
  @IsOptional()
  zipcode: string;

  @ApiProperty({ type: String, example: "Manfred-von-Richthofen-straße 20" })
  @IsOptional()
  streetName: string;

  @ApiProperty({ type: String, example: "20a" })
  @IsOptional()
  streetNumber: string;

  @ApiProperty({
    type: Number,
    example: "Manfred-von-Richthofen-straße 20, 12101, Berlin, Germany",
  })
  @IsOptional()
  string: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class ErrorBaseResponse {
  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;
}

import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { City } from "./city.entity";
import { CityService } from "./city.service";

@ApiTags("city")
@Controller("city")
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiOperation({
    description: `get all cities`,
  })
  @Get("all")
  async getAll(): Promise<City[]> {
    return this.cityService.getAll();
  }
  @ApiOperation({
    description: `get Coordinates for specific city`,
  })
  @Get("/:name")
  async getOne(@Param("name") name: string) {
    return this.cityService.findOne(name);
  }
}

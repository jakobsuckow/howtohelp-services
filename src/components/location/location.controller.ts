import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateLocation } from "./location.dto";
import { LocationService } from "./location.service";

@ApiTags("location")
@Controller("location")
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Post("")
  @ApiOperation({
    description: "Testing Node Geocoder",
  })
  async createLocation(@Body() locationDto: CreateLocation) {
    const { latitude, longitude, extra } = await this.locationService.getPlace(locationDto);

    return { latitude, longitude, extra };
  }
}

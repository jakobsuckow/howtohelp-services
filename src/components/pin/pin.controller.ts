import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PinService } from "./pin.service";
import { CreatePinDto } from "./pin.dto";
import { PinDetail, PinEntity } from "./pin.entity";
import { LocationService } from "../location/location.service";
import { PinGuard } from "./pin.guard";
import { Roles } from "../roles/roles.decorator";
import { Role } from "../roles/roles.enum";
import { User } from "../user/user.decorator";
import { UserEntity } from "../user/user.entity";
import { Http } from "winston/lib/winston/transports";

@ApiTags("pin")
@Controller("pin")
export class PinController {
  constructor(
    private readonly pinService: PinService,
    private readonly locationService: LocationService
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  @ApiOperation({
    description: "creating pins without any description for now",
  })
  async createPin(@Body() createPinDto: CreatePinDto): Promise<PinEntity> {
    const { name, address, email, traits, type } = createPinDto;

    const { latitude, longitude, city } = await this.locationService.getPlace({
      stringAddress: address,
    });

    return await this.pinService.create({
      longitude,
      latitude,
      name,
      email,
      address,
      traits,
      type,
      city,
    });
  }

  @Get("all")
  @ApiOperation({
    summary: "latitude, longitude, latitudeEnd, longitudeEnd",
    description: "Get Pins  from topLeft bottomRight corner of screen",
  })
  @ApiQuery({
    name: "longitude",
    required: false,
    description: "Longitude for LocationType radius or top left longitude on LocationType map",
  })
  @ApiQuery({
    name: "latitude",

    required: false,
    description: "Latitude for LocationType radius or top left latitude on LocationType map",
  })
  @ApiQuery({
    name: "longitudeEnd",
    required: false,
    description: "Used only with LocationType map as bottom right corner",
  })
  @ApiQuery({
    name: "latitudeEnd",
    required: false,
    description: "Used only with LocationType map as bottom right corner",
  })
  async findAll(
    @Query("latitude") latitude?: number,
    @Query("longitude") longitude?: number,
    @Query("latitudeEnd") latitudeEnd?: number,
    @Query("longitudeEnd") longitudeEnd?: number
  ) {
    return await this.pinService.findAllMap({
      latitude,
      longitude,
      latitudeEnd,
      longitudeEnd,
    });
  }
  @ApiOperation({
    summary: "Get summary for all pins",
  })
  @Get("list")
  @Roles(Role.Admin)
  @HttpCode(200)
  async getAllList(@User() user: UserEntity): Promise<any> {
    if (user.roles.includes(Role.Admin)) {
      return await this.pinService.findAllList();
    } else {
      throw new HttpException("FORBIDDEN", 403);
    }
  }

  @Get("features/:id")
  async getFeatures(@Param("id") id: string): Promise<PinDetail> {
    return await this.pinService.getFeatures(id);
  }
  @ApiOperation({ description: "Get pins for each user" })
  @Get("user/:id")
  async getByUser(@Param("id") id: string): Promise<PinDetail[]> {
    return await this.pinService.getUserPins(id);
  }

  @ApiOperation({ description: "Approve Pin by Admin" })
  @Put("approve/:id")
  @Roles(Role.Admin)
  async approvePin(@User() user: UserEntity, @Param("id") id: string): Promise<PinEntity> {

    if (user.roles.includes(Role.Admin)) {
      return await this.pinService.approve(id);
    } else {
      throw new HttpException("FORBIDDEN", 403);
    }
  }

  @ApiOperation({ description: "Deny Pin by Admin" })
  // @HttpCode(201)
  @Roles(Role.Admin)
  @Put("deny/:id")
  async denyPin(@User() user: UserEntity, @Param("id") id: string): Promise<PinEntity> {
    if (user.roles.includes(Role.Admin)) {
      return await this.pinService.deny(id);
    } else {
      throw new HttpException("FORBIDDEN", 403);
    }
  }
}

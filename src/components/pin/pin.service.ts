import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Logger } from "../logger/logger.decorator";
import { LoggerService } from "../logger/logger.service";
import { PinDetail, PinEntity } from "./pin.entity";
import { v4 as uuidv4 } from "uuid";
import { SegmentService } from "../segment/segment.service";
import { UserService } from "../user/user.service";
import { SendgridService } from "../sendgrid/sendgrid.service";

@Injectable()
export class PinService {
  constructor(
    @InjectRepository(PinEntity)
    private readonly pinRepository: Repository<PinEntity>,
    private readonly segmentSerivice: SegmentService,
    private readonly sendGridService: SendgridService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Logger("Pins")
    private logger: LoggerService
  ) {}

  async upsert(data) {
    return await this.pinRepository.save(data);
  }

  async create({
    longitude,
    latitude,
    name,
    email,
    address,
    traits,
    type,
    city,
  }: {
    longitude: number;
    latitude: number;
    name: string;
    email: string;
    address: string;
    traits: Array<string>;
    type: string;
    city: string;
  }) {
    let pin = new PinEntity();
    pin.geometry = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    pin.properties = {
      id: uuidv4(),
      type,
    };
    pin.name = name;
    pin.address = address;
    pin.traits = traits;
    pin.city = city;

    const user = await this.userService.createUser({ email, name });

    pin.userId = user.id;

    const savedPin = await this.pinRepository.save(pin);
    if (!savedPin) {
      throw new HttpException("Error creating Pin", HttpStatus.BAD_REQUEST);
    }
    this.sendGridService.newApplication(email);
    this.logger.log(`new Pin created at longitude: ${longitude} & latitude: ${latitude}`);

    return savedPin;
  }

  async findAllMap({
    latitude,
    longitude,
    latitudeEnd,
    longitudeEnd,
    type,
  }: {
    latitude?: number;
    longitude?: number;
    latitudeEnd?: number;
    longitudeEnd?: number;
    type?: string;
  }): Promise<PinEntity[]> {
    // Validation here

    let query = this.pinRepository
      .createQueryBuilder("pin")
      .select(["pin.type", "pin.geometry", "pin.properties", "pin.userId"])
      .where("pin.approved = true");

    // if-statements

    if (longitude & latitude) {
      query = query.andWhere(
        `ST_DWithin(
          pin.geometry,
          ST_MakePoint(${longitude},${latitude})::geography, 100000)`
      );
      // .orderBy("distance", "ASC")
    }

    if (longitudeEnd && latitudeEnd) {
      query = query.andWhere(
        `pin.geometry && ST_MakeEnvelope(${longitude}, ${latitude}, ${longitudeEnd}, ${latitudeEnd}, 4326)`
      );
    }

    if (type) {
      query = query.andWhere(`pin.properties ::jsonb @> \'{"type":"${type}"}\'`);
    }

    const features = query.getMany();
    const count = (await features).length;
    this.logger.log(`${count} Pins returned`);
    // this.segmentSerivice.track("USER_SEARCHED_MAP", {
    //   longitude,
    //   longitudeEnd,
    //   latitude,
    //   latitudeEnd,
    // });
    return features;
  }

  async findAllList() {
    this.logger.log(`Getting List of pins`);
    const query = await this.pinRepository
      .createQueryBuilder("pin")
      .leftJoinAndSelect("pin.userId", "user")
      .select([
        "pin.name",
        "pin.properties",
        "pin.traits",
        "pin.city",
        "pin.dateCreated",
        "pin.approved",
        "user.id",
      ])
      .getMany();
    return query;
  }

  async getFeatures(id: string): Promise<PinDetail> {
    this.logger.log(`Getting Features for ${id}`);
    const query = this.pinRepository
      .createQueryBuilder("pin")
      .leftJoinAndSelect("pin.userId", "user")
      .select([
        "pin.name",
        "pin.properties",
        "pin.traits",
        "pin.city",
        "pin.dateCreated",
        "user.id",
      ])
      .where(`pin.properties ::jsonb @> \'{"id":"${id}"}\'`)
      .getOne();

    return query;
  }

  async approve(id: string): Promise<PinEntity> {
    let pin = await this.pinRepository
      .createQueryBuilder("pin")
      .where(`pin.properties ::jsonb @> \'{"id":"${id}"}\'`)
      .getOne();

    pin.approved = true;

    const saved = await this.pinRepository.save(pin);

    return saved;
  }

  async deny(id: string) {
    let pin = await this.pinRepository
      .createQueryBuilder("pin")
      .where(`pin.properties ::jsonb @> \'{"id":"${id}"}\'`)
      .getOne();

    pin.approved = false;

    const saved = await this.pinRepository.save(pin);

    return saved;
  }

  async getUserPins(userId: string): Promise<PinDetail[]> {
    const query = this.pinRepository
      .createQueryBuilder("pin")
      .select([
        "pin.type",
        "pin.geometry",
        "pin.properties",
        "pin.userId",
        "pin.traits",
        "pin.city",
        "pin.dateCreated",
      ])
      .where("pin.userId = :userId", { userId })
      .getMany();

    return query;
  }
}

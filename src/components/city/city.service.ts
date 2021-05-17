import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Point } from "geojson";
import { Repository } from "typeorm";
import { City } from "./city.entity";

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>
  ) {}
  // General
  async upsert(city: City) {
    await this.cityRepository.save(city);
  }

  async getAll(): Promise<City[]> {
    const query = await this.cityRepository.createQueryBuilder("city").getMany();
    return query;
  }

  async findOne(slug: string): Promise<Point> {
    const query = this.cityRepository.findOne({ slug });

    const { longitude, latitude } = await query;

    return {
      type: `Point`,
      coordinates: [longitude, latitude],
    };
  }
}

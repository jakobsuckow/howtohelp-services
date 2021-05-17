import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as NodeGeocoder from "node-geocoder";
import { Logger } from "../logger/logger.decorator";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class LocationService {
  private geocoder: NodeGeocoder.Geocoder;

  constructor(
    @Logger("LocationService") private logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    this.geocoder = NodeGeocoder({
      provider: "google",
      apiKey: this.configService.get("GOOGLE_API_KEY"),
    });
  }

  async getPlace({
    country,
    city,
    zipcode,
    streetName,
    streetNumber,
    lat,
    lon,
    stringAddress,
  }: {
    country?: string;
    city?: string;
    zipcode?: string;
    streetName?: string;
    streetNumber?: string;
    lat?: number;
    lon?: number;
    stringAddress?: string;
  }): Promise<NodeGeocoder.Entry> {
    const entries =
      lat && lon
        ? await this.geocoder.reverse({ lat, lon })
        : stringAddress
        ? await this.geocoder.geocode(stringAddress)
        : await this.geocoder.geocode(
            `${streetName} ${streetNumber}, ${zipcode} ${city}, ${country}`
          );

    if (entries.length == 0)
      throw new HttpException("We could not find your address", HttpStatus.NOT_FOUND);

    const entry = entries[0];

    if (!entry.country) throw new HttpException("Country not found", HttpStatus.NOT_FOUND);
    if (!entry.city) throw new HttpException("City not found", HttpStatus.NOT_FOUND);
    if (!entry.zipcode) throw new HttpException("Zipcode not found", HttpStatus.NOT_FOUND);
    if (!entry.streetName) throw new HttpException("Street name not found", HttpStatus.NOT_FOUND);
    if (!entry.streetNumber)
      throw new HttpException("Street number not found", HttpStatus.NOT_FOUND);

    // if (!lat || !lon) {
    //   // if (entry.country != country)
    //   //   throw new HttpException("Countries do not match", HttpStatus.NOT_FOUND);
    //   if (entry.city != city) throw new HttpException("Cities do not match", HttpStatus.NOT_FOUND);
    //   if (entry.zipcode != zipcode)
    //     throw new HttpException("Zipcodes do not match", HttpStatus.NOT_FOUND);

    //   if (entry.streetNumber != streetNumber)
    //     throw new HttpException("Street numbers do not match", HttpStatus.NOT_FOUND);
    // }

    return entry;
  }
}

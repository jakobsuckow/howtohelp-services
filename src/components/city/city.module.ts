import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LoggerModule } from "../logger/logger.module"
import { CityController } from "./city.controller"
import { City } from "./city.entity"
import { CityService } from "./city.service"

@Module({
  imports: [LoggerModule.forRoot(), TypeOrmModule.forFeature([City])],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}

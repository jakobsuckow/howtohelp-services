import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PinModule } from "./components/pin/pin.module";
import { LoggerModule } from "./components/logger/logger.module";
import { CityModule } from "./components/city/city.module";
import { Connection, Migration } from "typeorm";
import { SegmentService } from "./components/segment/segment.service";
import { SegmentModule } from "./components/segment/segment.module";
import { LocationModule } from "./components/location/location.module";
import { UserModule } from "./components/user/user.module";
import { AuthMiddleware } from "./components/user/auth.middleware";
import { ConfigModule } from "@nestjs/config";
import { TwilioModule } from "./components/twilio/twilio.module";
import { MessageModule } from "./components/message/message.module";
import { MessageGateway } from "./components/message/message.gateway";
import { CryptoModule } from "./components/crypto/crypto.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        "../dist/components/**/**.entity{.ts,.js}",
        "../node_modules/nestjs-admin/**/*.entity.js",
      ],
      migrations: ["dist/migrations/**.js"],
      synchronize: true,
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    PinModule,
    CityModule,
    SegmentModule,
    LocationModule,
    UserModule,
    TwilioModule,
    MessageModule,
    CryptoModule,
  ],
  controllers: [AppController],
  providers: [AppService, SegmentService, MessageGateway],
})
export class AppModule implements NestModule {
  constructor(private readonly connection: Connection) {
    connection.runMigrations().then((migrations: Migration[]) => {
      if (migrations) {
        for (const migration of migrations) {
          console.log(`Migration [${migration.name}] has been ran.`);
        }
      }
    });
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AppController);
  }
}

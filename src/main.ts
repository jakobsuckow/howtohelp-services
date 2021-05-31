import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as basicAuth from "express-basic-auth";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LoggerService } from "./components/logger/logger.service";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";

const WhiteList =
  process.env.NODE_ENV === "production"
    ? ["https://howtohelp.guide", "https://www.howtohelp.guide"]
    : [
        "http://localhost:3000",
        "https://howtohelp-next-jfjzbc54b-jakobsuckow941.vercel.app",
        "https://howtohelp-next-923t3hxsl-jakobsuckow941.vercel.app",
        "https://howtohelp-dev.vercel.app",
      ];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerService(),
    cors: true,
  });
  app.use(cookieParser());
  app.enableCors({
    origin: WhiteList,
    credentials: true,
  });
  app.set("trust proxy", 1);
  app.enable("trust proxy");
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix("api/v1");
  if (process.env.NODE_ENV !== "production") {
    const options = new DocumentBuilder()
      .addBearerAuth()
      .addBasicAuth()
      .setDescription("Documentation for How to Help")
      .setTitle("How to help")
      .setVersion("1.0.1")
      .build();
    app.use(
      "/docs",
      basicAuth({
        users: {
          developer: process.env.SWAGGER_CRED,
        },
        challenge: true,
      })
    );

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("/docs", app, document);
  }

  await app.listen(process.env.PORT || 5000);
}
bootstrap();

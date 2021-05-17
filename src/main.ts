import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as basicAuth from "express-basic-auth";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LoggerService } from "./components/logger/logger.service";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
    cors: true,
  });
  app.use(cookieParser());
  app.enableCors({
    origin: ["http://localhost:3000", "https://howtohelp.guide"],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix("api/v1");
  if (process.env.NODE_ENV !== "production") {
    const options = new DocumentBuilder()
      .addBearerAuth()
      .addBasicAuth()
      .setDescription("Documentation for How to Help")
      .setContact("Jakob Suckow", "", "jakob.suckow94@googlemail.com")
      .setTitle("How to help")
      .setVersion("1.0.0")
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

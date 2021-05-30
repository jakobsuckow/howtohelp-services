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
    origin: [
      "http://localhost:3000",
      "https://howtohelp.guide",
      "https://howtohelp-next-jfjzbc54b-jakobsuckow941.vercel.app",
      "https://howtohelp-next-923t3hxsl-jakobsuckow941.vercel.app",
      "https://howtohelp-dev.vercel.app",
    ],
    credentials: true,
  });
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

// import * as request from "supertest";
// import { INestApplication } from "@nestjs/common";
// import { Test } from "@nestjs/testing";
// import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
// import { CityController } from "./city.controller";
// import { City } from "./city.entity";
// import { CityService } from "./city.service";

// describe("CityController", () => {
//   let cityController: CityController;
//   let cityService: CityService;
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       controllers: [CityController],
//       providers: [
//         CityService,
//         {
//           provide: getRepositoryToken(City),
//           useValue: {},
//         },
//       ],
//     }).compile();

//     app = moduleRef.createNestApplication();
//     await app.init();

//     it("/GET all cities", () => {
//       request(app.getHttpServer()).get("/city/all").expect(200);
//     });

//     it("/GET single City", done => {
//       return request(app.getHttpServer())
//         .get("/city/berlin")
//         .expect(200)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.body).toEqual(
//             expect.objectContaining({
//               type: "Point",
//               coordinates: [13.4, 52.516667],
//             })
//           );
//           done();
//         });
//     });
//   });
//   afterAll(async () => {
//     await app.close();
//   });
// });

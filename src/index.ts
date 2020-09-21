import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import express from "express";
import session from "express-session";
import cors from "cors";
import connectRedis from "connect-redis";
// import { getCustomRepository } from "typeorm";
import apiRoutes from "./api/index";

import { redis } from "./redis";
import config from "./config";
import createSchema from "./schema";
// import { ThumbnailImageRepository } from "./repositories/ThumbnailImageRepository";

// const { cloudinary } = require("./handlers/cloudinary");
// const upload = require("./handlers/multer");

require("dotenv").config();

TypeORM.useContainer(Container);
const path = "/graphql";

import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(apiRoutes);

// app.post(
//   "/upload-images",
//   upload.array("image"),
//   async (req: any, res: any) => {
//     const { files } = req;

//     if (!files) {
//       return res.status(400).send("Missing file");
//     }
//     try {
//       let urls = [];
//       let fileUpload = <any>[];
//       for (const file of files) {
//         const { path } = file;
//         const newPath = await cloudinary.v2.uploader.upload(path, {
//           resource_type: "auto",
//           folder: "Images",
//         });
//         urls.push(newPath);
//       }

//       const thumbnaiImagelRepository = getCustomRepository(
//         ThumbnailImageRepository
//       );

//       urls.forEach((url: any) => {
//         const image = thumbnaiImagelRepository.create({
//           imageURL: url.secure_url,
//           accessory: req.body.categoryId,
//         });
//         fileUpload.push(image);
//       });

//       await thumbnaiImagelRepository.save(fileUpload);

//       res.send({
//         message: "Image is uploaded successfully",
//         data: fileUpload,
//       });
//     } catch (err) {
//       return res.status(400).send(err.message);
//     }
//   }
// );

async function main() {
  await TypeORM.createConnection();

  const schema = await createSchema(Container);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  apolloServer.applyMiddleware({ app, path });

  const port = config.port;

  app.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
    );
  });
}

main();

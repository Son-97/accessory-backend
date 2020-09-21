const { cloudinary } = require("../handlers/cloudinary");
const upload = require("../handlers/multer");
import { ThumbnailImageRepository } from "../repositories/ThumbnailImageRepository";
import { getCustomRepository } from "typeorm";
import fs from "fs";

const uploadImagesThumbnail = async (req: any, res: any) => {
  const { files } = req;
  const { categoryId } = req.body;

  if (!files) {
    return res.status(400).send("Missing file");
  }

  try {
    let urls = [];
    let fileUpload = <any>[];

    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinary.v2.uploader.upload(path, {
        resource_type: "auto",
        folder: `Images/${categoryId || "Common"}`,
      });
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const thumbnaiImagelRepository = getCustomRepository(
      ThumbnailImageRepository
    );

    urls.forEach((url: any) => {
      const image = thumbnaiImagelRepository.create({
        imageURL: url.secure_url,
        accessory: categoryId,
      });
      fileUpload.push(image);
    });

    await thumbnaiImagelRepository.save(fileUpload);

    res.send({
      message: "Image is uploaded successfully",
      data: fileUpload,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

export const UploadThubmnailImage = [
  upload.array("image"),
  uploadImagesThumbnail,
];

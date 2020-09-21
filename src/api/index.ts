import express from "express";
import { UploadThubmnailImage } from "./upload-images";

const index = express.Router();

// upload thumbnail image
index.post("/upload-images", ...UploadThubmnailImage);

export default index;

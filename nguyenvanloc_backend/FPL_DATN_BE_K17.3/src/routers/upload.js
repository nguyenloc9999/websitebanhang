import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { deleteImage, updateImage, uploadImage } from "../controllers/upload.js";
const uploadRouter = express.Router();


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "DATN",
        format: "png",
    }
});

const upload = multer({ storage: storage });


uploadRouter.post("/images/upload", upload.array("images", 10), uploadImage);
uploadRouter.delete("/images/:publicId", deleteImage);
uploadRouter.put("/images/:publicId", upload.array("images", 10), updateImage);

export default uploadRouter;
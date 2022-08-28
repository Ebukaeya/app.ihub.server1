import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
import pkg2 from "multer-storage-cloudinary";
const { CloudinaryStorage } = pkg2;
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Ihub-text-images",
    /*  allowedFormats: ["jpg", "png"], */
    /*  transformation: [{ width: 500, height: 500, crop: "limit" }], */
  },
});

export const cloudUpload = multer({
  storage: storage,
}).single("image");

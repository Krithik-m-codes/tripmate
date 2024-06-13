import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

// Configuration for Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    // Uploading to Cloudinary and returning the response
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    await unlinkAsync(localFilePath);
    return response;
  } catch (error) {
    await unlinkAsync(localFilePath);
    throw error;
  }
};

export { uploadOnCloudinary };

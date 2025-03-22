import { v2 as cloudinary } from "cloudinary";

async function uploadFile(selectedFile: File) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const arrayBuffer = await selectedFile.arrayBuffer();
  const binary = Buffer.from(arrayBuffer);

  const base64Image = `data:${selectedFile.type};base64,${binary.toString(
    "base64"
  )}`;

  const uploadFile = await cloudinary.uploader.upload(base64Image, {
    resource_type: "image",
  });
  return uploadFile;
}

export default uploadFile;

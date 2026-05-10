import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

export const uploadImages = async (req, res) => {
  try {
    console.log("=== Cloudinary Upload Debug ===");
    console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
    console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "***" : "undefined");
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const { images } = req.body;
    
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ success: false, message: "No images provided" });
    }

    const uploadResults = [];

    for (const imageData of images) {
      const result = await cloudinary.uploader.upload(imageData, {
        folder: "rupayon/products",
      });
      
      uploadResults.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    res.json({
      success: true,
      images: uploadResults,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

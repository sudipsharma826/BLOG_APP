import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('No file provided');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'blog_app_users',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('Upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Create a readable stream from buffer and pipe to cloudinary
      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw new Error('Error uploading image');
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error in deleteFromCloudinary:', error);
    throw new Error('Error deleting image');
  }
};

import { v2 as cloudinary } from 'cloudinary';

// Handle typo in env: CLOUDIINARY_CLOUD_NAME or CLOUDINARY_CLOUD_NAME
const cloudName = process.env.CLOUDIINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Cloudinary configuration is missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your .env file.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

/**
 * Uploads a file buffer to Cloudinary in a specific folder.
 * @param fileBuffer Buffer of the file to upload
 * @param folder Cloudinary folder name (e.g. nydl/resources)
 * @param filename Omit file extension; used for publicId
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  filename: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cleanFilename = filename.replace(/[^a-zA-Z0-9]/g, '_');
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${cleanFilename}_${Date.now()}`,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('No result returned from Cloudinary upload'));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;

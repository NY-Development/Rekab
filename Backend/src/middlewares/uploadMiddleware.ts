import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../configs/cloudinary';
import { AppError } from './errorHandler';

// Set up multer memory storage
const storage = multer.memoryStorage();

// Max 50MB file size
export const multerUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export interface UploadedFileRequest extends Request {
  fileUrl?: string;
}

/**
 * Middleware factory to handle single file upload and load it to Cloudinary
 * @param fieldName Name of the multipart form field containing the file
 * @param folder Cloudinary folder name
 */
export function uploadFileToCloudinary(fieldName: string, folder: string) {
  return [
    multerUpload.single(fieldName),
    async (req: UploadedFileRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.file) {
          return next();
        }

        const originalName = req.file.originalname.split('.')[0];
        const fileUrl = await uploadToCloudinary(
          req.file.buffer,
          folder,
          originalName
        );

        req.fileUrl = fileUrl;
        next();
      } catch (err) {
        next(new AppError(`File upload failed: ${(err as Error).message}`, 400));
      }
    },
  ];
}

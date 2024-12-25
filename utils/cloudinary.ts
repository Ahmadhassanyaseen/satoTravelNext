import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary is properly configured
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: File | string, folder: string = 'general') => {
  try {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    // If the file is already a Cloudinary URL, return its info
    if (typeof file === 'string' && file.includes('cloudinary.com')) {
      const match = file.match(/\/v\d+\/([^/]+)\.[^.]+$/);
      return {
        url: file,
        publicId: match ? match[1] : '',
      };
    }

    console.log('Starting upload to Cloudinary:', {
      fileType: file instanceof File ? file.type : typeof file,
      fileSize: file instanceof File ? file.size : 'N/A',
      folder
    });

    let uploadData;
    if (file instanceof File) {
      // Handle File object
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
      uploadData = base64Image;
    } else if (typeof file === 'string' && file.startsWith('data:')) {
      // Handle base64 string
      uploadData = file;
    } else if (typeof file === 'string' && file.startsWith('http')) {
      // Handle remote URL
      uploadData = file;
    } else {
      throw new Error('Invalid file format');
    }

    console.log('Uploading to Cloudinary...');
    const result = await cloudinary.uploader.upload(uploadData, {
      folder,
      resource_type: 'auto',
    });

    console.log('Upload successful:', {
      publicId: result.public_id,
      url: result.secure_url
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    if (error instanceof Error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
    throw new Error('Cloudinary upload failed with unknown error');
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) {
      throw new Error('No publicId provided for deletion');
    }

    console.log('Deleting from Cloudinary:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deletion result:', result);

    return result;
  } catch (error) {
    console.error('Error in deleteFromCloudinary:', error);
    if (error instanceof Error) {
      throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
    throw new Error('Cloudinary deletion failed with unknown error');
  }
};

export default cloudinary;

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'car_rental_images', // Your Cloudinary folder
      format: async (req, file) => 'jpg', // Convert all images to jpg
      public_id: (req, file) => file.originalname.split('.')[0] // Use filename
    }
  });

  const upload = multer({ storage: storage });
  
  module.exports = upload;
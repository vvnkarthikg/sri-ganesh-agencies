// multerConfig.js


//multer

//file object after parsing
/*
{
  "fieldname": "profilePic", //name of the input tag of file
  "originalname": "avatar.png",//real name of file
  "encoding": "7bit",
  "mimetype": "image/png",
  "size": 34567,
  "destination": "./assets/images",
  "filename": "2024-10-02T12-15-30.123Zavatar.png",
  "path": "assets/images/2024-10-02T12-15-30.123Zavatar.png" //path after saving
}

 */


require('dotenv').config();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');
const path = require('path');

// Function to generate timestamped filenames
const generateFileName = (originalName) => {
  const timestamp = new Date().toISOString()
    .replace(/:/g, '-')   // Replace colons with dashes
    .replace(/\..+/, ''); // Remove milliseconds and 'Z'
  
  const fileExtension = path.extname(originalName); // Extract file extension
  const baseName = path.basename(originalName, fileExtension); // Extract name without extension

  return `${timestamp}_${baseName}${fileExtension}`;
};

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'mern-products', // Ensure all images are saved inside this folder
    public_id: generateFileName(file.originalname), // Apply timestamp format
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  }),
});

// Multer Middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpg', 'image/jpeg', 'image/png', 
      'image/gif', 'image/bmp', 'image/webp'
    ]; // Allow various image types
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.fileValidationError = 'Invalid file type. Only images are allowed.';
      cb(null, false);
    }
  },
});

console.log('multerConfig.js: Multer configuration successful');

module.exports = upload;

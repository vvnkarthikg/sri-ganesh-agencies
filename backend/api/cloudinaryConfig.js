require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Log environment variables to check if they are loaded correctly
console.log('Checking Cloudinary environment variables...');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'Missing');

// Check if Cloudinary credentials are missing
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary credentials are missing! Check your .env file.');
  throw new Error('Cloudinary credentials are missing in environment variables.');
}

console.log('✅ Cloudinary credentials are present. Proceeding with configuration...');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('✅ Cloudinary configured successfully.');

/*cloudinary.uploader.upload('api\\Images\\2024-11-12T14-54-36.141ZTic Tac Strawberry Fields Mints, 1.jpg', { folder: 'test-folder' })
  .then(result => console.log('Cloudinary Test Upload Success:', result.secure_url))
  .catch(error => console.error('Cloudinary Test Upload Error:', error));
*/

module.exports = cloudinary;

// routes/productRoutes.js


//normal body parser can't parse form data so we use multer
//form data includes field along with files or images

const express = require('express');
const router = express.Router();
const checkAdmin = require('../middlewares/check-admin');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const upload = require('../multerConfig');
const cloudinary = require('../cloudinaryConfig');
//or import {Product} from '../models/product';

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





// Define routes
router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post('/', checkAdmin, upload.single('productImage'), async (req, res) => {
    try {
        
        const { name, price } = req.body;

        if (!name || !price) {
            console.log("⚠️ Missing required fields:", { name, price });
            return res.status(400).json({
                message: "Please provide both name and price",
                providedFields: Object.keys(req.body)
            });
        }

        let productImage = undefined;
        if (req.file) {
            console.log("🔹 Uploading image to Cloudinary...");
            const result = await cloudinary.uploader.upload(req.file.path).catch(err => {
                console.error('❌ Cloudinary Upload Error:', err);
                throw new Error('Failed to upload to Cloudinary');
            });
            productImage = result.secure_url;
            console.log("✅ Image uploaded successfully:", productImage);
        }

        const newProduct = new Product({
            name,
            price: Number(price), // Ensure price is a number
            productImage,
            packOf: req.body.packOf || undefined,
            category: req.body.category || undefined,
            quantity: Number(req.body.quantity) || undefined,
            description: req.body.description || undefined,
            brand: req.body.brand || undefined
        });

        const product = await newProduct.save();
        console.log("✅ Product saved successfully:", product);

        return res.status(201).json({ product, message: "Created successfully" });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ message: 'Invalid ID format' });
        }

        // Find the product by _id
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/name/:productName', async (req, res) => {
    try {
        const { productName } = req.params;

        // Find all products that match the given name
        const docs = await Product.find({ name: productName }).select('_id name price');

        // Transform documents into the desired response format
        const response = {
            count: docs.length,
            products: docs.map(doc => ({
                id: doc._id,
                name: doc.name,
                price: doc.price,
                productImage: doc.productImage
            }))
        };

        // Check if no products were found
        if (response.count === 0) {
            return res.status(404).send({ message: 'No products found with that name' });
        }

        // Return the array of products
        res.status(200).json(response);
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        res.status(500).send({ message: error.message });
    }
});



router.patch('/:id', checkAdmin, upload.single('productImage'), async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ message: 'Invalid ID format' });
        }

        let updateData = { ...req.body };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.productImage = result.secure_url;
        }

        // Update the product using findByIdAndUpdate
        const updatedProduct = await Product.findByIdAndUpdate(
            id, // Find by _id
            updateData, // Update with provided data
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error during product update:', error.message); // Log the error
        res.status(500).send({ message: error.message });
    }
});





router.delete('/:id', checkAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ message: 'Invalid ID format' });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Delete image from Cloudinary if it exists
        if (deletedProduct.productImage) {
            const imagePublicId = deletedProduct.productImage.split('/').pop().split('.')[0]; // Extract public ID
            await cloudinary.uploader.destroy(imagePublicId);
        }

        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


module.exports = router; // Ensure this line is present

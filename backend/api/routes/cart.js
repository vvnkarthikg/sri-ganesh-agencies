const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const checkAuth = require('../middlewares/check-auth');
const mongoose = require('mongoose');


// Get user's cart
router.get('/', checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        let cart = await Cart.findOne({ userId }).populate('items.pId');
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }
        
        const transformedCart = {
            id: cart._id,
            userId: cart.userId,
            items: cart.items.map(item => ({
                pId: item.pId._id,
                name: item.pId.name,
                price: item.pId.price,
                productImage: item.pId.productImage,
                quantity: item.quantity,
                category: item.pId.category,
                description: item.pId.description,
                itemId:item._id

            }))
        };
        
        res.status(200).json(transformedCart);
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post('/addToCart', checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { pId, quantity } = req.body; // Expecting MongoDB _id as 'id'

        if (!pId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        const numericQuantity = Number(quantity);
        if (isNaN(numericQuantity) || numericQuantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number' });
        }

        const product = await Product.findById(pId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{
                    pId: pId,
                    name: product.name, 
                    price: product.price, 
                    quantity: numericQuantity
                }]
            });
            console.log("new cart has been created"+ cart);
        } else {
            const existingItem = cart.items.find(item => item.pId.equals(pId)); // Fixed ObjectId comparison
            if (existingItem) {
                existingItem.quantity += numericQuantity;
                console.log("the existing item quantity incresed "+existingItem); 
            } else {
                cart.items.push({
                    pId: pId,
                    name: product.name, // Store product name
                    price: product.price, // Store product price
                    quantity: numericQuantity
                });
                console.log("a new item has been added to the cart "+cart);
            }
        }

        await cart.save();
        console.log("the newly update cart is "+cart);
        res.status(201).json({ message: 'Item added to cart', cart });
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        res.status(500).json({ message: error.message });
    }
});


router.patch('/updateCart/:itemId', checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { itemId } = req.params; // Get itemId from URL
        const { quantity } = req.body; // Get new quantity

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const existingItem = cart.items.find(item => item._id.toString() === itemId);
        if (!existingItem) return res.status(404).json({ message: 'Item not found in cart' });

        existingItem.quantity = quantity; // Update quantity
        await cart.save();


        res.status(200).json({ message: 'Cart updated', cart });
    } catch (error) {
        console.error('Error updating cart:', error.message);
        res.status(500).json({ message: error.message });
    }
});


// Remove item from cart
router.delete('/remove/:pId', checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { pId } = req.params;
        
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        
        cart.items = cart.items.filter(item => item.pId.toString() !== pId);
        await cart.save();
        
        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        console.error('Error removing item from cart:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Clear cart
router.delete('/clearCart', checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        await Cart.findOneAndDelete({ userId });
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

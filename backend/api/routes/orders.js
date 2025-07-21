const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middlewares/check-auth');
const checkAdmin = require('../middlewares/check-admin')

const formatDate = (dateString) => {
    return new Date(dateString).toISOString(); // Return the ISO string, which is standard
};


// Get all orders for a user or all orders if admin
router.get('/', checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        const isAdmin = req.userData.isAdmin; // Check if user is admin

        let orders; // Declare orders variable

        if (isAdmin) {
            // Fetch all orders if the user is an admin
            orders = await Order.find().populate('product');
        } else {
            // Fetch only the user's orders
            orders = await Order.find({ user: userId }).populate('product');
        }

        // Transforming orders to include necessary fields
        const transformedOrders = orders.map(order => {
            return {
                id: order._id,
                product: {
                    id: order.product._id,
                    name: order.product.name,
                    price: order.product.price,
                    productImage: order.product.productImage,
                    quantity: order.product.quantity,
                    category: order.product.category,
                    description: order.product.description,
                },
                quantity: order.quantity,
                orderNumber: order.orderNumber,
                status: order.status,
                createdOn: formatDate(order.createdOn), // Format createdOn date
                deliveredOn: order.deliveredOn ? formatDate(order.deliveredOn) : null // Format deliveredOn date if available
            };
        });


        res.status(200).json({
            count: orders.length,
            orders: transformedOrders
        });
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Create a new order
router.post('/', checkAuth, async (req, res) => {
  try {
    const { id: pId, quantity } = req.body;

    // 🧪 Validate product
    const product = await Product.findById(pId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ❌ Quantity check
    if (quantity > product.quantity) {
      return res.status(400).json({ message: 'Insufficient product quantity' });
    }

    // 🧮 Update product quantity
    product.quantity -= quantity;
    await product.save();

    // 🧾 Create the order
    const newOrder = new Order({
      quantity,
      product: pId,
      user: req.userData.userId
    });

    let result = await newOrder.save();
    result = await result.populate('product');

    // 🎯 Emit only to specific user and admin
    const userId = req.userData.userId.toString();
    const orderData = {
      id: result._id,
      product: {
        id: result.product._id,
        name: result.product.name,
        price: result.product.price,
        productImage: result.product.productImage,
        quantity: result.product.quantity,
        category: result.product.category,
        description: result.product.description,
      },
      quantity: result.quantity,
      orderNumber: result.orderNumber,
      status: result.status,
      createdOn: new Date(result.createdOn).toISOString(),
      deliveredOn: result.deliveredOn ? new Date(result.deliveredOn).toISOString() : null
    };

    req.io.to(userId).emit('order-created', orderData);
    req.io.to('admin').emit('order-created', orderData);

    // ✅ Response
    return res.status(201).json({ message: 'Order created', result });
  } catch (err) {
    console.error('Error creating order:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

//patch the order
router.patch('/status/:orderId', checkAdmin, async (req, res) => {
  try {
    const id = req.params.orderId;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Processing', 'Completed', 'Failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({
      message: 'Order status updated successfully.',
      updatedOrder: order,
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.patch('/cq/:orderId', checkAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { productId, newQuantity } = req.body;

    if (!productId || typeof newQuantity !== 'number' || newQuantity < 1) {
      return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check user authorization
    if (order.user.toString() !== req.userData.userId && !req.userData.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Find the product in the order
    const productItem = order.products.find(p => p.product.toString() === productId);

    if (!productItem) {
      return res.status(404).json({ message: 'Product not found in order' });
    }

    productItem.quantity = newQuantity;

    await order.save();

    return res.status(200).json({
      message: 'Product quantity updated successfully',
      updatedOrder: order,
    });

  } catch (err) {
    console.error('❌ Error updating quantity:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/cancel/:orderId', checkAuth, async (req, res) => {
  try {
    const id = req.params.orderId;
    const order = await Order.findById(id).populate('product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If order is already cancelled
    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    // Optional: Check if the user is authorized to cancel this order
    if (order.user.toString() !== req.userData.userId && !req.userData.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Update order status
    order.status = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = req.userData.userId;
    order.cancelReason = req.body.reason || 'User cancelled';

    await order.save();

    return res.status(200).json({
      message: 'Order cancelled successfully',
      order,
    });

  } catch (err) {
    console.error('❌ Cancel Order Error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



// Get a specific order by ID
router.get('/:orderId', checkAuth, async (req, res) => {
    try {
        const id = req.params.orderId;
        const order = await Order.findById(id).populate('product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            id: order._id,
            product: {
                id: order.product._id,
                name: order.product.name,
                price: order.product.price,
                productImage: order.product.productImage,
                quantity: order.product.quantity,
                category: order.product.category,
                description: order.product.description,
            },
            quantity: order.quantity,
            orderNumber: order.orderNumber,
            status: order.status,
            createdOn: formatDate(order.createdOn), // Format createdOn date
            deliveredOn: order.deliveredOn ? formatDate(order.deliveredOn) : null // Format deliveredOn date if available
        });
        
    } catch (error) {
        console.error('Error fetching the specific order:', error.message);
        res.status(500).json(error);
    }
});

// Delete an order by ID
router.delete('/:orderId', checkAuth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // 🔍 Find the order
    const del_Order = await Order.findById(orderId);
    if (!del_Order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 🔐 Authorization: only allow deleting your own order or if admin
    const requesterId = req.userData.userId;
    const isAdmin = req.userData.isAdmin;
    if (!isAdmin && del_Order.user.toString() !== requesterId) {
      return res.status(403).json({ message: 'Unauthorized to delete this order' });
    }

    // 📦 Update product quantity
    const product = await Product.findById(del_Order.product);
    if (product) {
      product.quantity += del_Order.quantity;
      await product.save();
    }

    // 🗑 Delete the order
    await Order.findByIdAndDelete(orderId);

    // 🔁 Emit real-time updates
    const userId = del_Order.user.toString();
    req.io.to(userId).emit('order-deleted', { id: del_Order._id.toString() });
    req.io.to('admin').emit('order-deleted', { id: del_Order._id.toString() });

    // ✅ Success response
    return res.status(200).json({
      message: 'Order deleted and product quantity updated',
      order: del_Order
    });

  } catch (error) {
    console.error('Error deleting order:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
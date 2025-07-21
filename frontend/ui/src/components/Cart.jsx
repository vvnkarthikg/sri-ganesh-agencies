// CartPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../redux-store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.cart); // Added loading, error

  // Fetch the cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Handle quantity update
  const handleQtyChange = (itemId, quantity) => {
    if (quantity < 1) return;

    dispatch(updateCartItem({ itemId, quantity }))
      .unwrap()
      .then(() => {
        console.log(`✅ Quantity updated to ${quantity} for item ${itemId}`);
      })
      .catch((err) => {
        console.error('❌ Update quantity failed:', err);
      });
  };

  // Remove item from cart
  const handleRemove = (pId) => {
    dispatch(removeFromCart(pId))
      .unwrap()
      .then(() => {
        console.log(`✅ Removed item with product ID ${pId}`);
      })
      .catch((err) => {
        console.error('❌ Failed to remove item:', err);
      });
  };

  // Clear entire cart
  const handleClear = () => {
    dispatch(clearCart())
      .unwrap()
      .then(() => {
        console.log('✅ Cart cleared');
      })
      .catch((err) => {
        console.error('❌ Failed to clear cart:', err);
      });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {/* ⏳ Loading */}
      {loading && (
        <p className="text-gray-500 text-center py-4">Loading your cart...</p>
      )}

      {/* ❌ Not Logged In */}
      {error?.status === 401 && (
        <div className="text-red-600 bg-red-50 border border-red-300 p-4 rounded mb-4 text-center">
          You are not logged in.{' '}
          <a href="/auth" className="text-blue-600 underline">
            Login to view your cart
          </a>
        </div>
      )}

      {/* ❌ Other Errors */}
      {error && error.status !== 401 && (
        <div className="text-red-600 bg-red-50 border border-red-300 p-4 rounded mb-4 text-center">
          Failed to load cart: {error.message}
        </div>
      )}

      {/* 🛒 Cart Content */}
      {!loading && !error && (
        <>
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.itemId}
                  className="border p-4 mb-4 flex justify-between items-center rounded shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productImage}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQtyChange(item.itemId, Number(e.target.value))
                      }
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                    />
                    <button
                      onClick={() => handleRemove(item.pId)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleClear}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
              >
                Clear Cart
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;

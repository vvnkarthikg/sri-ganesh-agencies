// redux-store/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

//
// 1️⃣ Fetch Cart
//
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/cart');
      return res.data;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 2️⃣ Add or Update Item in Cart
//
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ pId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/cart/addToCart', { pId, quantity });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 3️⃣ Update Cart Item Quantity
//
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/cart/updateCart/${itemId}`, { quantity });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 4️⃣ Remove Item from Cart
//
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (pId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/cart/remove/${pId}`);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 5️⃣ Clear Entire Cart
//
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete('/cart/clearCart');
      return [];
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 🧾 cartSlice
//
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Shared loading/error handlers
    const startLoading = (state) => {
      state.loading = true;
      state.error = null;
    };

    const setError = (state, action) => {
      state.loading = false;
      state.error = action.payload || { status: 500, message: 'Something went wrong' };
    };

    // Handle each case
    builder
      .addCase(fetchCart.pending, startLoading)
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, setError)

      .addCase(addToCart.pending, startLoading)
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
      })
      .addCase(addToCart.rejected, setError)

      .addCase(updateCartItem.pending, startLoading)
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, setError)

      .addCase(removeFromCart.pending, startLoading)
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, setError)

      .addCase(clearCart.pending, startLoading)
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(clearCart.rejected, setError);
  },
});

export default cartSlice.reducer;

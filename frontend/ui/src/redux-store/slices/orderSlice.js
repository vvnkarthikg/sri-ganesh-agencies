import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

//
// 🔄 Fetch all orders
//
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders');
      return response.data;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 🛒 Place a new order
//
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data.result;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// ❌ Cancel an order
//
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/orders/cancel/${orderId}`);
      return response.data.order;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 🛠 Admin: Update order status
//
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/orders/status/${orderId}`, { status });
      return response.data.updatedOrder;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 🔁 Change product quantity in an order
//
export const changeOrderQuantity = createAsyncThunk(
  'orders/changeQuantity',
  async ({ orderId, productId, newQuantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/orders/cq/${orderId}`, { productId, newQuantity });
      return response.data.updatedOrder;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 🗑 Delete order
//
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/orders/${orderId}`);
      return response.data.order;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  }
);

//
// 🧾 Slice
//
const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    allOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // PLACE
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.allOrders.orders.push(action.payload); // Ensure this matches your state shape
        state.loading = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // CANCEL
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.allOrders.orders = state.allOrders.orders.map(order =>
          order.id === action.payload._id ? action.payload : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // UPDATE STATUS
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.allOrders.orders = state.allOrders.orders.map(order =>
          order.id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // CHANGE QTY
      .addCase(changeOrderQuantity.fulfilled, (state, action) => {
        state.allOrders.orders = state.allOrders.orders.map(order =>
          order.id === action.payload._id ? action.payload : order
        );
      })
      .addCase(changeOrderQuantity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // DELETE
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.allOrders.orders = state.allOrders.orders.filter(order =>
          order.id !== action.payload._id
        );
      });
  },
});

export default orderSlice.reducer;

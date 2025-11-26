import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrders,
  cancelOrder,
  updateOrderStatus,
  changeOrderQuantity,
} from '../redux-store/slices/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const { allOrders, loading, error } = useSelector((state) => state.orders);
  const orders = allOrders?.orders || [];

  // Get admin status from localStorage as string ('true' or 'false')
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const [editStatus, setEditStatus] = useState({});
  const [editQty, setEditQty] = useState({});

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCancel = (orderId) => {
    dispatch(cancelOrder({ orderId }));
  };

  const handleStatusChange = (orderId, newStatus) => {
    setEditStatus((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleSubmitStatus = (orderId) => {
    if (!editStatus[orderId]) return;
    dispatch(updateOrderStatus({ orderId, status: editStatus[orderId] }));
    setEditStatus((prev) => ({ ...prev, [orderId]: undefined }));
  };

  const handleQtyChange = (orderId, qty) => {
    setEditQty((prev) => ({ ...prev, [orderId]: qty }));
  };

  const handleSubmitQty = (orderId, productId) => {
    const newQty = parseInt(editQty[orderId], 10);
    if (!isNaN(newQty) && newQty > 0) {
      dispatch(changeOrderQuantity({ orderId, productId, newQuantity: newQty }));
      console.log("changing quat");
      setEditQty((prev) => ({ ...prev, [orderId]: undefined }));
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading orders...</div>;

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        {error.status === 401 ? (
          <>You're not logged in. <a href="/auth" className="underline text-blue-600">Login</a>.</>
        ) : (
          <>Error: {error.message || 'Unable to load orders.'}</>
        )}
      </div>
    );

  if (orders.length === 0)
    return <div className="text-center py-10 text-gray-400">No orders found.</div>;

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Orders</h2>

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md transition-all duration-200 p-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-2 mb-3">
              <div>
                <p className="text-md text-gray-700 font-semibold mb-1">Order # {order.orderNumber}</p>
                <p className="text-xs text-gray-500">Placed on {new Date(order.createdOn).toLocaleString()}</p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-md ${
                  order.status === 'Completed'
                    ? 'bg-green-200 text-green-800'
                    : order.status === 'Processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'Failed'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Product Info */}
            <div className="flex items-center gap-4">
              <img
                src={order.product?.productImage || '/no-image.png'}
                alt={order.product?.name || 'Product'}
                className="w-26 h-26 object-contain rounded bg-gray-100"
              />
              <div className="flex flex-1 justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{order.product?.name || 'Unnamed Product'}</p>
                  <p className="text-sm text-gray-600">
                    Quantity:{' '}
                    {editQty[order.id] !== undefined ? (
                      <>
                        <input
                          type="number"
                          min={1}
                          value={editQty[order.id]}
                          onChange={(e) => handleQtyChange(order.id, e.target.value)}
                          className="border rounded px-1 w-16"
                        />
                        <button
                          onClick={() => handleSubmitQty(order.id, order.product._id)}
                          className="ml-2 px-2 py-0.5 text-sm bg-green-500 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditQty((prev) => ({ ...prev, [order.id]: undefined }))}
                          className="ml-1 px-2 py-0.5 text-sm bg-gray-400 text-white rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">{order.quantity}</span>
                        <button
                          onClick={() => setEditQty((prev) => ({ ...prev, [order.id]: order.quantity }))}
                          className="ml-3 text-xs text-indigo-600 px-2 py-1 rounded-md"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <p className="pr-4 text-lg font-bold">
                    ₹{order.product?.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap justify-end gap-3 text-sm">
              <button
                onClick={() => handleCancel(order.id)}
                className={`px-3 py-1 rounded text-gray-600 border text-xs hover:bg- ${
                  (order.status=='Completed' || order.status=='Cancelled')?'hidden':''
                }`}
              >
                Cancel
              </button>

              {isAdmin && (
                <div className="flex items-center gap-2 text-xs">
                  {editStatus[order.id] !== undefined ? (
                    <>
                      <select
                        value={editStatus[order.id]}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-white rounded px-2 py-1 bg-indigo-600"
                      >
                        <option className="bg-white text-gray-900" value="Processing">Processing</option>
                        <option className="bg-white text-gray-900" value="Completed">Completed</option>
                        <option className="bg-white text-gray-900" value="Failed">Failed</option>
                        <option className="bg-white text-gray-900" value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleSubmitStatus(order.id)}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditStatus((prev) => ({ ...prev, [order.id]: undefined }))}
                        className="px-2 py-1 text-xs text-gray-600 border rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditStatus((prev) => ({ ...prev, [order.id]: order.status }))}
                      className="px-3 py-1 rounded bg-blue-700 text-white hover:bg-blue-600 text-xs"
                    >
                      Change Status
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;

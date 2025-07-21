import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts,updateProduct, deleteProduct } from '../redux-store/slices/productSlice';
import { placeOrder } from '../redux-store/slices/orderSlice';
import { addToCart } from '../redux-store/slices/cartSlice';
import ProductSlider from './ProductSlider';
import axiosInstance from '../api/axiosInstance';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [isAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items]);

  const product = items.find(p => String(p._id).trim() === String(id).trim());

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        packOf: product.packOf,
        category: product.category,
        brand: product.brand,
        quantity: product.quantity,
        description: product.description
      });
    }
  }, [product]);

  if (loading || !product) {
    return <div className="text-center py-10 text-gray-500">Loading product...</div>;
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };


const handleUpdateProduct = async () => {
  try {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const updateForm = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== undefined) updateForm.append(key, val);
    });
    if (imageFile) {
      updateForm.append('productImage', imageFile);
    }

    // ✅ Redux-integrated update
    await dispatch(updateProduct({
      productId: product._id,
      updateData: updateForm
    })).unwrap();

    alert('✅ Product updated successfully');
    setEditMode(false);

  } catch (err) {
    console.error('Update error:', err);
    alert(err.message || 'Failed to update product');
  }
};


  const handleDeleteProduct = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await dispatch(deleteProduct(product._id)).unwrap(); // 👈 dispatch redux thunk
      alert('❌ Product deleted');
      navigate('/');
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const discountedPrice = (product.price * 0.9).toFixed(2);
  const sameBrandProducts = items.filter(p => p.brand === product.brand && p._id !== product._id);
  const sameCategoryProducts = items.filter(p => p.category === product.category && p._id !== product._id);

  return (
    <section>
      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <img
            src={product.productImage}
            alt={product.name}
            className="w-full object-contain aspect-[4/3] rounded"
          />
          {isAdmin && editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2.5">
          {isAdmin && editMode ? (
            <>
              <input name="name" value={formData.name} onChange={handleEditChange} className="border px-2 py-1" />
              <input name="price" type="number" value={formData.price} onChange={handleEditChange} className="border px-2 py-1" />
              <input name="brand" value={formData.brand} onChange={handleEditChange} className="border px-2 py-1" />
              <input name="category" value={formData.category} onChange={handleEditChange} className="border px-2 py-1" />
              <input name="packOf" value={formData.packOf} onChange={handleEditChange} className="border px-2 py-1" />
              <input name="quantity" type="number" value={formData.quantity} onChange={handleEditChange} className="border px-2 py-1" />
              <textarea name="description" value={formData.description} onChange={handleEditChange} className="border px-2 py-1" />
              <div className="flex gap-4 mt-4">
                <button onClick={handleUpdateProduct} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                <button onClick={handleDeleteProduct} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500 capitalize">{product.category}</p>
              <h1 className="text-lg font-semibold text-gray-800">{product.name}</h1>
              <p className="text-sm text-gray-600">Brand: <span className="font-medium">{product.brand}</span></p>
              <p className="text-sm text-gray-600">Pack of: <span className="font-medium">{product.packOf}</span></p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-lg font-semibold text-green-600">₹{discountedPrice}</p>
                <p className="text-gray-600 text-sm line-through">₹{product.price}</p>
                <span className="text-xs text-white bg-green-600 px-2 py-[2px] rounded">10% margin</span>
              </div>
              <p className="text-xs mt-1 text-gray-500">
                <span className="font-bold">{product.quantity}</span> in stock
              </p>
              <p className="text-gray-600 mt-2 text-xs">{product.description}</p>

              {isAdmin ? (
                <div className="flex gap-4 mt-4">
                  <button onClick={() => setEditMode(true)} className="px-6 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition">Edit Product</button>
                  <button onClick={handleDeleteProduct} className="px-6 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition">Delete</button>
                </div>

              ) : (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => dispatch(addToCart({ pId: product._id, quantity }))}
                    className="px-6 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition"
                  >Add to Cart</button>
                  <button
                    onClick={() => dispatch(placeOrder({ id: product._id, quantity }))}
                    className="px-6 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-red-700 transition"
                  >Order Now</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sliders */}
      {sameBrandProducts.length > 0 && (
        <ProductSlider title={`More from ${product.brand}`} items={sameBrandProducts} className="max-w-5xl mx-auto" />
      )}
      {sameCategoryProducts.length > 0 && (
        <ProductSlider title={`More in ${product.category}`} items={sameCategoryProducts} className="max-w-5xl mx-auto" />
      )}
    </section>
  );
};

export default ProductDetails;

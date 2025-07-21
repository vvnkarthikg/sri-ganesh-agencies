import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../redux-store/slices/productSlice';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);

  const [form, setForm] = useState({
    name: '',
    price: '',
    brand: '',
    category: '',
    quantity: '',
    packOf: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
    } else {
      setPreviewURL(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert('Name and price are required.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (imageFile) formData.append('productImage', imageFile);

    const result =  dispatch(addProduct(formData));
    if (result.meta.requestStatus === 'fulfilled') {
        alert('✅ Product added successfully');
      navigate('/');
    }
    else{
        alert('failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 p-10 bg-white shadow-xl rounded-3xl border border-gray-200">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Add New Product
      </h2>

      {error && (
        <div className="mb-6 text-center text-red-600 font-semibold bg-red-50 py-2 px-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Fields */}
        {[
          { name: 'name', label: 'Product Name', type: 'text' },
          { name: 'price', label: 'Price', type: 'number' },
          { name: 'brand', label: 'Brand', type: 'text' },
          { name: 'category', label: 'Category', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' },
          { name: 'packOf', label: 'Pack Of', type: 'number' },
        ].map(({ name, label, type }) => (
          <div key={name} className="relative">
            <input
              name={name}
              type={type}
              onChange={handleChange}
              required
              className="peer h-12 w-full border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-indigo-600 transition-all"
              placeholder={label}
            />
            <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-indigo-600">
              {label}
            </label>
          </div>
        ))}

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows="4"
            onChange={handleChange}
            placeholder="Product Description"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* File Upload with Preview */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 cursor-pointer transition"
          >
            <div className="text-center">
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 16h16" />
              </svg>
              <p className="mt-2 text-sm">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
            </div>
            <input
              id="file-upload"
              name="productImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {previewURL && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={previewURL}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-md border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

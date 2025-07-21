import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux-store/slices/productSlice';

const ProductGrid = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  console.log("🧪 Products value:", items, "Type:", typeof items);

  if (loading) {
    return (
      <div className="text-center py-6">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        <p>Error loading products</p>
      </div>
    );
  }

  return (
    <div className="px-4 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow p-4">
            <div className="w-full h-40 overflow-hidden rounded">
              <img
                src={product.productImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-2">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500 text-sm">₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

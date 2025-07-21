import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux-store/slices/productSlice';
import ProductSlider from './ProductSlider';

import banner from './images/banner-image.png';
import brand1 from './images/kinderjoy.png';
import brand2 from './images/parle.svg';
import brand3 from './images/tictac.png';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // 🧠 Group products by brand (case-insensitive)
  const groupedByBrand = items.reduce((acc, product) => {
  const brandKey = product.brand?.toLowerCase().replace(/\s+/g, '') || 'unknown';
  if (!acc[brandKey]) acc[brandKey] = [];
  acc[brandKey].push(product);
  return acc;
}, {});


  return (
    <section className="py-3 px-5">
      {/* Banner */}
      <img src={banner} alt="Banner" className="rounded-lg shadow-xl" />

      {/* Brands Display */}
      <div className="flex flex-col justify-center items-center py-4">
        <h1 className="text-xl font-semibold mb-2">Available Brands</h1>
        <div className="flex flex-row items-center gap-x-6">
          <img src={brand1} alt="Kinder Joy" className="w-14 h-14 object-contain" />
          <img src={brand2} alt="Parle" className="w-20 h-20 object-contain" />
          <img src={brand3} alt="Tic Tac" className="w-16 h-16 object-contain" />
        </div>
      </div>

      {/* Sliders by Brand */}
      {loading && <p className="text-center py-6">Loading products...</p>}
      {error && <p className="text-center text-red-500 py-6">Error loading products</p>}

      {!loading &&
        !error &&
        Object.entries(groupedByBrand).map(([brand, brandProducts]) => (
          <ProductSlider key={brand} title={brand} items={brandProducts} />
        ))}
    </section>
  );
};

export default HomePage;

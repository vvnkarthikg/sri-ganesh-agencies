import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaArrowRight, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import no from './images/no.jpg';

const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/\s+/g, '') // remove all whitespace
    .trim();

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.products);

  const handleSearchChange = (e) => {
    const rawTerm = e.target.value;
    const normalizedTerm = normalize(rawTerm);
    setSearchTerm(rawTerm);

    if (normalizedTerm) {
      const filtered = items.filter((product) => {
        const fields = [
          product.name,
          product.brand,
          product.category,
          product.description,
          product.packOf?.toString(),
        ];

        return fields.some((field) =>
          normalize(field).includes(normalizedTerm)
        );
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchTerm('');
    setFilteredProducts([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm('');
        setFilteredProducts([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md lg:max-w-lg" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 rounded-md border border-white/30 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white bg-gradient-to-r from-blue-800 via-indigo-900 to-purple-900 placeholder-white shadow-md"
        />
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white">
          <FaSearch />
        </div>
      </div>

      {filteredProducts.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-gradient-to-br from-white via-purple-200 to-white text-black shadow-lg rounded-md max-h-72 overflow-y-auto border border-gray-200 backdrop-blur-sm">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 cursor-pointer transition hover:text-white"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    product.productImage?.startsWith('http')
                      ? product.productImage
                      : `${import.meta.env.VITE_API_URL}/${product.productImage || ''}`
                  }
                  alt={product.name}
                  onError={(e) => (e.target.src = no)}
                  className="w-10 h-10 object-cover rounded"
                />
                <p className="text-sm">{product.name}</p>
              </div>
              <FaArrowRight className="text-gray-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

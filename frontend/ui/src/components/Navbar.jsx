import React from 'react';
import logo from './images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar = () => {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/auth');
  };

  const handleProductSelect = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <nav className="bg-gradient-to-tr from-blue-800 via-indigo-800 to-purple-900 px-6 py-3 shadow-lg text-white">
      <div className="w-full flex items-center justify-between space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="text-lg font-semibold tracking-wide">
            Sri Ganesh Agencies
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-6 hidden md:flex justify-center items-center">
          <SearchBar onProductSelect={handleProductSelect} />
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-sm items-center">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/profile">Profile</Link></li>

          {/* Show Cart only if user is not admin */}
          {!isAdmin && isLoggedIn && (
            <li><Link to="/cart">Cart</Link></li>
          )}

          {/* Show Add Product only if user is admin */}
          {isAdmin && isLoggedIn && (
            <li><Link to="/addProduct">Add Product</Link></li>
          )}

          <li>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            ) : (
              <Link to="/auth">Login</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

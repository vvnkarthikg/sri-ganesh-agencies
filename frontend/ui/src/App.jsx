import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import Orders from './components/Orders';
import Auth from './Authentication/Auth';
import TestAPI from './components/TestAPI';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Profile from './components/Profile';
import './App.css';
import AddProduct from './components/AddProduct';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
        <Navbar />

        <main className="flex-1 bg-gradient-to-br from-sky-300/30 via-white to-purple-200/30">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path = "/addProduct" element = {<AddProduct />} />
            <Route path="/t" element={<TestAPI />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/auth" element={<Auth />} />
            <Route path ="/profile" element={<Profile />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

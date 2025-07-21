import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // use your axiosInstance file
import { useNavigate } from 'react-router-dom';

const Login = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // clear any previous error

    try {
      const response = await axiosInstance.post('/user/signin', {
        email,
        password,
      });

      const token = response.data.token;


      // Save token to localStorage
      localStorage.setItem('token', token);

      // Optional: store isAdmin if needed
      localStorage.setItem('isAdmin', response.data.isAdmin);

      // Navigate to homepage or dashboard
      navigate('/');

    } catch (err) {
      console.error('Login failed:', err);

      // Set appropriate error message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };


  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-101 cursor-pointer"
        >
          Sign In
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          className="text-blue-800 hover:underline transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        >
          Sign up here
        </button>
      </p>
    </div>
  );
};

export default Login;

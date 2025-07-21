import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // Update path as needed
import { useNavigate } from 'react-router-dom';

const Signup = ({ onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axiosInstance.post('/user/signup', {
        firstName,
        lastName,
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', response.data.isAdmin);
      navigate('/');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Last Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

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

        <div>
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-101 cursor-pointer"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-800 hover:underline transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default Signup;

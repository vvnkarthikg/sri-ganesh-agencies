import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-700 text-xl font-medium animate-pulse">Loading profile...</div>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    storeName,
    gstNumber,
    profilepic,
    address
  } = profileData;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto p-8 rounded-2xl shadow-xl bg-white border border-gray-100">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div className="relative group">
            <img
              src={profilepic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-indigo-500 shadow-md group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-800">
              {firstName} {lastName}
            </h2>
            <p className="text-gray-600 text-sm">{email}</p>
            {phoneNumber && <p className="text-gray-500 text-sm">{phoneNumber}</p>}
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Store Info */}
          <div className="bg-gray-50 p-6 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">🛍️ Store Info</h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p><span className="font-medium">Store Name:</span> {storeName}</p>
              <p><span className="font-medium">GST Number:</span> {gstNumber}</p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 p-6 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">🏡 Address</h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p><span className="font-medium">Door No:</span> {address.doorNo}</p>
              <p><span className="font-medium">Street:</span> {address.street}</p>
              {address.landmark && <p><span className="font-medium">Landmark:</span> {address.landmark}</p>}
              <p><span className="font-medium">Area:</span> {address.area}</p>
              <p><span className="font-medium">Mandal:</span> {address.mandal}</p>
              <p><span className="font-medium">District:</span> {address.district}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

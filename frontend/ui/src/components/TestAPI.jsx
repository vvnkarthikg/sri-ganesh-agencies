import { useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // your custom instance

const TestAPI = () => {
  useEffect(() => {
    axiosInstance.get('/products')
      .then(res => {
        console.log('✅ Products API response:', res.data);
      })
      .catch(err => {
        console.error('❌ API Error:', err.response?.data || err.message);
      });
  }, []);

  return <div>Check console for API response</div>;
};

export default TestAPI;

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux-store/slices/cartSlice';
import 'swiper/css';
import 'swiper/css/navigation';
import '../index.css';

const ProductSlider = ({ title, items }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to use the cart.');
      navigate('/auth');
      return;
    }

    if (product.quantity < 1) {
      alert('Sorry, this product is out of stock.');
      return;
    }

    dispatch(addToCart({ pId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => alert(`✅ ${product.name} added to cart!`))
      .catch((err) => {
        console.error('Add to cart error:', err);
        alert(err?.response?.data?.message || 'Failed to add to cart.');
      });
  };

  return (
    <div className="mt-6 px-4 relative">
      <h2 className=" inline-block text-sm mb-6 uppercase font-medium bg-gradient-to-r from-fuchsia-500 via-pink-600 to-indigo-500 bg-clip-text text-transparent">{title}</h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={25}
        slidesPerView={5}
        autoplay={{ delay: 15000 }}
        loop={true}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          1024: { slidesPerView: 5, spaceBetween: 15 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          0: { slidesPerView: 1, spaceBetween: 15 },
        }}
        className="pb-8"
      >
        {items.map((product) => {
          const discountedPrice = (product.price * 0.9).toFixed(2);
          const originalPrice = product.price;

          return (
            <SwiperSlide key={product._id}>
              <div className="max-w-[270px] mb-2 mx-auto bg-white rounded-md shadow-md hover:shadow-lg transition-transform duration-500 overflow-hidden">
                {/* Product Image */}
                <Link to={`/products/${product._id}`}>
                  <div className="h-[65%] border-b border-gray-200 bg-gray-100 px-2">
                    <img
                      src={product.productImage}
                      alt={product.name}
                      className="w-full h-full object-contain aspect-[3/2] drop-shadow-md"
                    />
                  </div>
                </Link>

                {/* Category & Add to Cart */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <p className="text-[10px] font-medium text-black opacity-50 font-inter">
                    {product.category}
                  </p>
                  <div
                    className="flex items-center gap-1 bg-gray-100 border border-[#bbb] rounded-md px-2 py-1 text-black text-center cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01] transition"
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="prod-cart-icon text-[16px]" />
                    <p className="text-[10px] m-0">Add to Cart</p>
                  </div>
                </div>

                {/* Product Details */}
                <Link to={`/products/${product._id}`}>
                  <div className="flex flex-col gap-1 px-4 py-2">
                    <h2 className="text-[#05032D] text-[16px] font-semibold leading-tight">{product.name}</h2>
                    <p className="text-[12px] text-black/70 font-openSans">
                      <span className="capitalize">{product.brand}</span> &bull; Pack of <span className='font-medium text-black'>{product.packOf}</span>
                    </p>

                    {/* Price Info */}
                    <div className="flex items-center gap-2 py-[5px]">
                      <p className="text-green-700 text-[14px] font-semibold font-inter">₹{discountedPrice}</p>
                      <p className="text-blue-800 text-[14px] font-normal">
                        <span className="text-[13px]">MRP:</span> ₹{originalPrice}
                      </p>
                    </div>

                    {/* Stock Info */}
                    <p className={`text-[11px] ${product.quantity <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
                      <span className="font-semibold">{product.quantity}</span> left in stock
                    </p>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-4 mt-4 ">
          <button
            ref={prevRef}
            className="px-4 py-2 bg-gradient-to-tr from-fuchsia-400 via-purple-700 to-purple-600 text-white rounded hover:cursor-pointer hover:scale-95 hover:shadow-xl transition"
          >
            &#8592; Prev
          </button>
          <button
            ref={nextRef}
            className="px-4 py-2 bg-gradient-to-tl from-fuchsia-400 via-purple-700 to-purple-600 text-white rounded hover:bg-gray-700 transition hover:cursor-pointer hover:scale-95 hover:shadow-xl"
          >
            Next &#8594;
          </button>
        </div>
      </Swiper>
    </div>
  );
};

export default ProductSlider;

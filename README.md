Sri Ganesh Agencies Website (MERN Stack)

A full-stack MERN application designed for complete store automation, including product management, user authentication, order processing, and an integrated frontend for seamless customer interaction.

🚀 Features
Backend (Node.js, Express.js)

✔ 25+ REST API endpoints for products, users, authentication, and orders

✔ MongoDB + Mongoose schema modeling with validation & auto-increment IDs

✔ JWT Authentication + role-based authorization (Admin / Staff / User)

✔ Cloudinary image storage for product photos

✔ Multer for file uploads

✔ Optimized queries for faster read/write operations

✔ Fully deployed backend on Vercel

Frontend (React.js)

✔ Tailwind CSS for modern UI styling

✔ Redux Toolkit for global state (Products, Orders, Cart, Auth)

✔ Axios for API requests with interceptor for JWT token

✔ Swiper React for dynamic product sliders

✔ Responsive design for mobile, tablet & desktop

🛠 Tech Stack
Backend

Node.js

Express.js

MongoDB

Mongoose

Multer

Cloudinary SDK

JSON Web Token (JWT)

Vercel (Deployment)

Frontend

React.js

Tailwind CSS

Redux Toolkit

Axios

Swiper React

📁 Folder Structure
/backend
│── controllers/
│── middleware/
│── models/
│── routes/
│── utils/
│── server.js

/frontend
│── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── utils/
│   ├── App.js
│── public/

🔐 Authentication & Authorization

JWT-based login and protected routes

Admin privileges for:

Adding products

Updating product inventory

Managing orders

Users can:

Place orders

View products

Edit profile

☁️ Image Upload Flow

User/Admin uploads a product photo via frontend

Multer processes the file

Cloudinary stores the image

URL is saved in MongoDB product schema

📦 API Overview (25+ Endpoints)
Auth

POST /auth/signup

POST /auth/login

GET /auth/profile

Products

POST /products (Admin)

GET /products

GET /products/:id

PUT /products/:id (Admin)

DELETE /products/:id (Admin)

Orders

POST /orders

GET /orders (Admin)

GET /orders/:id

DELETE /orders/:id (Admin)

(…plus other utility and management endpoints)

🚀 Deployment
Backend

Hosted on Vercel, with environment variables for:

MongoDB URI

Cloudinary keys

JWT secret

Frontend

Can be deployed on:

Vercel

Netlify

Render

📦 Installation
Backend Setup
cd backend
npm install
npm start

Frontend Setup
cd frontend
npm install
npm run dev


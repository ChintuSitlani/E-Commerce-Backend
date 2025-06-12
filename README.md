# 🛠️ E-Commerce Web App – Backend (Express + MongoDB)

# 🛠️ E-Commerce Web App – Backend (Express + MongoDB)

This is the backend API for the full-stack e-commerce application, built with **Node.js**, **Express.js**, and **MongoDB** using **Mongoose**. It powers both buyer and seller functionality and connects to the Angular 19 frontend.

🔗 **Frontend Live Demo:** [https://e-com-web-sigma.vercel.app](https://e-com-web-sigma.vercel.app)

---

## 🗂️ System Architecture

Below is the architecture diagram of the full-stack application:

![Architecture Diagram](./docs/architecture%20diagram.png)

---

## ⚙️ Features

- ✅ **Buyer & Seller Authentication**
  - JWT-based login system
  - Encrypted passwords with `bcryptjs`
  - Separate login/register APIs for buyers and sellers

- 🛒 **Product Management**
  - Sellers can create, update, and delete products
  - Buyers can view filtered products with pagination

- 📬 **OTP Email Verification**
  - OTP-based verification for signup
  - Uses `nodemailer` for sending OTPs

- 🔐 **Security & Middleware**
  - Passwords hashed before saving
  - CORS configured for frontend/backend communication
  - Global error handling middleware
  - MongoDB connection with a custom DB handler

---

## 📁 Project Structure
ecomm-backend/
├── api/ # Entry for Vercel serverless
│ └── index.js
├── controllers/ # Business logic
│ ├── auth.controllers.js
│ ├── buyer.controllers.js
│ ├── cart.controllers.js
│ ├── coupon.controllers.js # (Currently unused)
│ ├── order.controllers.js
│ ├── product.controllers.js
│ └── seller.controllers.js
├── models/ # Mongoose models
│ ├── buyer.models.js
│ ├── cart.models.js
│ ├── coupon.models.js # (Currently unused)
│ ├── order.models.js
│ ├── otp.models.js
│ ├── product.models.js
│ └── seller.models.js
├── routes/ # API routes
│ ├── auth.routes.js
│ ├── buyer.routes.js
│ ├── cart.routes.js
│ ├── coupon.routes.js # (Currently unused)
│ ├── order.routes.js
│ ├── product.routes.js
│ └── seller.routes.js
├── utils/
│ └── jwt.js # JWT helper
├── db.js # MongoDB connection
├── .env # Environment config (not committed)
├── .gitignore
├── vercel.json # Vercel deployment config
├── package.json
└── README.md


---

---

## 🔧 Tech Stack

| Technology     | Purpose                         |
|----------------|----------------------------------|
| Express.js     | Backend framework                |
| MongoDB        | Database                         |
| Mongoose       | ODM for MongoDB                  |
| JWT            | Authentication                   |
| BcryptJS       | Password encryption              |
| Nodemailer     | OTP email service                |
| dotenv         | Environment variable handling    |
| CORS           | Cross-origin access              |

---

## 🧪 Sample API Endpoints

| Endpoint                         | Method | Description                          |
|----------------------------------|--------|--------------------------------------|
| `/api/buyer/signup`              | POST   | Buyer registration with OTP          |
| `/api/seller/signup`             | POST   | Seller registration with OTP         |
| `/api/products?search=&page=`    | GET    | Product list with filter + pagination|
| `/api/buyer/cart`                | POST   | Add product to buyer's cart          |
| `/api/buyer/orders`             | GET    | Get all orders placed by buyer       |

➡️ _Full list available in the `routes/` folder_

---

## 🌐 Environment Variables (`.env`)

```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

.App will run locally at:
👉 http://localhost:3000

🌐 Deployment
This backend is deployed using Vercel serverless functions:
🔗 API Base URL: https://ecomm-backend-pink.vercel.app/api

🙋‍♂️ Author
Chandra Prakash Sitlani
Bitbucket Profile :- https://bitbucket.org/chintusitlani/


📄 License
This backend project is open for personal, educational, and portfolio use.
⚠️ Commercial usage is not permitted without explicit permission.


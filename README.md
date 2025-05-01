 # 🛒 E-Commerce Backend API (Node js)

 An online e-commerce platform backend that allows users to browse products, manage shopping carts, place orders, and make secure payments. The system supports user authentication, role-based access (admin/customer), product and inventory management, and real-time order processing. Designed for scalability, security, and easy integration with various frontend platforms.


## 🚀 Features

- ✅ **User authentication & roles** (Admin, Customer)
- 📦 **Product & Category management**
- 🛒 **Shopping cart & Orders**
- 💳 **Payments integration (Stripe or mock)**
- 🔒 **JWT-based authentication**
- 📊 **Admin Dashboard endpoints**
- 🌐 **RESTful API with Swagger documentation**
- 🧪 **Unit & integration testing ready**

## 👥 User Roles

| Role        | Capabilities                                                                 |
|-------------|------------------------------------------------------------------------------|
| **Customer** | Browse products, manage cart, place orders, make payments                   |
| **Seller**   | Add and manage products, track orders, update inventory                     |
| **Admin**    | Manage users, products, categories, and platform settings                   |


## 🛠 Tech Stack
  
- **Backend**: Express.js  
- **Database**: MySQL
- **ORM**: Sequelize
## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mohamedalnajjar10/E---commerce-.git
cd E---commerce-

2. Install Dependencies

```bash
npm install

3. Add Required Env Variables
create .env file in the root folder, fill it according to .env.example file.

4. Running

```bash
npm start

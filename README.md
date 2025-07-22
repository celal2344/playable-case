# 🎮 Playable Case

**Playable Case** is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js). It provides user registration, authentication with JWT, and role-based access for customers and admins. The app supports full CRUD operations for resources and features a responsive frontend UI.

- 🔐 Secure user login
- 👥 Role-based access (Admin & Customer)
- 🗂️ Task/item management
- 🔍 Search and filter capabilities
- 🚀 Deployed on Vercel (frontend) and AWS EC2 (backend)

---

## 🧰 Technology Stack

### Frontend
- **React.js** (or Next.js)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js (v20.15.0)
- Express.js
- MongoDB (via Mongoose)
- JWT for authentication
- bcrypt for password hashing
- dotenv for environment variables

### Deployment
- **Frontend:** Vercel
- **Backend:** AWS EC2 (PM2 + Node.js)

---

## ⚙️ Installation Instructions

### Prerequisites
- Node.js v20.15.0
- MongoDB (local or Atlas)
- Git

### Clone the repository
```bash
git clone https://github.com/celal2344/playable-case.git
cd playable-case
```

### Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

If applicable, create `.env.local` in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## ▶️ Running the Application

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm run dev    # For Next.js
# or
npm start      # For CRA
```

---

## 👤 Demo Credentials

### Admin
- **Email:** admin@example.com
- **Password:** AdminPass123

### Customer
- **Email:** user@example.com
- **Password:** UserPass123

> These users are included in the seed script or can be manually added via MongoDB.

---

## 📡 API Documentation

| Method | Endpoint             | Description                  | Auth Required |
|--------|----------------------|------------------------------|----------------|
| POST   | `/api/auth/register` | Register a new user          | ❌             |
| POST   | `/api/auth/login`    | Log in and get JWT token     | ❌             |
| GET    | `/api/auth/profile`  | Get user profile             | ✅             |
| GET    | `/api/tasks`         | List all tasks               | ✅             |
| POST   | `/api/tasks`         | Create new task              | ✅             |
| GET    | `/api/tasks/:id`     | Get task by ID               | ✅             |
| PUT    | `/api/tasks/:id`     | Update task by ID            | ✅             |
| DELETE | `/api/tasks/:id`     | Delete task by ID            | ✅             |
| GET    | `/api/users`         | List all users (Admin only)  | ✅ (Admin)     |
| PUT    | `/api/users/:id/role`| Change user role             | ✅ (Admin)     |

> Use `Authorization: Bearer <token>` for protected routes.

---

## 🚀 Deployment Guide

### Frontend (Vercel)

1. Push frontend code to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set environment variables in Vercel:
   - `NEXT_PUBLIC_API_URL=https://<your-ec2-domain-or-ip>`
4. Trigger deployment (happens automatically on push).

### Backend (AWS EC2)

1. SSH into your EC2 instance:
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   ```

2. Install Node.js:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   source ~/.bashrc
   nvm install 20
   ```

3. Clone and set up backend:
   ```bash
   git clone https://github.com/celal2344/playable-case.git
   cd playable-case/backend
   npm install
   ```

4. Set environment variables:
   ```bash
   export MONGO_URI=your_mongodb_uri
   export JWT_SECRET=your_jwt_secret
   ```

5. Start the server with PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name playable-backend
   pm2 save
   pm2 startup
   ```

6. (Optional) Configure NGINX for reverse proxy.

---

## ✅ Features List

- [x] User registration and login
- [x] JWT-based authentication
- [x] Role-based access (admin, user)
- [x] Task CRUD operations
- [x] Search and filtering
- [x] Responsive UI
- [x] API protection via middleware
- [x] Production-ready deployment

---

## 🌱 Environment & Seeding

### Example `.env` (Backend)

```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/playable_db
JWT_SECRET=supersecretkey
```

### Database Seeding (optional)
To seed the database with initial users:
```bash
node seeders/seed.js
```

> Make sure MongoDB is running and the `MONGO_URI` is correctly set.

---

## 📄 License

This project is licensed under the MIT License.

---

## ✨ Author

Created by [@celal2344](https://github.com/celal2344)
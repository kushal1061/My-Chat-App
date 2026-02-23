# 💬 My Chat App

A full-stack real-time chat application with support for one-on-one and group conversations, media sharing, and user profiles — built with **React**, **Express**, **MongoDB**, and **WebSockets**.

---

## ✨ Features

- **Real-Time Messaging** — Instant message delivery powered by WebSockets
- **One-on-One & Group Chats** — Create private conversations or group chats with multiple participants
- **Media Sharing** — Send images and videos via AWS S3 presigned URLs
- **User Authentication** — Secure JWT-based registration & login with bcrypt password hashing
- **User Profiles** — Editable profile with profile picture upload
- **User Search** — Find and start conversations with other users
- **Offline Message Delivery** — Pending messages are delivered when a user reconnects
- **Message Status Tracking** — Track delivered and read receipts per message
- **Modern UI** — Clean, responsive interface with animations (Framer Motion), toast notifications, and auto-growing text input

---

## 🛠️ Tech Stack

| Layer        | Technology                                                      |
| ------------ | --------------------------------------------------------------- |
| **Frontend** | React 19, Vite, TailwindCSS, React Router, Axios, Framer Motion |
| **Backend**  | Node.js, Express 5, WebSocket (`ws`)                            |
| **Database** | MongoDB (Mongoose ODM)                                          |
| **Storage**  | AWS S3 (presigned upload URLs)                                  |
| **Auth**     | JSON Web Tokens, bcryptjs                                       |

---

## 📁 Project Structure

```
My-Chat-App/
├── Backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── s3.js              # AWS S3 client configuration
│   ├── controller/
│   │   ├── user.controller.js # Register, login, search, profile
│   │   ├── chat.controller.js # Create & fetch chats
│   │   └── upload.contoller.js# S3 presigned URL generation
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── model/
│   │   ├── user.js            # User schema
│   │   ├── chats.js           # Chat schema (single & group)
│   │   └── messages.js        # Message schema
│   ├── routes/
│   │   ├── user.routes.js     # /api/user/*
│   │   ├── chat.routes.js     # /api/getChats, /api/getChat, /api/createChat
│   │   └── upload.routes.js   # /api/upload
│   ├── websocket/
│   │   ├── index.js           # WebSocket server setup
│   │   ├── clients.js         # Connected clients store
│   │   └── messageHandler.js  # Auth, chat & pending message logic
│   ├── server.js              # Express app entry point
│   └── .env                   # Environment variables (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Main chat interface
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Register.jsx   # Registration page
│   │   │   └── Profile.jsx    # User profile page
│   │   ├── App.jsx            # Routes & app shell
│   │   ├── main.jsx           # Vite entry point
│   │   └── index.css          # Global styles
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                   # Frontend environment variables
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **AWS Account** — for S3 file uploads (optional, only needed for media sharing)

### 1. Clone the Repository

```bash
git clone https://github.com/kushal1061/My-Chat-App.git
cd My-Chat-App
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name
```

Start the backend server:

```bash
node server.js
```

The REST API will run on **`http://localhost:5000`** and the WebSocket server will start alongside it.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The app will be available at **`http://localhost:5173`**.

---

## 📡 API Endpoints

### User Routes — `/api/user`

| Method | Endpoint       | Auth | Description             |
| ------ | -------------- | ---- | ----------------------- |
| POST   | `/register`    | ❌   | Register a new user     |
| POST   | `/login`       | ❌   | Login & receive JWT     |
| POST   | `/searchUsers` | ✅   | Search users by query   |
| GET    | `/me`          | ✅   | Get current user profile|

### Chat Routes — `/api`

| Method | Endpoint      | Auth | Description                  |
| ------ | ------------- | ---- | ---------------------------- |
| POST   | `/getChats`   | ✅   | Get all chats for the user   |
| POST   | `/getChat`    | ✅   | Get a specific chat by ID    |
| POST   | `/createChat` | ✅   | Create a new chat            |

### Upload Routes — `/api`

| Method | Endpoint  | Auth | Description                        |
| ------ | --------- | ---- | ---------------------------------- |
| POST   | `/upload` | ✅   | Get a presigned S3 URL for upload  |

### WebSocket Events

| Event Type | Direction       | Description                              |
| ---------- | --------------- | ---------------------------------------- |
| `auth`     | Client → Server | Authenticate the WebSocket connection    |
| `chat`     | Bidirectional   | Send/receive chat messages               |
| `message`  | Server → Client | Deliver pending (offline) messages       |

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)

| Variable               | Description                  |
| ---------------------- | ---------------------------- |
| `MONGO_URI`            | MongoDB connection string    |
| `JWT_SECRET`           | Secret key for signing JWTs  |
| `AWS_ACCESS_KEY_ID`    | AWS IAM access key           |
| `AWS_SECRET_ACCESS_KEY`| AWS IAM secret key           |
| `AWS_REGION`           | AWS region (e.g. `us-east-1`)|
| `AWS_S3_BUCKET`        | S3 bucket name for uploads   |

### Frontend (`frontend/.env`)

| Variable       | Description                       |
| -------------- | --------------------------------- |
| `VITE_API_URL` | Backend API base URL              |

---

## 📄 License

This project is licensed under the **ISC License**.

FootResBall — Reservation Management System

A full-stack MERN application to manage football field reservations with automatic scheduling, PDF generation, authentication, and admin dashboard.

🚀 Overview

FootResBall is a complete reservation system for football terrains.
It allows the admin to:

✅ Add reservations
✅ Edit reservations
✅ Mark as paid / unpaid
✅ Generate reservation PDF
✅ Delete reservations
✅ Automatically delete old reservations (after 3 days)
✅ Filter reservations by date & terrain
✅ View upcoming reservations in an organized dashboard
✅ Secure access with JWT authentication


🏗️ Project Structure

FootResBall/
│
├── FootResBall-backend/     # Node.js + Express API
│   ├── controllers/         # Logic for auth & reservations
│   ├── middleware/          # Auth protection
│   ├── models/              # MongoDB Schemas
│   ├── routes/              # API endpoints
│   ├── utils/               # PDF generator
│   ├── server.js            # Main backend entry
│   └── package.json
│
└── FootResBall-frontend/    # React + Vite Admin Dashboard
    ├── src/
    │   ├── components/      # Pages & UI components
    │   ├── services/        # API functions using Axios
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json




🛠️ Technologies Used
Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

BcryptJS

Node-Cron (auto delete system)

PDFKit (generate reservation PDF)

CORS

dotenv

date-fns

Frontend

React + Vite

Axios

React Router DOM

TailwindCSS

LocalStorage Authentication

⚙️ Backend Features (API)
✔️ Authentication
Method	Route	Description
POST	/api/auth/signup	Create new admin
POST	/api/auth/login	Login admin & get token


✔️ Reservation Management
Method	Route	Description
GET	/api/reservations	Get all reservations
GET	/api/reservations/:id	Get one reservation
POST	/api/reservations	Add reservation
PUT	/api/reservations/:id	Update reservation
DELETE	/api/reservations/:id	Delete reservation
GET	/api/reservations/pdf/:id	Download reservation PDF
GET	/api/reservations/filter?terrain=X&date=YYYY-MM-DD	Filter system
GET	/api/reservations/available-slots	Check free time slots


📥 Installation Guide
1️⃣ Clone project
git clone https://github.com/YOUR_USERNAME/FootResBall.git

📌 Backend Setup
cd FootResBall-backend
npm install
npm run dev


Make .env:

JWT_SECRET=yourSecretKey


MongoDB must be running locally:

mongodb://127.0.0.1:27017/footresball

📌 Frontend Setup
cd FootResBall-frontend
npm install
npm run dev


Project runs on:

Backend → http://localhost:5000

Frontend → http://localhost:5173


🛡️ Security

✔ Password hashing using Bcrypt
✔ JWT authentication
✔ Protected routes on frontend
✔ Token stored safely in browser

📦 Final Result

A complete football reservation management platform that includes:

✨ Full CRUD system
✨ Automatic cleaning
✨ PDF exporting
✨ Filtering & slot checking
✨ Secure admin panel
✨ Fully responsive UI


Developed by **[Lahcen Ouhassou](https://github.com/Lahcen-Ouhassou)**  

---

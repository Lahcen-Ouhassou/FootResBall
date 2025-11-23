# FootResBall — Admin Reservation System

FootResBall is a full-stack web application for managing football field reservations.
It provides a secure admin dashboard to create, manage, filter, and organize reservations efficiently.

This system is designed with automation, security, and performance in mind.

✨ Features
🖥️ Admin Dashboard

View total reservations

View today's reservations

Paid & unpaid counters

Upcoming reservations overview

📅 Reservation Management

Add new reservations

Edit existing reservations

Mark reservations as paid or unpaid

Generate PDF tickets for each reservation

Delete reservations

Automatic deletion of old reservations after 3 days

🔎 Filtering & Organization

Filter by date

Filter by terrain

Organized display by football field

Pricing management per terrain

Duration-based calculations

🔐 Security

Admin login protected with JWT authentication

Secure routes

Password hashing with BcryptJS

Token protection refreshed daily

⚙️ Automation

Node-Cron auto-task runs daily

Removes reservations older than 3 days

Keeps system clean and lightweight automatically

🛠️ Technologies Used
Backend (Node.js)

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

BcryptJS

Node-Cron (auto delete reservations)

PDFKit (generate PDF reservation file)

dotenv

CORS

date-fns

Frontend (React)

React + Vite

Axios

React Router DOM

TailwindCSS

LocalStorage Authentication


Developed by **[Lahcen Ouhassou](https://github.com/Lahcen-Ouhassou)**  

---

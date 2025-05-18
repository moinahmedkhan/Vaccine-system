Vaccine Registration Backend API (Node.js + TypeScript + MongoDB)

This project implements a backend API for a vaccine registration platform similar to the CoWIN module of Aarogya Setu, built using Node.js, TypeScript, and MongoDB Atlas.

🚀 Tech Stack

Node.js

TypeScript

Express.js

MongoDB Atlas (Mongoose)

JWT Authentication

Bcrypt for password hashing

Faker.js for data seeding

📦 Features

👤 User Features:

Register new user with: name, phoneNumber, password, age, pincode, aadharNumber

Login with phone number and password

View available time slots by date

Book slot for 1st or 2nd dose

Prevent 2nd dose booking before completing 1st dose

Mark user as vaccinated once slot is completed (implicitly handled)

Update/change slot until 24 hours before scheduled time

🛠️ Admin Features:

Login with predefined credentials (seeded via script)

Filter users by age, pincode, and vaccinationStatus

View total booked slots per day by dose type (1st/2nd/total)

🗂️ Folder Structure

src/
├── app.ts
├── config/
│   └── db.ts
├── controllers/
│   ├── user.controller.ts
│   ├── slot.controller.ts
│   └── admin.controller.ts
├── models/
│   ├── User.ts
│   ├── Slot.ts
│   └── Admin.ts
├── routes/
│   ├── user.routes.ts
│   ├── slot.routes.ts
│   └── admin.routes.ts
├── services/
│   ├── user.service.ts
│   ├── slot.service.ts
│   └── admin.service.ts
├── middleware/
│   └── auth.middleware.ts
├── scripts/
│   ├── seedAdmin.ts
│   └── seedUsers.ts

📘 API Endpoints

👤 User Routes (/api/users)

POST /register – Register a new user

POST /login – Login and get JWT token

💉 Slot Routes (/api/slots)

GET /available?date=YYYY-MM-DD – View available slots for a day

POST /book – Book a slot (1st or 2nd dose)

PUT /reschedule – Update registered slot (allowed 24 hours before)

🔐 Admin Routes (/api/admin)

POST /login – Admin login (manually seeded)

GET /users?age=&pincode=&vaccinationStatus= – Filter users

GET /slot-stats?date=YYYY-MM-DD – Slot summary by date

🔐 Sample Admin Credentials

username: admin
password: admin123

Seeded via npm run seed:admin

🧪 Performance Test (1M+ Users)
Query: {
  "age": { "$gte": 60 },
  "vaccinationStatus": "firstDose"
}
Result Count: 24125
Time Taken: 182 ms
Total Users in DB: 1000000
MongoDB: Atlas (Free Tier)

🧬 Slot Structure

Dates: 1st Nov 2024 to 30th Nov 2024

Time Range: 10:00 AM to 5:00 PM

Slot Duration: 30 minutes

Doses per slot: 10

Total Slots: 420 (30 slots * 14 days)


🧰 Setup Instructions
# Clone repo
$ git clone https://github.com/yourname/Vaccine-system.git
$ cd vaccine-registration-backend

# Install dependencies
$ npm install

# Environment variables
$ cp .env.example .env
# Update your MongoDB URI and JWT_SECRET

# Start dev server
$ npm run start

# Seed Admin
$ npm run seed:admin

# (Optional) Seed Dummy Users
$ npm run seed:users

🧾 .env.example
PORT=5000
MONGO_URI=mongodb+srv://vaccineUser:Vaccine_1234@cluster0.3zhsq.mongodb.net/vaccineDB?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecretkey

🧠 High-Level Architecture
Client (Postman / Frontend)
   ↓
Express Server (app.ts)
   ↓
Routes → Controllers → Services
   ↓                ↓
MongoDB Atlas ← Mongoose Models



JWT Middleware secures protected routes

Admin uses hardcoded credential stored in DB

Slot logic ensures 10-booking cap and date/time validation

Seed scripts populate admin and user data

✅ Author

Moin Ahmed Khan




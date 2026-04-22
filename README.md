📌 🗳️ Voting App (Node.js + MongoDB + JWT)
🚀 Project Overview

This is a secure voting system backend built using:

Node.js
Express.js
MongoDB
Mongoose
JSON Web Token
🎯 Features Implemented
🔐 Authentication
JWT-based authentication
Login using:
Aadhar Card Number
Password
👑 Admin Features
Create voter users
View all users
Update users
Delete users
Create candidates
Update candidates
Delete candidates
View vote results (only admin)
👤 User (Voter) Features
Login
View candidates
Vote (only once)
🗳️ Voting Rules
One user → one vote
Admin cannot vote
Users cannot vote multiple times
Vote count is hidden from users
🔒 Security
Password hashing using bcrypt
Duplicate email & Aadhar validation
Role-based access control (RBAC)
🧠 System Flow
1. Create first Admin
2. Admin login
3. Admin creates candidates
4. Admin creates users (voters)
5. User login
6. User votes (only once)
7. Admin views results
🌐 BASE URL
http://localhost:3000/api
📡 API ROUTES
🔹 AUTH ROUTES
1. Create First Admin
POST /user/signup
Body:
{
  "name": "Admin",
  "age": 30,
  "email": "admin@test.com",
  "mobile": "9999999999",
  "address": "India",
  "aadharCardNumber": "111122223333",
  "password": "123456",
  "role": "admin"
}
2. Login (Admin/User)
POST /user/login
Body:
{
  "aadharCardNumber": "111122223333",
  "password": "123456"
}
Response:
{
  "token": "JWT_TOKEN"
}
👥 USER MANAGEMENT (ADMIN ONLY)
3. Create User (Voter)
POST /user/create-user
Headers:
Authorization: Bearer ADMIN_TOKEN
Body:
{
  "name": "User1",
  "age": 25,
  "email": "user1@test.com",
  "mobile": "8888888888",
  "address": "India",
  "aadharCardNumber": "444455556666",
  "password": "123456"
}
4. Get All Users
GET /user/users
Headers:
Authorization: Bearer ADMIN_TOKEN
5. Update User
PUT /user/user/:id
6. Delete User
DELETE /user/user/:id
🧑‍💼 CANDIDATE MANAGEMENT
7. Create Candidate (Admin Only)
POST /candidate
Headers:
Authorization: Bearer ADMIN_TOKEN
Body:
{
  "name": "Candidate A",
  "party": "Party X",
  "age": 45
}
8. Get Candidates (Admin & User)
GET /candidate
Behavior:
Admin → full data (with voteCount)
User → limited data (no voteCount)
9. Update Candidate (Admin Only)
PUT /candidate/:id
10. Delete Candidate (Admin Only)
DELETE /candidate/:id
🗳️ VOTING
11. Vote (User Only)
POST /candidate/vote/:candidateID
Headers:
Authorization: Bearer USER_TOKEN
Response:
{
  "message": "Vote successful"
}
📊 RESULTS
12. Get Results (Admin Only)
GET /candidate/results
Response:
[
  {
    "name": "Candidate A",
    "party": "Party X",
    "voteCount": 5
  }
]
🚫 Error Cases
Already Voted
{
  "message": "Already voted"
}
Admin Trying to Vote
{
  "message": "Admin cannot vote"
}
Unauthorized Access
{
  "message": "Admin only"
}
📂 Project Structure
project/
│
├── models/
│   ├── user.js
│   └── candidate.js
│
├── routes/
│   ├── userRoutes.js
│   └── candidateRoutes.js
│
├── jwt.js
├── db.js
├── server.js
└── .env
🔧 Environment Variables
MONGO_URL=mongodb://localhost:27017/voting_app
PORT=3000
JWT_SECRET=your_secret_key
✅ Current Implementation Summary

✔ JWT Authentication
✔ Role-Based Access Control (Admin / Voter)
✔ Admin-managed users & candidates
✔ Secure voting (one vote per user)
✔ Vote count visible only to admin
✔ Duplicate user validation
✔ Password hashing

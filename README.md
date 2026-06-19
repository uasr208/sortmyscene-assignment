Markdown

# Premium Event Ticket Booking Arena

A high-performance, atomic full-stack event ticket reservation platform built using the MERN stack (MongoDB, Express, React, Node.js) and styled with an elite, dark-mode design language.

---

## 🚀 Quick Start Guide

### 1. System Requirements

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB community instance running)

### 2. Setting Up the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   Install dependencies:
   ```

Bash
npm install
Create a .env file inside the backend folder and add your connection variables:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_secure_jwt_secret_token_here
Seed the database with the 15 image-driven premium events and seating tracks:

Bash
node seed.js
Spin up the server engine:

Bash
npm run dev 3. Setting Up the React Frontend Portal
Navigate to the frontend directory:

Bash
cd ../frontend
Install dependencies:

Bash
npm install
Boot up the interface layout utility:

Bash
npm run dev
Open http://localhost:5173 inside your web browser.

🛠️ Key Architectural & Design Decisions

1. Atomic Race-Condition & Double-Booking Prevention
   To ensure two users clicking the exact same seat at the identical millisecond cannot overwrite each other, the platform avoids unsafe read-then-modify operations.
   Instead, it utilizes atomic database queries (findOneAndUpdate) targeting specific status filters:

JavaScript
Seat.findOneAndUpdate({
\_id: seatId,
status: 'available' // The lock will ONLY commit if the seat is still available at processing time
}, {
$set: { status: 'reserved', userId: currentUserId }
});
If another transaction claimed the seat even a millisecond prior, the filter condition evaluates to null, instantly failing the transaction and forcing a safe, real-time error rollback message to the frontend client.

2. Automated Expiration Tracking
   Reservations utilize MongoDB Time-To-Live (TTL) indexes or explicit timestamp validations comparing new Date() > expiresAt. If the front-end countdown hits zero or the clock expires before confirmation, the backend flags the seats as invalid, opening them up for other users automatically.

3. Component Architecture & Design System
   State Separation: Handled via React Hooks (useState, useEffect) and Context Providers (AuthContext), keeping logic detached from layout files.

Visual Aesthetic: Styled manually using Tailwind CSS utility tokens to build a responsive, midnight-dark interface mimicking high-end event management frameworks.

💡 Engineering Assumptions
Users are assigned a basic session token on load to fulfill the basic authentication requirement.

Each event is configured with a default grid layout of 40-50 seats divided across rows A to E for testing purposes.

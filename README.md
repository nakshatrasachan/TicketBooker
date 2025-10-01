
# 🎟️ Ticket Booking System

A full-stack, event-driven ticket booking application built with a microservices architecture. This project simulates a real-world system for booking movie or event tickets, handling user authentication, show management, and real-time seat reservations with high concurrency.

---

## 🏛️ System Architecture

This project is built using an event-driven, microservices-based approach to ensure scalability, resilience, and separation of concerns.

- **Synchronous Communication**: The frontend client communicates with backend services via an API Gateway pattern for direct requests (e.g., login, fetching show data).
- **Asynchronous Communication**: Backend services communicate with each other through an event broker (RabbitMQ) to handle complex workflows in a decoupled manner (e.g., booking confirmation events).

---

## ✨ Features

- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Role-Based Access Control**: Distinction between customer and admin roles, with protected admin routes.
- **Show Management**: Admin-only endpoints to create new shows and add seats to them.
- **Dynamic Seat Map**: A clean, interactive UI for users to view and select seats.
- **Real-time Booking**: High-concurrency seat booking logic using Redis transactions to prevent double-booking.
- **Event-Driven Notifications**: A decoupled notification service that "sends" confirmations upon successful bookings.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Router
- **Backend Microservices**: Node.js, Express.js
- **Database**:
  - PostgreSQL: For persistent data like users and shows
  - Redis: For managing real-time seat status and preventing race conditions
- **Event Broker**: RabbitMQ for asynchronous communication between services
- **DevOps**: Docker, Docker Compose for containerization and local development orchestration

---

## 📂 Project Structure

```
ticket-booking-system/
│
├── frontend/                 # React UI
├── services/                 # Parent directory for all backend services
│   ├── booking-service/
│   ├── notification-service/
│   ├── show-service/
│   └── user-service/
│
├── docker-compose.yml        # Orchestrates all backend services
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- Docker and Docker Compose

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd ticket-booking-system
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install Backend Dependencies**
   Navigate into each service directory and run `npm install`:
   ```bash
   cd services/booking-service && npm install && cd ../..
   cd services/notification-service && npm install && cd ../..
   cd services/show-service && npm install && cd ../..
   cd services/user-service && npm install && cd ../..
   ```

### Running the Application

1. **Start the Backend**
   From the root directory, run Docker Compose:
   ```bash
   docker compose up --build --watch
   ```
   This will build and start all backend microservices, PostgreSQL, Redis, and RabbitMQ.

2. **Start the Frontend**
   Open a new terminal window:
   ```bash
   cd frontend
   npm run dev
   ```

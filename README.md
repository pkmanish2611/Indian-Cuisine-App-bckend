# Indian Cuisine Explorer API 🍛

A comprehensive REST API for exploring Indian cuisine dishes, their ingredients, and preparation details. Built with Node.js and Express.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Documentation](#documentation)

## Features ✨

### Dish Management
- 📋 Get all dishes with advanced filtering
- 🔍 Search by name, ingredients, or region
- ℹ️ Get detailed dish information
- ✏️ Create/Update/Delete dishes (Admin only)

### Smart Suggestions
- 🧑‍🍳 Find dishes by available ingredients
- ⚖️ Exact or partial ingredient matching

### Security
- 🔐 JWT Authentication
- 🛡️ Role-based access control

## Tech Stack 💻

**Core**
- Node.js (v18+)
- Express.js
- JSON data storage

**Authentication**
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

**Documentation**
- Swagger UI
- OpenAPI 3.0 Specification

**Development**
- ESLint + Prettier
- Nodemon

## Installation ⚙️

1. Clone the repository:
   ```bash
   git clone https://github.com/pkmanish2611/Indian-Cuisine-App-bckend.git
   cd indian-cuisine-api

2. Install dependencies:
    bash
    npm install

3. Set up environment:
    bash
    cp .env.example .env

## Configuration ⚙️
    Edit the .env file:

    PORT=3000
    JWT_SECRET=your_strong_secret_here
    DATA_FILE=./data/indian_food.json
    NODE_ENV=development

## Running the App 🚀
    Development mode (with hot reload):
    bash
    npm run dev

    Production mode:
    bash
    npm start

The API will be available at http://localhost:3000/api

## API Endpoints 📡

| Method | Endpoint                        | Description                | Auth Required |
|--------|----------------------------------|----------------------------|----------------|
| GET    | `/api/dishes`                   | Get all dishes             | No             |
| POST   | `/api/dishes`                   | Create new dish            | Admin          |
| GET    | `/api/dishes/:name`             | Get dish by name           | No             |
| PATCH  | `/api/dishes/:name`             | Update dish                | Admin          |
| DELETE | `/api/dishes/:name`             | Delete dish                | Admin          |
| POST   | `/api/suggestions/ingredients`  | Get dish suggestions       | Yes            |
| POST   | `/api/auth/login`               | User login                 | No             |


## Documentation 📚
    Interactive API documentation available at:

    http://localhost:3000/api-docs

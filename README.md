# Rocket Launch Tracker

## Project Overview

Rocket Launch Tracker is a full-stack MERN web application developed to track and explore rocket launch information using real-time data from the SpaceDevs API.

The project allows users to create accounts, log in securely, view upcoming launches, save favourite launches, and access their profile information. User data and favourites are stored in MongoDB Atlas, while authentication is implemented using JWT.

---

## Features

### User Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Logout functionality

### Launch Tracking

* View rocket launch information
* View detailed mission information
* Real-time launch data using SpaceDevs API

### User Features

* Save favourite launches
* View all saved favourites
* Profile page
* Persistent login sessions

---

## Technologies Used

### Frontend

* React.js
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* bcryptjs

### Version Control

* Git
* GitHub

---

## Project Structure

```text
rocket-launch-tracker-app

├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js

├── src
│   ├── api
│   ├── components
│   ├── context
│   ├── pages
│   └── App.jsx

└── README.md
```

---

## Installation and Setup

### Clone the repository

```bash
git clone https://github.com/adarshloka-cmyk/rocket-launch-tracker-app.git
```

### Frontend Setup

```bash
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Database Configuration

Create a `.env` file inside the backend folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## API Used

This project uses the SpaceDevs Launch Library API to fetch rocket launch and mission information.

---

## Future Improvements

* Search launches
* Filter launches by mission type
* User profile editing
* Email verification
* Password reset functionality
* Better dashboard analytics
* Application deployment

---

## Author

Adarsh 

Developed as a MERN stack learning project to understand full-stack web development, authentication, API integration, and database management.

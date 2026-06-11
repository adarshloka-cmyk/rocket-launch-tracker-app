# LaunchScope

LaunchScope is a full-stack web application for exploring and tracking upcoming rocket launches using live launch data from the SpaceDevs Launch Library API.

The platform allows users to browse launch schedules, view detailed mission information, maintain a personal watchlist, and add launches directly to their calendars. The application focuses on performance, usability, and a responsive user experience across desktop and mobile devices.

## Features

* Browse upcoming rocket launches
* View detailed mission, vehicle, launch site, and provider information
* User authentication and account management
* Personal watchlist for saving favourite launches
* Live countdowns for upcoming missions
* Google Calendar integration
* Outlook Calendar integration
* ICS calendar export support
* Responsive design for desktop, tablet, and mobile devices
* Optimized image and video delivery for improved performance

## Technology Stack

### Frontend

* React
* React Router
* Vite
* Framer Motion
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JSON Web Tokens (JWT)

### External APIs

* SpaceDevs Launch Library API

## Performance Optimizations

Several optimizations were implemented to improve loading speed and reduce bandwidth usage:

* Hero video compression and delivery optimization
* Image optimization and responsive image loading
* Lazy loading of media assets
* Reduced homepage payload size
* Improved navigation performance across routes

## Project Structure

```text
launchscope/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── assets/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── controllers/
├── public/
└── README.md
```

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/rocket-launch-tracker-app.git
cd rocket-launch-tracker-app
```

### Install frontend dependencies

```bash
npm install
```

### Install backend dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file inside the backend directory and configure the following values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Run the backend

```bash
cd backend
npm run dev
```

### Run the frontend

```bash
npm run dev
```

## Future Improvements

Potential enhancements include:

* Launch notifications
* Advanced launch filtering
* Search improvements
* User activity history
* Additional mission analytics

## Notes

This project was developed as a learning-focused full-stack application and evolved through multiple iterations covering authentication, API integration, performance optimization, responsive design, and deployment workflows.

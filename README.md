# Boilerplate User Authentication

## Features

### Backend node.js
- Winston Logger for a 7-day complete log file backup.
- Nodemailer for efficient email sending capabilities.
- Socket.IO for real-time notifications.
- Secure JWT integration for user authentication.
- Dedicated routes for admin panel functionalities.

### Frontend react.js
- User authentication using React Redux.
- Bootstrap for responsive design.

## Getting Started


### Prerequisites

- Node.js
- MongoDB
- An SMTP service (for nodemailer)

### Installation

#### Backend Setup

1. Clone the repo and navigate into the backend directory.
2. Add the following environment variables to your .env file:
   - `token_key`: JWT token generation.
   - `MONGO_URL`: MongoDB connection URL.
   - `DBNAME`: Database name.
   - `EMAIL_USER`: Email for nodemailer.
   - `EMAIL_PASSWORD`: Password for nodemailer.
3. Install dependencies: `npm i`
4. Start the development server: `npm run dev`

#### Frontend Setup

1. Navigate into the frontend directory.
2. Install dependencies: `npm i`
3. Start the application: `npm start`
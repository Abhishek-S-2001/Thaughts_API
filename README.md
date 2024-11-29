# Thoughts_API

## Overview

The Thoughts Social Platform is a web application built to provide users with a platform to share their thoughts, ideas, and engage with a community of like-minded individuals. The project focuses on creating a social space where users can post thoughts, follow each other, and discover content based on their preferences. The application utilizes a technology stack with Express.js for the backend, React for the frontend, and MongoDB as the database.

The Thoughts API, powered by Node.js and Express.js, delivers a seamless thought-sharing experience while prioritizing secure authentication through JSON Web Tokens (JWT). Users can effortlessly create, explore, update, and delete thoughts via RESTful endpoints. Robust JWT authentication guarantees secure access to personalized thought data, with token expiration seamlessly managed for continuous access renewal. This API embraces scalability, aligning with contemporary authentication practices to provide a secure and efficient platform for expressing and connecting thoughts.

# Thoughts API [ Backend ]
```bash
https://github.com/Abhishek-S-2001/Thoughts_API
```
# Thoughts-Connect [ FrontEnd ]
```bash
https://github.com/Abhishek-S-2001/Thoughts-Connect
```

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Features

- **User Authentication:**
  - Secure user registration and sign-in.
  - JWT (JSON Web Tokens) for authentication.

- **Thoughts Feed:**
  - Users can post thoughts on a public feed.
  - Like, share, and comment on thoughts.

- **User Connections:**
  - Follow and unfollow other users.
  - View a personalized feed based on followed users.

- **Hashtags and Preferences:**
  - Add hashtags to thoughts.
  - Set preferences for personalized content.

- **CRUD Operations for Thoughts:**
  - Create, read, update, and delete thoughts.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Abhishek-S-2001/Thoughts_API.git
   ```

2. **Install dependencies:**

   ```bash
   cd Thoughts_API
   npm install
   ```

3. **Set up the Database (MongoDB):**

   - Navigate to the `app.js` and `models` folder.
   - Set up MongoDB and update the connection details in the configuration.

4. **Run the Server:**

   - Start the  backend Server.
   
   ```bash
   npm start
   ```

   - Access the application at http://localhost:3000.

## Tech Stack

- **Backend:**
  - Express.js

- **Frontend:**
  - React

- **Database:**
  - MongoDB

- **Authentication:**
  - JSON Web Tokens (JWT)

## API Endpoints

- **User Authentication:**
  - `/auth/register` (POST)
  - `/auth/login` (POST)

- **User Actions:**
  - `/users/follow/:userId` (POST)
  - `/users/unfollow/:userId` (POST)

- **Thoughts CRUD Actions:**
  - `/thoughts/all` (GET)
  - `/thoughts/add` (POST)
  - `/thoughts/:thoughtId` (GET)
  - `/thoughts/:thoughtId` (PUT)
  - `/thoughts/:thoughtId` (DELETE)

## Testing

Use tools like Postman to test the API endpoints. Ensure to include necessary headers such as Authorization for authenticated routes and body. 

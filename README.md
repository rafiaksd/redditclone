# Reddit Clone

A full-stack Reddit clone built with MongoDB, Node.js, Express, and React.

## Features
- User authentication (register, login, logout)
- Create, read, update, and delete posts
- Upvote and downvote posts
- Comment on posts
- Nested comments with replies
- Responsive design with Tailwind CSS

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- CORS for cross-origin requests

### Frontend
- React with Vite
- React Router for navigation
- Context API for state management
- Axios for API requests
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rafiaksd/redditclone
cd redditclone
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `[Reddit Clone GitHub](https://rafiaksd.github.io/redditclone)`.

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Posts
- GET `/api/posts` - Get all posts
- GET `/api/posts/:id` - Get a single post
- POST `/api/posts` - Create a new post
- PUT `/api/posts/:id` - Update a post
- DELETE `/api/posts/:id` - Delete a post
- POST `/api/posts/:id/upvote` - Upvote a post
- POST `/api/posts/:id/downvote` - Downvote a post

### Comments
- GET `/api/posts/:id/comments` - Get comments for a post
- POST `/api/posts/:id/comments` - Create a new comment
- PUT `/api/comments/:id` - Update a comment
- DELETE `/api/comments/:id` - Delete a comment
- POST `/api/comments/:id/upvote` - Upvote a comment
- POST `/api/comments/:id/downvote` - Downvote a comment

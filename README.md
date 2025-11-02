 MERN Image Search App with Google OAuth
 Overview
 This is a full-stack image search application built using the MERN stack — MongoDB, Express,
 React, and Node.js — integrated with Google OAuth authentication and the Unsplash API. Users
 can log in via Google, search for images, select multiple results, view their personal search history,
 and see the top search terms across all users.
 Features
 • Google OAuth Login — Secure authentication using Passport.js
 • Image Search — Fetch images from Unsplash API
 • Multi-Select Grid — Select multiple images in a responsive gallery
 • Search History — Each user’s search terms are stored and displayed
 • Top Searches Banner — Shows the 5 most searched terms globally
 • MERN Stack — Complete integration of MongoDB, Express, React, and Node.js
 Project Structure
 merge-image-search/ 
 models/  
README.md
 client/ # React frontend 
 routes/  
 Environment Variables
 server/ # Node + Express backend 
 config/  
 server.js  
 package.json 
Create a file named .env inside the /server folder and add the following:
 MONGO_URI=mongodb+srv:// SESSION_SECRET=yourSecretKey
 UNSPLASH_ACCESS_KEY=yourUnsplashAccessKey GOOGLE_CLIENT_ID=yourGoogleClientId
 GOOGLE_CLIENT_SECRET=yourGoogleClientSecret
 GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback PORT=5000
 Installation & Setup
 1 Clone the repository and navigate to the project folder.
 2 Go to /server and run npm install.
 3 Start the server using node server.js or npx nodemon server.js.
 4 Go to /client and run npm install followed by npm start.
 API Endpoints
 1
 2
 Authentication - /auth/google, /auth/google/callback, /auth/logout
 Search - POST /api/search
3
 Top Searches - GET /api/top-searches
 4
 History - GET /api/history?userId=
 Technologies Used
 • Frontend: React.js, Axios
 • Backend: Node.js, Express.js
 • Database: MongoDB
 • Auth: Passport.js (Google OAuth 2.0)
 • API: Unsplash Developer API
 • Session: express-session + connect-mongo
 Author
 Koulini Reddy Ragi — B.Tech CSE | Aspiring Full-Stack Developer
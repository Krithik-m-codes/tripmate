# TripMate

---

## More About tripmate

This project is a Trip advisory and utility Web Application built with Next.js, MongoDB, Gemini and various APIs to provide users with information about weather, maps, itinerary , restaurants and attractions. Users can sign up, log in, and store their favorite places. The application also allows users to access and interact with a web-based platform.

### Table of Contents

* [TripMate](#tripmate)
  + [More About tripmate](#more-about-tripmate)
    - [Table of Contents](#table-of-contents)
  + [Project Overview](#project-overview)
  + [Features](#features)
  + [Technologies Used](#technologies-used)
  + [Project Structure](#project-structure)
  + [Installation and Setup](#installation-and-setup)
  + [Database Schema](#database-schema)
    - [User Model](#user-model)
  + [Environment Variables](#environment-variables)
  + [Routes and API Endpoints](#routes-and-api-endpoints)
  + [Future Improvements](#future-improvements)
  + [Contributing](#contributing)
  + [License](#license)

## Project Overview

The Tourist Planner Web Application provides users with a platform to explore tourist attractions, get weather updates, view maps, and save their favorite places. Users can create accounts, log in, and manage their profile and saved places. The application uses various APIs to fetch real-time data for weather, maps, and attractions.

## Features

* **User Authentication**: Sign up, log in, and log out functionality.
* **User Profile Management**: Manage user profile and avatar.
* **Favorite Places**: Save and view favorite tourist places.
* **Weather Updates**: Get real-time weather information for selected places.
* **Maps Integration**: View maps and directions.
* **Attractions Information**: Browse and explore tourist attractions.

## Technologies Used

* **Frontend**: Next.js, React
* **Backend**: Typescript
* **Database**: MongoDB
* **Authentication**: NextAuth 
* **APIs**: GEMINI API, MapBox API, Trip Advisory API, Attractions , Pixaby API
* **Styling**: Tailwind CSS or CSS Modules

## Project Structure

```bash
.
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   ├── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   ├── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx
│   │   │   ├── map/
│   │   │   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── verify/
│   │   │   │   ├── [token]/
│   │   │   │       ├── route.ts
│   │   ├── about/
│   │   │   ├── page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   ├── request-feature/
│   │   │   ├── page.tsx
│   │   ├── layout.ts
│   │   ├── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   ├── lib/
│   │   ├── dbConnect.ts
│   ├── models/
│   │   ├── User.model.ts
│   ├── pages/
│   │   ├── api/
│   │   │   ├── sign-up.ts
│   │   │   ├── login.ts
│   ├── styles/
│   │   ├── globals.css
│   ├── utils/
│   │   ├── sendVerificationEmail.ts
├── .env.local
├── README.md
```

## Installation and Setup

01. **Clone the repository:**

```bash
   git clone https://github.com/Krithik-m-codes/tripmate.git
   cd tripmate
   ```

02.**Install dependencies:**

```bash
   npm install
   # or
   yarn install
   ```

03.**Set up environment variables:**

   Create a `.env.local` file in the root of your project and add the necessary environment variables:

```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   MONGODB_URI=your_mongodb_connection_string
   OPENWEATHER_API_KEY=your_openweather_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

04.**Run the development server:**

```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

### User Model

```javascript
const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    username: {
        type: String,
        unique: true
    },
    avatar: String,
    verifyCode: String,
    verifyCodeExpires: Date,
    isVerified: Boolean,
    searchHistory: [String],
    savedPlaces: [String],
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel
```

## Environment Variables

* `NEXTAUTH_URL`: The base URL of your application.
* `NEXTAUTH_SECRET`: Secret key for NextAuth.ts.
* `MONGODB_URI`: Connection string for MongoDB.
* `OPENWEATHER_API_KEY`: API key for OpenWeatherMap.
* `GOOGLE_MAPS_API_KEY`: API key for Google Maps.

## Routes and API Endpoints

* **Frontend Pages:**
  + `/`: Home page
  + `/sign-in`: Sign-in page
  + `/sign-up`: Sign-up page
  + `/dashboard`: User dashboard
  + `/verify/[token]`: Email verification page

* **API Endpoints:**
  + `POST /api/sign-up`: Sign-up API
  + `POST /api/login` : Login API

## Future Improvements

* Add more detailed user profiles.
* Integrate more APIs for additional data (e.g., news, events).
* Implement better error handling and user feedback.
* Add unit and integration tests.
  

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---

Feel free to modify the content to better fit your project specifics. This README provides a comprehensive overview and detailed instructions to help users and contributors understand and work with your project.

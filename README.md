# A Mini LinkedIn Platform

A modern, full-stack social community platform built with Next.js and MongoDB.

<p align="center">
  <a href="YOUR_LIVE_DEMO_URL" target="_blank">
    <strong>🚀 View Live Demo</strong>
  </a>
</p>

---

## Core Features

This platform includes all the required features for a mini LinkedIn-like community:

-   **Secure User Authentication**: Complete JWT-based authentication system with registration and login.
-   **Dynamic User Profiles**: Users can view profiles that display personal information (name, bio) and a feed of their own posts.
-   **Public Post Feed**: A central feed where all user posts are displayed chronologically, showing the author's name and a timestamp.
-   **Post Creation**: Authenticated users can create and publish new text-only posts to the public feed.

## Extra Features & Enhancements

To demonstrate advanced skills and a focus on user experience, several extra features were implemented:

-   **Modern & Responsive UI**: The interface was built from the ground up with Tailwind CSS for a clean, professional, and fully responsive experience on all devices.
-   **In-Place Profile Editing**: Users can edit their own profile information (name and bio) seamlessly through a pop-up modal without leaving the page.
-   **Responsive Navigation**: Includes a polished hamburger menu for a smooth user experience on mobile and tablet devices.
-   **Optimistic UI Feedback**: Features skeleton loaders during data fetching and toast notifications for user actions (login, post creation, profile updates) to provide clear and immediate feedback.
-   **Secure API Design**: Backend API routes are protected using middleware, and security best practices are followed, such as server-side validation and preventing users from editing others' profiles.
-   **Professional Layouts**: UI elements like profile banners, overlaid avatars, and consistent card designs create a cohesive and visually appealing application.

## Tech Stack

The project leverages a modern, MERN-based stack for performance and scalability.

-   **Frontend**: Next.js 14 (App Router) & React 18
-   **Backend**: Node.js via Next.js API Routes
-   **Database**: MongoDB with Mongoose ODM
-   **Styling**: Tailwind CSS
-   **UI Feedback**: `react-hot-toast`
-   **Icons**: `lucide-react`
-   **Authentication**: JSON Web Tokens (JWT)
-   **Deployment**: Vercel

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v18.x or later)
-   A MongoDB Atlas account or a local MongoDB instance.

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Mithun-AM/Linkedin-mini.git
    cd Linkedin-mini
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following variables:
    ```env
    MONGODB_URI="your_mongodb_connection_string"
    JWT_SECRET="your_super_secret_jwt_key_that_is_long_and_random"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🔑 Demo Account

For easy testing and review of the live demo, please use the following credentials:

-   **Email**: `demo@example.com`
-   **Password**: `demopassword123`

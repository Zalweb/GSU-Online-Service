# GSU Online Services

A full-stack web application for the General Services Unit (GSU) to manage service requests, including venue reservations, transportation, and maintenance.

## Features

- **Public Features:**
  - View services (Venue, Transportation, Maintenance, etc.)
  - Register & Login for users
  - Submit service requests (auto-filled with user info)
  - Responsive design (mobile-friendly)

- **Admin Features:**
  - Secure Admin Dashboard
  - View all requests with status tracking
  - Approve/Deny requests
  - Export data to CSV

## Tech Stack

- **Frontend:** HTML5, CSS3 (Custom Design System), JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** SQLite (with `better-sqlite3`)
- **Auth:** Session-based authentication (`express-session`, `bcryptjs`)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/gsu-online-services.git
    cd gsu-online-services
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    - Copy `.env.example` to `.env`
    - Update `SESSION_SECRET` with a strong key

4.  Start the server:
    ```bash
    npm start
    ```

5.  Open `http://localhost:3000` in your browser.

## Default Credentials

- **Admin:** `admin` / `admin123` (Change this in production!)
- **User:** Register a new account to test user features.

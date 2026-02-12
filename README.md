# GSU Online Services – Request Form with Excel Export

A web-based service request portal for GSU students. Users fill out a request form, and each submission is automatically appended to an Excel spreadsheet.

---

## 📁 Project Structure

```
GSU Online Service/
├── public/                          # Frontend (served as static files)
│   ├── index.html                   # Main request form page
│   ├── css/
│   │   └── styles.css               # Stylesheet (dark-mode design)
│   ├── js/
│   │   └── app.js                   # Form validation & submission
│   └── assets/
│       └── images/                  # Logos, icons, etc.
├── src/                             # Backend source code
│   ├── server.js                    # Express entry point
│   ├── config/
│   │   └── config.js                # Reads .env, exports defaults
│   ├── routes/
│   │   └── requestRoutes.js         # POST /api/requests
│   ├── controllers/
│   │   └── requestController.js     # Validates & processes requests
│   └── helpers/
│       └── excelHelper.js           # Excel read/write logic (exceljs)
├── storage/                         # Auto-generated Excel files
│   └── submissions.xlsx             # Created on first submission
├── .env.example                     # Environment variable template
├── .gitignore
├── package.json
└── README.md                        # ← you are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later – [download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone or download this project
cd "GSU Online Service"

# 2. Install dependencies
npm install

# 3. Create your .env file (optional – defaults work out of the box)
cp .env.example .env

# 4. Start the server
npm start
```

The server will start at **http://localhost:3000**.

### Development Mode

Use Node's built-in `--watch` flag for automatic restarts on file changes:

```bash
npm run dev
```

---

## 🔧 Configuration

| Variable     | Default                          | Description                        |
| ------------ | -------------------------------- | ---------------------------------- |
| `PORT`       | `3000`                           | Port the Express server listens on |
| `EXCEL_PATH` | `./storage/submissions.xlsx`     | Path to the Excel output file      |

Set these in a `.env` file at the project root (see `.env.example`).

---

## 📝 API Reference

### `POST /api/requests`

Submit a new service request.

**Request Body** (JSON):

| Field         | Type   | Required | Description                  |
| ------------- | ------ | -------- | ---------------------------- |
| `fullName`    | string | ✅       | Student's full name          |
| `studentId`   | string | ✅       | Student ID number            |
| `email`       | string | ✅       | Email address                |
| `serviceType` | string | ✅       | Type of service requested    |
| `description` | string | ✅       | Detailed description         |

**Success Response** `201`:

```json
{
  "message": "Request submitted successfully!",
  "data": { "timestamp": "...", "fullName": "...", ... }
}
```

**Error Response** `400`:

```json
{ "error": "Full name is required. Email is required." }
```

---

## 📄 License

ISC

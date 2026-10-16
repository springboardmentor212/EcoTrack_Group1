# EcoTrack

AI-Powered Carbon Footprint & Sustainability Management Platform. Track your carbon emissions, set sustainability goals, join eco-challenges and get AI recommendations to reduce your footprint.

Built with the MERN stack (MongoDB, Express, React, Node.js).

---

## Required Installations

Install these before running the project:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | v18 or higher (includes npm) | Runs the backend and frontend |
| [MongoDB Community Server](https://www.mongodb.com/try/download/community) | v6 or higher | Database |
| [MongoDB Compass](https://www.mongodb.com/try/download/compass) (optional) | Latest | GUI to view the database |
| [Git](https://git-scm.com/) | Latest | Clone the repository |

Check the installations:

```bash
node -v
npm -v
mongod --version
git --version
```

---

## Clone the Repository

```bash
git clone https://github.com/springboardmentor212/EcoTrack_Group1.git
cd EcoTrack_Group1
```

The repository has two folders: `backend` and `frontend`.

---

## MongoDB Database

EcoTrack uses a local MongoDB database named `EcoTrackDB`.

1. Make sure the MongoDB service is running on your machine.
2. The connection URL is:

```
mongodb://127.0.0.1:27017/EcoTrackDB
```

3. Open MongoDB Compass and connect to the same URL to view the data. The `EcoTrackDB` database is created automatically when the backend runs for the first time.

---

## Environment Variables

**Backend**: create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/EcoTrackDB
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password_or_app_password
GROQ_API_KEY=your_groq_api_key
```

| Variable | Purpose |
|----------|---------|
| `PORT` | Port the backend runs on |
| `MONGO_URI` | MongoDB connection URL |
| `JWT_SECRET` | Secret key used to sign login tokens |
| `EMAIL_USER` / `EMAIL_PASS` | Email account used to send OTP emails for password reset |
| `GROQ_API_KEY` | API key for the AI recommendations |

**Frontend**: create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

`VITE_API_URL` is the backend URL the frontend sends its requests to.

---

## How to Run the Project

Run the backend and frontend in two separate terminals.

**Backend**

```bash
cd backend
npm install
npm run dev
```

The backend runs at http://localhost:5000

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at http://localhost:5173

Open http://localhost:5173 in your browser to use the app.
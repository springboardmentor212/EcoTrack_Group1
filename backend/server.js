const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const carbonRoutes = require("./routes/carbonRoutes");
const goalRoutes = require("./routes/goalRoutes");
// Database connection
connectDB();

console.log("EMAIL_USER loaded:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded:", !!process.env.EMAIL_PASS);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/goals", goalRoutes);
app.get("/", (req, res) => {
  res.send("EcoTrack Backend API is running");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
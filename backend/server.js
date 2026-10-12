
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const carbonRoutes = require("./routes/carbonRoutes");
const goalRoutes = require("./routes/goalRoutes");
const profileRoutes = require("./routes/profileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const reportRoutes = require("./routes/reportRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
console.log("CHALLENGE ROUTE MOUNTED");

// Connect to MongoDB
connectDB();

console.log("EMAIL_USER loaded:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded:", !!process.env.EMAIL_PASS);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).send("EcoTrack Backend API is running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/challenges", challengeRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

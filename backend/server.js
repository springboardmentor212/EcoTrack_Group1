const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const carbonRoutes = require("./routes/carbonRoutes");
const goalRoutes = require("./routes/goalRoutes");
const profileRoutes = require("./routes/profileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

connectDB();

console.log("EMAIL_USER loaded:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded:", !!process.env.EMAIL_PASS);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req, res) => {
  res.send("EcoTrack Backend API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

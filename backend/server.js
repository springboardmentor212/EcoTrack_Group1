require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
connectDB();
const PORT = 5000;
app.get("/", (req, res) => {
    res.send("EcoTrack Backend is running!");
});
app.listen(PORT, () => {
    console.log(`EcoTrack backend running on http://localhost:${PORT}`);
});
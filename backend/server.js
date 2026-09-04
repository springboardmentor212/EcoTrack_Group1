require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
connectDB();
const PORT = 5000;

app.get("/", (req, res) => {
    res.send("EcoTrack Backend is running!");
});

app.listen(PORT, () => {
    console.log(`EcoTrack backend running on http://localhost:${PORT}`);
});
require("dotenv").config();
const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("EcoTrack Backend is running!");
});

app.listen(PORT, () => {
    console.log(`EcoTrack backend running on http://localhost:${PORT}`);
});
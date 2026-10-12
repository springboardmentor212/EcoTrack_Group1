require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ADMIN = {
  name: "Admin",
  email: process.env.ADMIN_EMAIL || "admin@ecotrack.com",
  password: process.env.ADMIN_PASSWORD || "Admin@12345",
  role: "admin",
  status: "active",
  lastActiveAt: new Date(),
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    console.log(`Admin already exists: ${ADMIN.email}`);
  } else {
    const hashed = await bcrypt.hash(ADMIN.password, 10);
    await User.create({ ...ADMIN, password: hashed });
    console.log(`Admin created. Login: ${ADMIN.email} / ${ADMIN.password}`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

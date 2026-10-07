const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");

let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Creates one notification. If dedupKey is given and the user already has a
 * notification with that key, nothing is created and null is returned.
 */
async function createNotification({
  userId,
  title,
  message,
  type,
  dedupKey = null,
  sendEmail = false,
  userEmail,
}) {
  if (dedupKey) {
    const exists = await Notification.exists({ userId, dedupKey });
    if (exists) return null;
  }

  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    dedupKey,
  });

  if (sendEmail && userEmail) {
    await sendEmailNotification(userEmail, title, message);
  }

  return notification;
}

/**
 * Sends the same notification to many users. Never throws.
 * @param {Array<string|ObjectId>} userIds
 */
async function notifyMany(userIds, { title, message, type, dedupKey = null }) {
  await Promise.all(
    userIds.map((userId) =>
      createNotification({
        userId,
        title,
        message,
        type,
        dedupKey: dedupKey ? `${dedupKey}:${userId}` : null,
      }).catch((e) => console.error("notifyMany failed:", e.message)),
    ),
  );
}

async function sendEmailNotification(toEmail, subject, text) {
  if (!transporter) {
    console.warn("sendEmailNotification skipped — SMTP not configured in .env");
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "EcoTrack <no-reply@ecotrack.app>",
      to: toEmail,
      subject,
      text,
    });
  } catch (err) {
    console.error("sendEmailNotification failed:", err.message);
  }
}

module.exports = {
  createNotification,
  notifyMany,
  sendEmailNotification,
};
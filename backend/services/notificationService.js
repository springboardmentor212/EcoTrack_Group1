// const Notification = require('../models/Notification');
const nodemailer = require("nodemailer");

let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail", // Replace with your service if different
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * @param {{userId: string, title: string, message: string, type: 'system'|'goal'|'challenge'|'ai', sendEmail?: boolean, userEmail?: string}} params
 */
async function createNotification({
  userId,
  title,
  message,
  type,
  sendEmail = false,
  userEmail,
}) {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
  });

  if (sendEmail && userEmail) {
    await sendEmailNotification(userEmail, title, message);
  }

  return notification;
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
  sendEmailNotification,
};

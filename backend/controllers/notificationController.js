const Notification = require("../models/Notification");

async function listNotifications(req, res) {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    const { type } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const skip = (page - 1) * limit;

    const filter = { userId };
    if (type && type !== "all") filter.type = type;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments({ userId, isRead: false }),
    ]);

    return res
      .status(200)
      .json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    console.error("listNotifications error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load notifications" });
  }
}

async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId || req.user._id;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true, readAt: new Date() },
      { new: true },
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (err) {
    console.error("markAsRead error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to mark as read" });
  }
}

async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    return res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("markAllAsRead error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to mark all as read" });
  }
}

module.exports = {
  listNotifications,
  markAsRead,
  markAllAsRead,
};

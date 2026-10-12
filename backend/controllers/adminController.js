const User = require("../models/User");
const agg = require("../utils/userAggregations");
const { createNotification } = require("../services/notificationService");

const ok = (res, data, message, code = 200) =>
  res.status(code).json({ success: true, message, data });
const fail = (res, code, message) =>
  res.status(code).json({ success: false, message });
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(err);
    fail(res, 500, "Something went wrong. Please try again.");
  }
};

const activeAdminCount = () =>
  User.countDocuments({ role: "admin", status: { $ne: "suspended" } });

const getUserStats = handle(async (req, res) =>
  ok(res, await agg.getUserStats()),
);

const listUsers = handle(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const { users, total } = await agg.listUsers({
    search: req.query.search,
    role: req.query.role,
    status: req.query.status,
    page,
    limit,
  });
  ok(res, { users, total, page, limit, totalPages: Math.ceil(total / limit) });
});

const getUserDetail = handle(async (req, res) => {
  const user = await agg.getUserDetail(req.params.id);
  if (!user) return fail(res, 404, "User not found.");
  ok(res, user);
});

const updateUserRole = handle(async (req, res) => {
  const { role } = req.body;
  const target = await User.findById(req.params.id);
  if (!target) return fail(res, 404, "User not found.");
  if (String(target._id) === String(req.user.userId)) {
    return fail(res, 403, "You cannot change your own role.");
  }
  if (target.role === role)
    return ok(res, { _id: target._id, role }, "Role unchanged.");
  if (
    target.role === "admin" &&
    role === "user" &&
    (await activeAdminCount()) <= 1
  ) {
    return fail(res, 400, "The last administrator cannot be demoted.");
  }

  const updated = await User.findByIdAndUpdate(
    target._id,
    { $set: { role, roleChangedAt: new Date() } },
    { returnDocument: "after" },
  ).select("name email role status");

  createNotification({
    userId: target._id,
    type: "system",
    title: "Your role was updated",
    message:
      role === "admin"
        ? "You are now an administrator."
        : "Your administrator access was removed.",
  }).catch(() => {});

  ok(res, updated, `Role changed to ${role}.`);
});

const updateUserStatus = handle(async (req, res) => {
  const { status } = req.body;
  const target = await User.findById(req.params.id);
  if (!target) return fail(res, 404, "User not found.");
  if (String(target._id) === String(req.user.userId)) {
    return fail(res, 403, "You cannot suspend your own account.");
  }
  const current = target.status || "active";
  if (current === status)
    return ok(res, { _id: target._id, status }, "Status unchanged.");
  if (
    status === "suspended" &&
    target.role === "admin" &&
    (await activeAdminCount()) <= 1
  ) {
    return fail(res, 400, "The last administrator cannot be suspended.");
  }

  const update =
    status === "suspended"
      ? { status: "suspended", suspendedAt: new Date() }
      : { status: "active", suspendedAt: null };
  const updated = await User.findByIdAndUpdate(
    target._id,
    { $set: update },
    { returnDocument: "after" },
  ).select("name email role status suspendedAt");
  ok(
    res,
    updated,
    status === "suspended" ? "User suspended." : "User reactivated.",
  );
});

module.exports = {
  getUserStats,
  listUsers,
  getUserDetail,
  updateUserRole,
  updateUserStatus,
};

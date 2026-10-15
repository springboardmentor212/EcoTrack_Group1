import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import TermsAndConditions from "../pages/TermsAndConditions";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import UserDashboard from "../pages/UserDashboard";
import UserDashboardLayout from "../layouts/UserDashboardLayout";
import CarbonTracker from "../pages/CarbonTracker";
import EntryDetail from "../pages/EntryDetail";
import Goals from "../pages/Goals";
import GoalDetail from "../pages/GoalDetail";
import Challenges from "../pages/Challenges";
import SearchResults from "../pages/SearchResults";
import UserProfile from "../pages/UserProfile";
import EditProfile from "../pages/EditProfile";
import Recommendations from "../pages/Recommendations";
import Notifications from "../pages/Notifications";
import ProtectedRoute from "../components/ProtectedRoute";
import ChallengeDetail from "../pages/ChallengeDetail";
import Leaderboard from "../pages/Leaderboard";

import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminChallengesPage from "../pages/admin/AdminChallengesPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/terms" element={<TermsAndConditions />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <UserDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/carbon-tracker" element={<CarbonTracker />} />
          <Route path="/carbon-tracker/:id" element={<EntryDetail />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/goals/:id" element={<GoalDetail />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/challenges" element={<AdminChallengesPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;

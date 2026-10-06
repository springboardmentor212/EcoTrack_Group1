import { Routes, Route, Navigate } from "react-router-dom";

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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

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
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/carbon-tracker" element={<CarbonTracker />} />
        <Route path="/carbon-tracker/:id" element={<EntryDetail />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/goals/:id" element={<GoalDetail />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenge-detail" element={<ChallengeDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
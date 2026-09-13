import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import UserDashboard from '../pages/UserDashboard'
import UserDashboardLayout from '../layouts/UserDashboardLayout'
import CarbonTracker from '../pages/CarbonTracker'
import EntryDetail from '../pages/EntryDetail'
import Goals from '../pages/Goals'
import GoalDetail from '../pages/GoalDetail'
import Challenges from '../pages/Challenges'
import SearchResults from '../pages/SearchResults'
import UserProfile from '../pages/UserProfile'
import EditProfile from '../pages/EditProfile'
import AccountSettings from '../pages/AccountSettings'
import PrivacySettings from '../pages/PrivacySettings'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route element={<UserDashboardLayout />}>
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/carbon-dashboard" element={<CarbonTracker />} />
        <Route path="/carbon-dashboard/:id" element={<EntryDetail />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/goals/:id" element={<GoalDetail />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/settings/privacy" element={<PrivacySettings />} />
      </Route>

      {/* <Route path="*" element={<Navigate to="/LandingPage" replace />} /> */}

    </Routes>
  )
}

export default AppRoutes
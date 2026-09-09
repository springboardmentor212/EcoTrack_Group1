import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Layout from '../components/Layout'
import ForgotPassword from '../pages/ForgotPassword'
import UserDashboard from '../pages/UserDashboard'
import CarbonDashboard from '../pages/CarbonDashboard'
import GoalsDashboard from '../pages/GoalsDashboard'
import EntryHistory from '../pages/EntryHistory'
import EntryDetail from '../pages/EntryDetail'
import GoalDetail from '../pages/GoalDetail'
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
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/carbon-dashboard" element={<CarbonDashboard />} />
      <Route path="/goals" element={<GoalsDashboard />} />
      <Route path="/entries" element={<EntryHistory />} />
      <Route path="/entries/:id" element={<EntryDetail />} />
      <Route path="goals/:id" element={<GoalDetail />} />
      <Route path="search" element={<SearchResults />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/settings/account" element={<AccountSettings />} />
      <Route path="/settings/privacy" element={<PrivacySettings />} />
    </Routes>
  )
}

export default AppRoutes
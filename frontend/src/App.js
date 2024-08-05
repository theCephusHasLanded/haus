import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RoomList from './components/Rooms/RoomList';
import PaymentList from './components/Payments/PaymentList';
import BookingsList from './components/Bookings/BookingList';
import Groups from './components/Community/Groups';
import ColivingSpaces from './components/Coliving/Spaces';
import UserBiosPage from './pages/UserBios/UserBiosPage';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageSessions from './pages/Admin/ManageSessions';
import UserProfile from './components/UserProfile';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute element={<Layout><HomePage /></Layout>} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Layout><DashboardPage /></Layout>} />} />
        <Route path="/admin" element={<PrivateRoute element={<Layout><AdminDashboard /></Layout>} />} />
        <Route path="/rooms" element={<PrivateRoute element={<Layout><RoomList /></Layout>} />} />
        <Route path="/bookings" element={<PrivateRoute element={<Layout><BookingsList /></Layout>} />} />
        <Route path="/payments" element={<PrivateRoute element={<Layout><PaymentList /></Layout>} />} />
        <Route path="/community/groups" element={<PrivateRoute element={<Layout><Groups /></Layout>} />} />
        <Route path="/coliving/spaces" element={<PrivateRoute element={<Layout><ColivingSpaces /></Layout>} />} />
        <Route path="/user-bios" element={<PrivateRoute element={<Layout><UserBiosPage /></Layout>} />} />
        <Route path="/admin/sessions" element={<PrivateRoute element={<Layout><ManageSessions /></Layout>} />} />
        <Route path="/admin/users" element={<PrivateRoute element={<Layout><ManageUsers /></Layout>} />} />
        <Route path="/profile/:id" element={<PrivateRoute element={<Layout><UserProfile /></Layout>} />} />
      </Routes>
    </Router>
  );
};

export default App;

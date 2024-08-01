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
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import RoomsPage from './pages/Rooms/RoomsPage';
import BookingsPage from './pages/Bookings/BookingsPage';
import PaymentsPage from './pages/Payments/PaymentsPage';
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
        <Route path="/rooms" element={<PrivateRoute element={<Layout><RoomsPage /></Layout>} />} />
        <Route path="/bookings" element={<PrivateRoute element={<Layout><BookingsPage /></Layout>} />} />
        <Route path="/payments" element={<PrivateRoute element={<Layout><PaymentsPage /></Layout>} />} />
      </Routes>
    </Router>
  );
};

export default App;

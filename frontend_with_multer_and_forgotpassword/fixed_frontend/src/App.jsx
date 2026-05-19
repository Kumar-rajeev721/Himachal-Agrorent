import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Shared
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import AIChatButton from './components/shared/AIChatButton';
import ChatBot from './pages/ChatBot';

// Public Pages
import Home from './pages/Home';
import LandListing from './pages/LandListing';
import LandDetail from './pages/LandDetail';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import MyBookings from './pages/user/MyBookings';
import BookingDetail from './pages/user/BookingDetail';

// Farmer Pages
import FarmerDashboard from './pages/farmer/Dashboard';
import ManageLands from './pages/farmer/ManageLands';
import AddLand from './pages/farmer/AddLand';
import FarmerBookings from './pages/farmer/FarmerBookings';
import ManageCrops from './pages/farmer/ManageCrops';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminLands from './pages/admin/AdminLands';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCrops from './pages/admin/AdminCrops';
import AdminSeasons from './pages/admin/AdminSeasons';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-success" /></div>;
  if (!user?.token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/lands" element={<LandListing />} />
        <Route path="/lands/:id" element={<LandDetail />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
        <Route path="/chatbot" element={<ProtectedRoute roles={['user', 'farmer', 'admin']}><ChatBot /></ProtectedRoute>} />

        {/* User Routes */}
        <Route path="/dashboard" element={<ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute roles={['user']}><MyBookings /></ProtectedRoute>} />
        <Route path="/bookings/:id" element={<ProtectedRoute roles={['user', 'farmer', 'admin']}><BookingDetail /></ProtectedRoute>} />

        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/farmer/lands" element={<ProtectedRoute roles={['farmer']}><ManageLands /></ProtectedRoute>} />
        <Route path="/farmer/lands/add" element={<ProtectedRoute roles={['farmer']}><AddLand /></ProtectedRoute>} />
        <Route path="/farmer/bookings" element={<ProtectedRoute roles={['farmer']}><FarmerBookings /></ProtectedRoute>} />
        <Route path="/farmer/crops" element={<ProtectedRoute roles={['farmer']}><ManageCrops /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/lands" element={<ProtectedRoute roles={['admin']}><AdminLands /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookings /></ProtectedRoute>} />
        <Route path="/admin/crops" element={<ProtectedRoute roles={['admin']}><AdminCrops /></ProtectedRoute>} />
        <Route path="/admin/seasons" element={<ProtectedRoute roles={['admin']}><AdminSeasons /></ProtectedRoute>} />
      </Routes>
      <AIChatButton />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

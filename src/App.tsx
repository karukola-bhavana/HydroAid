import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import Fundraise from './pages/Fundraise';
import HydroMap from './pages/HydroMap';
import NotFound from './pages/NotFound';
import PaymentPage from './pages/PaymentPage';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/help" element={<Help />} />
      <Route path="/fundraise" element={<Fundraise />} />
      <Route path="/hydromap" element={<HydroMap />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
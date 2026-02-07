import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';
import DepartmentDashboard from '../components/DepartmentDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <Navigation />
        <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-800">Please log in to view your dashboard</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <Navigation />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {user.role === 'user' && <UserDashboard />}
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'department' && <DepartmentDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;

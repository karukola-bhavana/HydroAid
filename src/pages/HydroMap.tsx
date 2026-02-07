import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import UserDashboardMap from '../components/UserDashboardMap';

const HydroMap: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <Navigation />
        <div className="pt-24 text-center">
          <p className="text-blue-600">Please log in to explore the HydroMap.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <Navigation />
      
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            🗺️ Browse Villages Worldwide
          </h1>
          <p className="text-xl text-blue-600 max-w-3xl mx-auto">
            Explore villages around the world that need water infrastructure support. Click on pins to learn more and hear stories from residents.
          </p>
        </div>

        <UserDashboardMap />
      </div>
    </div>
  );
};

export default HydroMap;

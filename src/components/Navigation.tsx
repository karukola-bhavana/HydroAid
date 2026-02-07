// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Droplets, LogOut, User } from 'lucide-react';

// const Navigation: React.FC = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 backdrop-blur-md bg-opacity-95 shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
//             <Droplets className="h-8 w-8 text-cyan-300" />
//             <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
//               HydroAid
//             </span>
//           </Link>
          
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="text-white hover:text-cyan-200 transition-colors font-medium">
//               Home
//             </Link>
//             <Link to="/dashboard" className="text-white hover:text-cyan-200 transition-colors font-medium">
//               Dashboard
//             </Link>
//             <Link to="/hydromap" className="text-white hover:text-cyan-200 transition-colors font-medium">
//               Map
//             </Link>
//             {user?.role === 'user' && (
//               <Link to="/fundraise" className="text-white hover:text-cyan-200 transition-colors font-medium">
//                 Fundraise
//               </Link>
//             )}
//             <Link to="/help" className="text-white hover:text-cyan-200 transition-colors font-medium">
//               Help
//             </Link>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {user ? (
//               <div className="flex items-center space-x-3">
//                 <div className="flex items-center space-x-2 bg-blue-800 bg-opacity-50 rounded-full px-3 py-1">
//                   <User className="h-4 w-4 text-cyan-200" />
//                   <span className="text-cyan-200 text-sm font-medium">{user.name}</span>
//                   {user.level && (
//                     <span className="text-cyan-300 text-xs bg-cyan-800 px-2 py-1 rounded-full">
//                       Lv.{user.level}
//                     </span>
//                   )}
//                 </div>
//                 <Button
//                   onClick={handleLogout}
//                   variant="ghost"
//                   size="sm"
//                   className="text-white hover:text-cyan-200 hover:bg-blue-700"
//                 >
//                   <LogOut className="h-4 w-4" />
//                 </Button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link to="/login">
//                   <Button variant="ghost" className="text-white hover:text-cyan-200 hover:bg-blue-700">
//                     Login
//                   </Button>
//                 </Link>
//                 <Link to="/signin">
//                   <Button className="bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-medium">
//                     Sign Up
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Droplets, LogOut, User, Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 backdrop-blur-md bg-opacity-95 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
            <Droplets className="h-8 w-8 text-cyan-300" />
            <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
              HydroAid
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-cyan-200 transition-colors font-medium">
              Home
            </Link>
            <Link to="/dashboard" className="text-white hover:text-cyan-200 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/hydromap" className="text-white hover:text-cyan-200 transition-colors font-medium">
              Map
            </Link>
            {user?.role === 'user' && (
              <Link to="/fundraise" className="text-white hover:text-cyan-200 transition-colors font-medium">
                Fundraise
              </Link>
            )}
            <Link to="/help" className="text-white hover:text-cyan-200 transition-colors font-medium">
              Help
            </Link>
          </div>

          {/* User / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-blue-800 bg-opacity-50 rounded-full px-3 py-1">
                  <User className="h-4 w-4 text-cyan-200" />
                  <span className="text-cyan-200 text-sm font-medium">{user.name}</span>
                  {user.level && (
                    <span className="text-cyan-300 text-xs bg-cyan-800 px-2 py-1 rounded-full">
                      Lv.{user.level}
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-cyan-200 hover:bg-blue-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-cyan-200 hover:bg-blue-700">
                    Login
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button className="bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-medium">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-white">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-blue-700 bg-opacity-95 rounded-b-lg mt-2 py-2 space-y-2">
            <Link to="/" className="block text-white px-4 py-2 hover:bg-blue-600 rounded">Home</Link>
            <Link to="/dashboard" className="block text-white px-4 py-2 hover:bg-blue-600 rounded">Dashboard</Link>
            <Link to="/hydromap" className="block text-white px-4 py-2 hover:bg-blue-600 rounded">Map</Link>
            {user?.role === 'user' && (
              <Link to="/fundraise" className="block text-white px-4 py-2 hover:bg-blue-600 rounded">Fundraise</Link>
            )}
            <Link to="/help" className="block text-white px-4 py-2 hover:bg-blue-600 rounded">Help</Link>
            {!user && (
              <>
                <Link to="/login" className="block text-white px-4 py-2 hover:bg-blue-600 rounded">Login</Link>
                <Link to="/signin" className="block text-white px-4 py-2 hover:bg-blue-600 rounded">Sign Up</Link>
              </>
            )}
            {user && (
              <button onClick={handleLogout} className="block w-full text-left text-white px-4 py-2 hover:bg-blue-600 rounded">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

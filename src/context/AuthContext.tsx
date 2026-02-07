import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebaseAuth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'department';
  level?: number;
  points?: number;
  teamId?: string;
  adoptedVillages?: string[];
  department?: string;
  fundingHistory?: { projectId: number; date: string; amount: number }[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'admin' | 'department') => Promise<boolean>;
  signUp: (email: string, password: string, name: string, role: 'user' | 'admin' | 'department', department?: string) => Promise<boolean>;
  logout: () => void;
  updateUserProgress: (points: number) => void;
  loginWithGoogle: () => Promise<User | null>;
  adoptVillage: (villageId: string) => void;
  fundProject: (projectId: number, amount: number, points: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  signUp: async () => false,
  logout: () => {},
  updateUserProgress: () => {},
  loginWithGoogle: async () => null,
  adoptVillage: () => {},
  fundProject: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const API_URL = 'http://localhost:5001/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('hydroaid_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Handle redirect result (fallback for popup-blocked scenarios)
    getRedirectResult(auth)
      .then((result) => {
        if (!result) return;
        const googleUser = result.user;
        const userData: User = {
          id: googleUser.uid,
          email: googleUser.email || '',
          name: googleUser.displayName || '',
          role: 'user',
          level: 1,
          points: 0,
          adoptedVillages: []
        };
        setUser(userData);
        localStorage.setItem('hydroaid_user', JSON.stringify(userData));
      })
      .catch((err) => {
        console.error('Google redirect error:', err);
      });
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'admin' | 'department'): Promise<{ success: boolean; redirectTo?: string }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data);
      localStorage.setItem('hydroaid_user', JSON.stringify(data));
      return { success: true, redirectTo: data.redirectTo };
    } else {
      throw new Error(data.message || 'Login failed');
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'user' | 'admin' | 'department', department?: string): Promise<{ success: boolean; redirectTo?: string }> => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, role, department }),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data);
      localStorage.setItem('hydroaid_user', JSON.stringify(data));
      return { success: true, redirectTo: data.redirectTo || (role === 'admin' ? '/admin-dashboard' : '/dashboard') };
    } else {
      throw new Error(data.message || 'Sign up failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hydroaid_user');
  };

  const updateUserProgress = (points: number) => {
    if (user && user.role === 'user') {
      const updatedUser = {
        ...user,
        points: (user.points || 0) + points,
        level: Math.floor(((user.points || 0) + points) / 500) + 1
      };
      setUser(updatedUser);
      localStorage.setItem('hydroaid_user', JSON.stringify(updatedUser));
    }
  };

  const loginWithGoogle = async (): Promise<User | null> => {
    setLoading(true);
    try {
      const provider = googleProvider;
      let googleUser;
      try {
        const result = await signInWithPopup(auth, provider);
        googleUser = result.user;
      } catch (popupError: any) {
        // Fallback to redirect if popup blocked or similar issues
        const popupErrorCode = popupError?.code || '';
        if (
          popupErrorCode === 'auth/popup-blocked' ||
          popupErrorCode === 'auth/cancelled-popup-request' ||
          popupErrorCode === 'auth/popup-closed-by-user'
        ) {
          await signInWithRedirect(auth, provider);
          return null; // flow will continue in getRedirectResult on next load
        }
        throw popupError;
      }
      const userData: User = {
        id: googleUser.uid,
        email: googleUser.email || '',
        name: googleUser.displayName || '',
        role: 'user', // Default to 'user' for Google login
        level: 1,
        points: 0,
        adoptedVillages: []
      };
      setUser(userData);
      localStorage.setItem('hydroaid_user', JSON.stringify(userData));
      // Optionally store in all_users for role restriction
      const existingUsers = JSON.parse(localStorage.getItem('hydroaid_all_users') || '{}');
      const userKey = (googleUser.email || '').toLowerCase();
      if (!existingUsers[userKey]) {
        existingUsers[userKey] = { role: 'user' };
        localStorage.setItem('hydroaid_all_users', JSON.stringify(existingUsers));
      }
      return userData;
    } catch (error) {
      console.error('Google login error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const adoptVillage = (villageId: string) => {
    if (user && user.role === 'user') {
      const updatedUser = {
        ...user,
        adoptedVillages: [...(user.adoptedVillages || []), villageId],
      };
      setUser(updatedUser);
      localStorage.setItem('hydroaid_user', JSON.stringify(updatedUser));
    }
  };

  const fundProject = (projectId: number, amount: number, points: number) => {
    if (user) {
      const newHistoryEntry = { projectId, amount, date: new Date().toISOString() };
      const updatedUser = {
        ...user,
        points: (user.points || 0) + points,
        level: Math.floor(((user.points || 0) + points) / 500) + 1,
        fundingHistory: [...(user.fundingHistory || []), newHistoryEntry],
      };
      setUser(updatedUser);
      localStorage.setItem('hydroaid_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signUp,
      logout,
      updateUserProgress,
      loginWithGoogle,
      adoptVillage,
      fundProject,
    }}>
      {children}
    </AuthContext.Provider>
  );
};


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { auth } from '../lib/firebase';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: 'user' | 'admin' | 'department';
//   level?: number;
//   points?: number;
//   teamId?: string;
//   adoptedVillages?: string[];
//   department?: string;
//   fundingHistory?: { projectId: number; date: string; amount: number }[];
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string, role: 'user' | 'admin' | 'department') => Promise<boolean>;
//   signUp: (email: string, password: string, name: string, role: 'user' | 'admin' | 'department', department?: string) => Promise<boolean>;
//   logout: () => void;
//   updateUserProgress: (points: number) => void;
//   loginWithGoogle: () => Promise<User | null>;
//   adoptVillage: (villageId: string) => void;
//   fundProject: (projectId: number, amount: number, points: number) => void;
// }

// const ADMIN_EMAILS = [
//   'dhannasruthi@gmail.com',
//   'varshinimenta393@gmail.com',
//   'karanampranathi81@gmail.com',
//   'mudilivarnitha@gmail.com',
//   'srujanamanepalli61@gmail.com',
//   'newadmin@example.com',
// ];

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   login: async () => false,
//   signUp: async () => false,
//   logout: () => {},
//   updateUserProgress: () => {},
//   loginWithGoogle: async () => null,
//   adoptVillage: () => {},
//   fundProject: () => {},
// });

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('hydroaid_user');
//     if (savedUser) setUser(JSON.parse(savedUser));
//   }, []);

//   const login = async (email: string, password: string, role: 'user' | 'admin' | 'department') => {
//     try {
//       // Admin email check
//       const emailLower = email.toLowerCase();
//       if (role === 'admin' && !ADMIN_EMAILS.includes(emailLower)) throw new Error('Unauthorized admin email');
//       if (role !== 'admin' && ADMIN_EMAILS.includes(emailLower)) throw new Error('This email is reserved for admin');

//       const res = await fetch('http://localhost:5001/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, role }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Login failed');

//       setUser(data);
//       localStorage.setItem('hydroaid_user', JSON.stringify(data));
//       return true;
//     } catch (err: any) {
//       console.error(err);
//       return false;
//     }
//   };

//   const signUp = async (
//     email: string,
//     password: string,
//     name: string,
//     role: 'user' | 'admin' | 'department',
//     department?: string
//   ) => {
//     try {
//       const emailLower = email.toLowerCase();
//       if (role === 'admin' && !ADMIN_EMAILS.includes(emailLower)) throw new Error('Unauthorized admin email');
//       if (role !== 'admin' && ADMIN_EMAILS.includes(emailLower)) throw new Error('This email is reserved for admin');

//       const res = await fetch('http://localhost:5001/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, name, role, department }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Sign up failed');

//       setUser(data);
//       localStorage.setItem('hydroaid_user', JSON.stringify(data));
//       return true;
//     } catch (err: any) {
//       console.error(err);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('hydroaid_user');
//   };

//   const updateUserProgress = (points: number) => {
//     if (user && user.role === 'user') {
//       const updated = {
//         ...user,
//         points: (user.points || 0) + points,
//         level: Math.floor(((user.points || 0) + points) / 500) + 1,
//       };
//       setUser(updated);
//       localStorage.setItem('hydroaid_user', JSON.stringify(updated));
//     }
//   };

//   const loginWithGoogle = async (): Promise<User | null> => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const googleUser = result.user;

//       // Check admin restriction
//       const emailLower = (googleUser.email || '').toLowerCase();
//       const role: 'user' | 'admin' | 'department' = ADMIN_EMAILS.includes(emailLower) ? 'admin' : 'user';

//       const userData: User = {
//         id: googleUser.uid,
//         email: googleUser.email || '',
//         name: googleUser.displayName || '',
//         role,
//         level: 1,
//         points: 0,
//         adoptedVillages: [],
//       };

//       setUser(userData);
//       localStorage.setItem('hydroaid_user', JSON.stringify(userData));
//       return userData;
//     } catch (err) {
//       console.error('Google login error', err);
//       return null;
//     }
//   };

//   const adoptVillage = (villageId: string) => {
//     if (user && user.role === 'user') {
//       const updated = { ...user, adoptedVillages: [...(user.adoptedVillages || []), villageId] };
//       setUser(updated);
//       localStorage.setItem('hydroaid_user', JSON.stringify(updated));
//     }
//   };

//   const fundProject = (projectId: number, amount: number, points: number) => {
//     if (user) {
//       const updated = {
//         ...user,
//         points: (user.points || 0) + points,
//         level: Math.floor(((user.points || 0) + points) / 500) + 1,
//         fundingHistory: [...(user.fundingHistory || []), { projectId, amount, date: new Date().toISOString() }],
//       };
//       setUser(updated);
//       localStorage.setItem('hydroaid_user', JSON.stringify(updated));
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, signUp, logout, updateUserProgress, loginWithGoogle, adoptVillage, fundProject }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

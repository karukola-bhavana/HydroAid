import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signUp(data.email || data.phone, data.password, data.name, data.role || 'user', data.department);
      if (result.success) {
        const redirectPath = result.redirectTo || (data.role === 'admin' ? '/admin-dashboard' : '/dashboard');
        navigate(redirectPath);
        return { success: true, redirectTo: redirectPath };
      }
    } catch (e) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
    return { success: false };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <Navigation />
      <AuthForm mode="signup" onAuth={handleSignUp} loading={loading} error={error} setError={setError} />
    </div>
  );
};

export default SignIn;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Droplets,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  Building,
  Volume2,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const mascotUrl = 'https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2023924_1280.png';

const ADMIN_EMAILS = [
  'dhannasruthi@gmail.com',
  'varshinimenta393@gmail.com',
  'karanampranathi81@gmail.com',
  'mudilivarnitha@gmail.com',
  'srujanamanepalli61@gmail.com',
  'newadmin@example.com',
];

interface AuthFormProps {
  mode: 'login' | 'signup';
  onAuth: (data: any) => Promise<{ success: boolean; redirectTo?: string }>;
  loading: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onAuth, loading, error, setError }) => {
  const navigate = useNavigate();
  const { user: authUser, loginWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'admin' | 'department'>('user');
  const [department, setDepartment] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (authUser) navigate('/dashboard');
  }, [authUser, navigate]);

  // Handle email/password signup or login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email && !phone) {
      setError('Please enter your email or phone number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Please enter your full name.');
      return;
    }
    if (mode === 'signup' && role === 'department' && !department) {
      setError('Please enter your department/NGO name.');
      return;
    }

    const emailToCheck = email.toLowerCase();

    if (role === 'admin') {
      if (!ADMIN_EMAILS.includes(emailToCheck)) {
        setError('Only authorized admin emails can sign up or log in as admin.');
        return;
      }
    } else if (ADMIN_EMAILS.includes(emailToCheck)) {
      setError('This email is reserved for admin and cannot be used for user or department login.');
      return;
    }

    const data = { email, phone, password, name, role, department, rememberMe };
    const result = await onAuth(data);

    if (!result || !result.success) {
      setError(mode === 'login' ? 'Invalid credentials. Please try again.' : 'Sign up failed. Please try again.');
    } else {
      toast.success(mode === 'login' ? 'Login successful!' : 'Account created successfully!');
      // Redirect based on role or server response
      const redirectPath = result.redirectTo || (role === 'admin' ? '/admin-dashboard' : '/dashboard');
      navigate(redirectPath);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setGoogleError(null);
    try {
      const user = await loginWithGoogle();
      if (user) {
        toast.success(`Welcome ${user.name || user.email}!`);
        navigate('/dashboard');
      } else {
        setGoogleError('Google login failed. Please try again.');
      }
    } catch {
      setGoogleError('Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (

    <div className="flex flex-col md:flex-row items-center justify-center min-h-[80vh] w-full  p-4 pt-20">
    {/* Mascot */}
    <div className="hidden md:flex flex-col items-center justify-center mr-8">
      <img
        src={mascotUrl}
        alt="Friendly mascot"
        className="w-56 h-56 rounded-full shadow-lg border-4 border-blue-100 bg-white"
      />
      <span className="mt-4 text-lg text-blue-700 font-semibold">Welcome to HydroAid!</span>
    </div>
  
    {/* Card */}
    <Card className="w-full sm:w-96 md:w-[480px] lg:w-[600px] shadow-2xl bg-white/90 border-blue-200 rounded-2xl">
      <CardHeader className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
            <Droplets className="h-8 w-8 text-white" />
          </div>
        </div>
  
        {/* Title */}
        <CardTitle className="text-3xl font-bold text-blue-800 mb-3">
          {mode === 'login' ? 'Sign In to HydroAid' : 'Create Your HydroAid Account'}
        </CardTitle>
  
        {/* Login/SignUp Tabs */}
        <div className="flex justify-center gap-2 mb-6 bg-blue-100 rounded-full p-1 w-fit mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className={`text-sm px-4 py-1 rounded-full transition-all ${mode === 'login'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-blue-700 hover:bg-blue-200'
              }`}
          >
            Login
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/signin')}
            className={`text-sm px-4 py-1 rounded-full transition-all ${mode === 'signup'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-blue-700 hover:bg-blue-200'
              }`}
          >
            Sign Up
          </Button>
        </div>
      </CardHeader>
  
      <CardContent className="overflow-y-auto max-h-[75vh] p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
  
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-blue-700 font-medium text-lg">Select your role</Label>
            <div className="flex justify-center gap-3">
              {[
                { label: 'User', value: 'user', icon: <User className="h-5 w-5 text-blue-600" />, color: 'blue' },
                { label: 'Admin', value: 'admin', icon: <Shield className="h-5 w-5 text-green-600" />, color: 'green' },
                { label: 'Department/NGO', value: 'department', icon: <Building className="h-5 w-5 text-purple-600" />, color: 'purple' }
              ].map(({ label, value, icon, color }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer text-lg font-semibold transition-all ${role === value
                    ? `border-${color}-500 bg-${color}-50`
                    : 'border-blue-200 bg-white hover:border-blue-400'
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={() => setRole(value as any)}
                    className={`w-5 h-5 accent-${color}-500`}
                  />
                  {icon} {label}
                </label>
              ))}
            </div>
          </div>
  
          {/* Full Name (Signup) */}
          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-700 font-medium text-lg">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400 text-lg"
                    required
                  />
                </div>
              </div>
  
              {role === 'department' && (
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-blue-700 font-medium text-lg">Department/NGO Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                    <Input
                      id="department"
                      type="text"
                      placeholder="Enter your organization name"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-400 text-lg"
                      required
                    />
                  </div>
                </div>
              )}
            </>
          )}
  
          {/* Email & Password Side by Side */}
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email" className="text-blue-700 font-medium text-lg">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400 text-lg"
                  required
                />
              </div>
            </div>
  
            <div className="flex-1 space-y-2 mt-4 md:mt-0">
              <Label htmlFor="password" className="text-blue-700 font-medium text-lg">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-blue-200 focus:border-blue-400 text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-blue-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
  
          {/* Remember & Forgot */}
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 text-blue-700 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 accent-blue-500"
              />
              Remember Me
            </label>
            <button
              type="button"
              className="text-cyan-700 hover:underline text-sm"
              onClick={() => toast.info('Password reset instructions will be sent to your email.')}
            >
              Forgot Password?
            </button>
          </div>
  
          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-lg border-blue-200 hover:bg-blue-50 mt-2"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading && <span className="loader border-t-2 border-blue-500 border-solid rounded-full w-5 h-5 animate-spin"></span>}
            <img src="./google.png" alt="Google" className="h-6 w-6" />
            Continue with Google
          </Button>
  
          {(googleError || error) && (
            <div className="mt-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 text-center text-sm">
              {googleError || error}
            </div>
          )}
  
          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-semibold py-3 text-lg mt-2 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <span className="loader border-t-2 border-white border-solid rounded-full w-5 h-5 animate-spin"></span>}
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
  
          {/* Footer */}
          <div className="mt-4 text-center text-blue-600 text-sm">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-blue-800">Terms of Service</a> and{' '}
            <a href="#" className="underline hover:text-blue-800">Privacy Policy</a>.
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
  
  );
};

export default AuthForm;

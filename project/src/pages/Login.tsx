import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Wheat, Mail, Lock } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('admin@grainexport.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Wheat className="h-12 w-12 text-primary-600 mr-3" />
            <span className="text-3xl font-bold text-gray-900">GrainExport</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your grain export pricing estimator
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              prefix={<Mail className="h-4 w-4" />}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              prefix={<Lock className="h-4 w-4" />}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-500">
              Demo credentials:
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Email: admin@grainexport.com | Password: password
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          © 2024 GrainExport Solutions. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
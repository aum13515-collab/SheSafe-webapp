import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = login(username, password, activeTab === 'admin');
    if (success) {
      if (activeTab === 'admin') {
        navigate('/admin');
      } else {
        navigate('/main');
      }
    } else {
      setError('Invalid username or password');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-4 safe-area">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-full p-4">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">SheSafe</h1>
        <p className="text-center text-gray-600 text-sm mb-6">Emergency SOS Alert System</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'user' ? 'bg-pink-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'admin' ? 'bg-pink-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={activeTab === 'admin' ? 'admin' : 'Enter username'}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={activeTab === 'admin' ? 'admin123' : 'Enter password'}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register link */}
        {activeTab === 'user' && (
          <div className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-pink-600 font-semibold hover:underline">
              Register here
            </a>
          </div>
        )}

        {/* Demo credentials hint */}
        {activeTab === 'admin' && (
          <div className="mt-6 text-xs text-center text-gray-500 bg-gray-50 rounded-lg p-3">
            Demo: username: admin | password: admin123
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { LogOut, Settings, Home, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user && !isAdmin) {
    return null;
  }

  return (
    <>
      {/* Top navigation bar */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white sticky top-0 z-40 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">SheSafe</h1>
          {!isAdmin && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm hover:bg-pink-500 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Bottom mobile navigation */}
      {!isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
          <div className="flex items-center justify-around">
            <button
              onClick={() => navigate('/main')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                isActive('/main') ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-semibold">Home</span>
            </button>
            <button
              onClick={() => navigate('/contacts')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                isActive('/contacts') ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-semibold">Contacts</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                isActive('/settings') ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-semibold">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex flex-col items-center gap-1 py-3 px-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-xs font-semibold">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

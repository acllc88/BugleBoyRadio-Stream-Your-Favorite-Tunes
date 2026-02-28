import { useState } from 'react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onBack: () => void;
  isDark: boolean;
}

// Admin credentials - in production, this should be in Firebase
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'BugleBoy2025!'
};

export default function AdminLogin({ onLogin, onBack, isDark }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Store admin session
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminLoginTime', Date.now().toString());
      onLogin(true);
    } else {
      setError('Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.2),transparent_50%)]'}`} />
      </div>

      <div className={`relative w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          </div>
          <p className="text-red-200 text-sm">Bugle Boy Radio Control Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-red-500 transition-colors ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter admin username"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-red-500 transition-colors ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <span>🔐</span>
                Access Dashboard
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            className={`w-full py-3 font-medium rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ← Back to Radio
          </button>
        </form>

        {/* Footer */}
        <div className={`px-6 py-4 text-center text-xs ${isDark ? 'bg-gray-900 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
          🔒 This area is restricted to authorized personnel only
        </div>
      </div>
    </div>
  );
}

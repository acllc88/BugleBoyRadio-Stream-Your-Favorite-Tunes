import { useState, useRef } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

interface MaintenanceScreenProps {
  message: string;
  endTime: string;
}

export default function MaintenanceScreen({ message, endTime }: MaintenanceScreenProps) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkAdminSession = () => {
    return sessionStorage.getItem('adminAuth') === 'true';
  };

  const handleLogoClick = () => {
    clickCountRef.current += 1;

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      if (checkAdminSession()) {
        setShowAdminDashboard(true);
      } else {
        setShowAdminLogin(true);
      }
    }
  };

  const handleAdminLoginSuccess = (success: boolean) => {
    if (success) {
      setShowAdminLogin(false);
      setShowAdminDashboard(true);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminLoginTime');
    setShowAdminDashboard(false);
  };

  const formatEndTime = (dateString: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
      });
    } catch { return null; }
  };

  const formattedEndTime = formatEndTime(endTime);

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLoginSuccess} onBack={() => setShowAdminLogin(false)} isDark={true} />;
  }

  if (showAdminDashboard) {
    return <AdminDashboard onLogout={handleAdminLogout} isDark={true} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative text-center max-w-lg w-full">

        {/* Logo - hidden admin trigger */}
        <div
          className="w-28 h-28 mx-auto mb-6 cursor-pointer select-none"
          onClick={handleLogoClick}
        >
          <img
            src="https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png"
            alt="Bugle Boy Radio"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        <h1 className="text-2xl font-bold text-white mb-8">Bugle Boy Radio</h1>

        {/* Animated Radio Wave */}
        <div className="flex items-end justify-center gap-1 mb-8 h-20">
          {[3, 5, 8, 11, 14, 16, 14, 11, 8, 5, 3, 5, 8, 11, 14, 16, 14, 11, 8, 5].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full"
              style={{
                height: `${h * 4}px`,
                animation: `maintenance-bar 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.06}s`,
              }}
            />
          ))}
        </div>

        {/* Maintenance Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-6 py-2 mb-6">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest">Under Maintenance</span>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        </div>

        {/* Message */}
        <p className="text-gray-300 text-lg mb-6 leading-relaxed px-4">
          {message || "We're performing scheduled maintenance to improve your listening experience. We'll be back shortly!"}
        </p>

        {/* End Time */}
        {formattedEndTime && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 mb-8 mx-4">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Expected back</p>
            <p className="text-white font-semibold text-lg">{formattedEndTime}</p>
          </div>
        )}

        {/* Animated signal rings */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-2 rounded-full border-2 border-amber-500/40 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
          <div className="absolute inset-4 rounded-full border-2 border-amber-500/50 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">📡</span>
          </div>
        </div>

        {/* ACLLC link */}
        <p className="text-gray-500 text-sm mb-4">
          Questions? Visit{' '}
          <a
            href="https://acllc.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:underline"
          >
            acllc.vercel.app
          </a>
        </p>

        <p className="text-gray-700 text-xs">© 2025 ACLLC. All rights reserved.</p>
      </div>

      <style>{`
        @keyframes maintenance-bar {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

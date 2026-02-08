import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

export function UserMenu() {
  const { user, setShowAuthModal, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => setShowAuthModal(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
          "hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-500/25",
          "active:scale-95"
        )}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        Sign In
      </button>
    );
  }

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all duration-200",
          "hover:bg-white/5",
          isOpen && "bg-white/5"
        )}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="w-9 h-9 rounded-full border-2 border-amber-500/30 object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold border-2 border-amber-500/30">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-white text-xs font-semibold truncate max-w-[120px]">
            {user.displayName || "User"}
          </p>
          <p className="text-white/30 text-[10px] truncate max-w-[120px]">
            {user.email}
          </p>
        </div>
        <svg
          className={cn(
            "w-3.5 h-3.5 text-white/30 transition-transform duration-200 hidden sm:block",
            isOpen && "rotate-180"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#16161f] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-[scaleIn_0.15s_ease-out]">
          {/* User info */}
          <div className="px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-10 h-10 rounded-full border-2 border-amber-500/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-white/30 text-[11px] truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Sync status */}
          <div className="px-4 py-2.5 border-b border-white/5">
            <div className="flex items-center gap-2 text-green-400/80">
              <div className="relative">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span className="text-[11px] font-medium">Favorites synced to cloud</span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

interface UserMenuProps {
  isDark: boolean;
}

export function UserMenu({ isDark }: UserMenuProps) {
  const { user, setShowAuthModal, logout, favorites } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const signOutBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const btn = signOutBtnRef.current;
    if (!btn) return;

    const handleSignOut = async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
      await logout();
    };

    btn.addEventListener("click", handleSignOut);
    return () => btn.removeEventListener("click", handleSignOut);
  }, [logout, isOpen]);

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
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all duration-200",
          isDark ? "hover:bg-white/5" : "hover:bg-gray-100",
          isOpen && (isDark ? "bg-white/5" : "bg-gray-100")
        )}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full border-2 border-amber-500/30 object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold border-2 border-amber-500/30">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className={cn("text-xs font-semibold truncate max-w-[120px]", isDark ? "text-white" : "text-gray-800")}>{user.displayName || "User"}</p>
          <p className={cn("text-[10px] truncate max-w-[120px]", isDark ? "text-white/30" : "text-gray-400")}>{user.email}</p>
        </div>
        <svg className={cn("w-3.5 h-3.5 transition-transform duration-200 hidden sm:block", isDark ? "text-white/30" : "text-gray-400", isOpen && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className={cn(
          "absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl overflow-hidden z-50 animate-[scaleIn_0.15s_ease-out]",
          isDark ? "bg-[#16161f] border border-white/10 shadow-black/50" : "bg-white border border-gray-200 shadow-gray-300/50"
        )}>
          <div className={cn("px-4 py-3 border-b", isDark ? "border-white/5" : "border-gray-100")}>
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full border-2 border-amber-500/20" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold border-2 border-amber-500/20">{initials}</div>
              )}
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-semibold truncate", isDark ? "text-white" : "text-gray-800")}>{user.displayName || "User"}</p>
                <p className={cn("text-[11px] truncate", isDark ? "text-white/30" : "text-gray-400")}>{user.email}</p>
                <p className={cn("text-[10px] mt-0.5", isDark ? "text-amber-500/60" : "text-amber-600")}>
                  ❤️ {favorites.size} favorites
                </p>
              </div>
            </div>
          </div>

          <div className={cn("px-4 py-2.5 border-b", isDark ? "border-white/5" : "border-gray-100")}>
            <div className="flex items-center gap-2 text-green-500">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-[11px] font-medium">Favorites synced to cloud</span>
            </div>
          </div>

          <div className="p-1.5">
            <button
              ref={signOutBtnRef}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer select-none transition-all",
                isDark ? "text-red-400/80 hover:bg-red-500/10 hover:text-red-400" : "text-red-500 hover:bg-red-50 hover:text-red-600"
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

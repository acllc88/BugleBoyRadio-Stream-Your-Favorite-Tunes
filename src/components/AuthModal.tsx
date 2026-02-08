import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

export function AuthModal() {
  const {
    showAuthModal,
    setShowAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          setError("Please enter your name");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, displayName.trim());
      }
      // Reset form
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      switch (firebaseError.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/email-already-in-use":
          setError("An account with this email already exists");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later");
          break;
        case "auth/popup-closed-by-user":
          setError("");
          break;
        case "auth/invalid-credential":
          setError("Invalid email or password");
          break;
        default:
          setError(firebaseError.message || "Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={() => {
          setShowAuthModal(false);
          setError("");
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-[scaleIn_0.3s_ease-out]">
        {/* Glow behind modal */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-xl" />

        <div className="relative bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative px-6 pt-8 pb-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
            <button
              onClick={() => {
                setShowAuthModal(false);
                setError("");
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <img
              src="https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png"
              alt="Bugle Boy Radio"
              className="w-16 h-16 mx-auto rounded-2xl shadow-lg shadow-amber-500/15 mb-4 object-contain"
            />
            <h2 className="text-xl font-bold text-white relative">
              {mode === "login" ? "Welcome Back!" : "Join Bugle Boy Radio"}
            </h2>
            <p className="text-white/40 text-sm mt-1 relative">
              {mode === "login"
                ? "Sign in to sync your favorites"
                : "Create an account to save favorites"}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                "bg-white text-gray-800 hover:bg-gray-100 hover:shadow-lg hover:shadow-white/10",
                "active:scale-[0.98]",
                isSubmitting && "opacity-60 cursor-not-allowed"
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/25 text-xs font-medium">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 ml-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/20 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/20 transition-all"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <p className="text-red-300 text-xs">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full py-3 rounded-xl font-bold text-sm transition-all duration-200",
                  "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
                  "hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-500/20",
                  "active:scale-[0.98]",
                  isSubmitting && "opacity-60 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 20" strokeLinecap="round" />
                    </svg>
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Toggle mode */}
            <div className="text-center mt-5">
              <p className="text-white/30 text-xs">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setError("");
                  }}
                  className="text-amber-400 font-semibold hover:text-amber-300 transition-colors"
                >
                  {mode === "login" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

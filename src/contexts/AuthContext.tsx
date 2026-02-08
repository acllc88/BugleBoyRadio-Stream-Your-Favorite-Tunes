import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  favorites: Set<string>;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load favorites from Firestore when user logs in
  const loadFavorites = useCallback(async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.favorites && Array.isArray(data.favorites)) {
          setFavorites(new Set(data.favorites));
        }
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem("bugleboy-favorites");
        if (stored) setFavorites(new Set(JSON.parse(stored)));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save favorites to Firestore
  const saveFavorites = useCallback(
    async (newFavorites: Set<string>) => {
      // Always save to localStorage as backup
      try {
        localStorage.setItem(
          "bugleboy-favorites",
          JSON.stringify([...newFavorites])
        );
      } catch {
        // ignore
      }

      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          await setDoc(
            docRef,
            {
              favorites: [...newFavorites],
              email: user.email,
              displayName: user.displayName,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.error("Error saving favorites:", err);
        }
      }
    },
    [user]
  );

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadFavorites(currentUser.uid);
      } else {
        // Load from localStorage when not logged in
        try {
          const stored = localStorage.getItem("bugleboy-favorites");
          if (stored) setFavorites(new Set(JSON.parse(stored)));
        } catch {
          // ignore
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadFavorites]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
      // Merge localStorage favorites into Firestore
      await mergeFavoritesOnLogin(result.user.uid);
    } catch (err) {
      console.error("Google sign-in error:", err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setShowAuthModal(false);
      await mergeFavoritesOnLogin(result.user.uid);
    } catch (err) {
      console.error("Email sign-in error:", err);
      throw err;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      setShowAuthModal(false);
      await mergeFavoritesOnLogin(result.user.uid);
    } catch (err) {
      console.error("Sign-up error:", err);
      throw err;
    }
  };

  // Merge local favorites with cloud on login
  const mergeFavoritesOnLogin = async (uid: string) => {
    try {
      const localStored = localStorage.getItem("bugleboy-favorites");
      const localFavs: string[] = localStored ? JSON.parse(localStored) : [];

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const cloudFavs: string[] =
        docSnap.exists() && docSnap.data().favorites
          ? docSnap.data().favorites
          : [];

      // Merge both sets
      const merged = new Set([...cloudFavs, ...localFavs]);
      setFavorites(merged);

      await setDoc(
        docRef,
        {
          favorites: [...merged],
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Merge favorites error:", err);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setFavorites(new Set());
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleFavorite = useCallback(
    (stationId: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(stationId)) {
          next.delete(stationId);
        } else {
          next.add(stationId);
        }
        saveFavorites(next);
        return next;
      });
    },
    [saveFavorites]
  );

  const isFavorite = useCallback(
    (stationId: string) => favorites.has(stationId),
    [favorites]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        favorites,
        showAuthModal,
        setShowAuthModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

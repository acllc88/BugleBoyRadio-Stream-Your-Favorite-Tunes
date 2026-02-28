import { useState, useEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import { stations, type RadioStation } from './data/stations';
import { StationCard } from './components/StationCard';
import { PlayerBar } from './components/PlayerBar';
import { AuthModal } from './components/AuthModal';
import { UserMenu } from './components/UserMenu';
import { ChatRoom } from './components/ChatRoom';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import MaintenanceScreen from './components/MaintenanceScreen';
import { collection, onSnapshot, query, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Convert country code to flag emoji
const countryCodeToFlag = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Get user's country from IP
const getUserCountry = async (): Promise<{ code: string; name: string; flag: string }> => {
  try {
    const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
    const data = await response.json();
    const code = data.country_code || 'US';
    const name = data.country_name || 'United States';
    return { code, name, flag: countryCodeToFlag(code) };
  } catch {
    return { code: 'US', name: 'United States', flag: '🇺🇸' };
  }
};

export default function App() {
  const { user, loading, favorites, toggleFavorite, isFavorite, setShowAuthModal } = useAuth();

  // Theme
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('bugleboy-theme');
    return saved ? saved === 'dark' : true;
  });

  // Admin mode
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const auth = sessionStorage.getItem('adminAuth');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    // Session expires after 2 hours
    if (auth === 'true' && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime);
      return elapsed < 2 * 60 * 60 * 1000;
    }
    return false;
  });

  // Maintenance mode - from Firebase
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [maintenanceEndTime, setMaintenanceEndTime] = useState('');

  // Announcements - from Firebase
  const [announcement, setAnnouncement] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [showAnnouncementBanner, setShowAnnouncementBanner] = useState(true);

  // Search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showMore, setShowMore] = useState(60);

  // Audio
  const [playingStation, setPlayingStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevVolumeRef = useRef(0.7);

  // Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastReadRef = useRef(Date.now());
  const chatOpenRef = useRef(false);

  // Legal pages
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Secret admin access - click logo 5 times
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 2000);

    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      setShowAdminLogin(true);
    }
  };

  // Listen to settings from Firebase (maintenance mode, announcements) - REAL TIME
  useEffect(() => {
    console.log('🔄 Setting up real-time settings listener...');
    const settingsRef = doc(db, 'settings', 'general');
    
    const unsub = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        console.log('📡 Settings updated from Firebase:', data);
        
        // Update maintenance mode
        setMaintenanceMode(data.maintenanceMode === true);
        setMaintenanceMessage(data.maintenanceMessage || '');
        setMaintenanceEndTime(data.maintenanceEndTime || '');
        
        // Update announcements
        setAnnouncement(data.announcement || '');
        setAnnouncementEnabled(data.announcementEnabled === true);
        
        // Log what changed
        if (data.maintenanceMode) {
          console.log('🔴 MAINTENANCE MODE ACTIVE');
        } else {
          console.log('🟢 APP IS LIVE');
        }
        
        if (data.announcementEnabled && data.announcement) {
          console.log('📢 Announcement:', data.announcement);
        }
      } else {
        console.log('⚠️ No settings document found in Firebase');
      }
    }, (error) => {
      console.error('❌ Error listening to settings:', error);
    });
    
    return () => unsub();
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem('bugleboy-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Online presence - push to Firebase with country
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'onlineUsers', user.uid);
    let userCountry = { code: 'US', name: 'United States', flag: '🇺🇸' };

    const setOnline = async (country?: { code: string; name: string; flag: string }) => {
      try {
        const countryData = country || userCountry;
        await setDoc(userDocRef, {
          oduserId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'User',
          userPhoto: user.photoURL || null,
          lastSeen: Date.now(),
          countryCode: countryData.code,
          countryName: countryData.name,
          countryFlag: countryData.flag,
        });
      } catch (e) {
        console.error('Error setting online:', e);
      }
    };

    getUserCountry().then(country => {
      userCountry = country;
      setOnline(country);
    });

    const heartbeat = setInterval(() => setOnline(), 10000);

    const cleanupStale = async () => {
      try {
        const snap = await getDocs(collection(db, 'onlineUsers'));
        const now = Date.now();
        const THIRTY_SECONDS = 30 * 1000;
        for (const d of snap.docs) {
          const ls = d.data().lastSeen;
          if (typeof ls === 'number' && now - ls > THIRTY_SECONDS) {
            try { await deleteDoc(doc(db, 'onlineUsers', d.id)); } catch { /* ignore */ }
          }
        }
      } catch { /* ignore */ }
    };
    cleanupStale();
    const cleanupInterval = setInterval(cleanupStale, 15000);

    const goOffline = async () => {
      try { await deleteDoc(userDocRef); } catch { /* ignore */ }
    };

    window.addEventListener('beforeunload', goOffline);
    window.addEventListener('pagehide', goOffline);

    return () => {
      clearInterval(heartbeat);
      clearInterval(cleanupInterval);
      window.removeEventListener('beforeunload', goOffline);
      window.removeEventListener('pagehide', goOffline);
      goOffline();
    };
  }, [user]);

  // Online count listener
  useEffect(() => {
    const onlineRef = collection(db, 'onlineUsers');
    const unsub = onSnapshot(onlineRef, (snap) => {
      const now = Date.now();
      const THIRTY_SECONDS = 30 * 1000;
      const activeUsers = snap.docs.filter(d => {
        const data = d.data();
        const lastSeen = data.lastSeen;
        return typeof lastSeen === 'number' && (now - lastSeen) < THIRTY_SECONDS;
      });
      setOnlineCount(activeUsers.length);
    }, () => setOnlineCount(0));
    return () => unsub();
  }, []);

  // Unread messages listener
  useEffect(() => {
    const messagesRef = collection(db, 'chatMessages');
    const q = query(messagesRef);
    const unsub = onSnapshot(q, (snap) => {
      if (chatOpenRef.current) return;
      let count = 0;
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.userId !== user?.uid) {
          const ts = data.createdAt?.toMillis?.() || 0;
          if (ts > lastReadRef.current) count++;
        }
      });
      setUnreadCount(count);
    }, () => {});
    return () => unsub();
  }, [user]);

  // Audio player
  useEffect(() => {
    if (!playingStation) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = isMuted ? 0 : volume;
    audio.src = playingStation.streamUrl;
    setIsBuffering(true);
    audio.oncanplay = () => { setIsBuffering(false); audio.play().catch(() => {}); setIsPlaying(true); };
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onerror = () => { setIsBuffering(false); setIsPlaying(false); };
    audio.onwaiting = () => setIsBuffering(true);
    audio.onplaying = () => setIsBuffering(false);
    return () => { audio.pause(); audio.src = ''; };
  }, [playingStation]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !playingStation) return;
    if (isPlaying) audioRef.current.pause();
    else {
      setIsBuffering(true);
      audioRef.current.src = playingStation.streamUrl;
      audioRef.current.play().catch(() => { setIsBuffering(false); });
    }
  };

  const playStation = (station: RadioStation) => {
    if (playingStation?.id === station.id) togglePlay();
    else setPlayingStation(station);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (isMuted && v > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolumeRef.current);
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume;
      setIsMuted(true);
    }
  };

  const openChat = () => {
    setIsChatOpen(true);
    chatOpenRef.current = true;
    setUnreadCount(0);
    lastReadRef.current = Date.now();
  };

  const closeChat = () => {
    setIsChatOpen(false);
    chatOpenRef.current = false;
    lastReadRef.current = Date.now();
  };

  // Genres
  const allGenres = ['All', ...Array.from(new Set(stations.map(s => s.genre))).sort()];
  const genreEmoji: Record<string, string> = {
    'All': '📻', 'Hip-Hop': '🎤', 'Rap': '🎤', 'R&B': '🎵', 'Soul': '🎵',
    'Rock': '🎸', 'Classic Rock': '🎸', 'Country': '🤠', 'Jazz': '🎷',
    'Classical': '🎻', 'Electronic': '🎹', 'Ambient': '🌊', 'Pop': '🎵',
    'Blues': '🎺', 'Gospel': '⛪', 'Latin': '🌴', 'Sports': '🏈',
    'News': '📰', 'Indie': '🎭', 'Folk': '🪕', 'Oldies': '🎃',
    'Metal': '🤘', 'Reggae': '🌴', 'World': '🌍', 'Lounge': '🍸',
    'Chill': '❄️', 'Holiday': '🎄', 'Talk': '🎙️', 'Variety': '🎪',
  };

  // Filter stations
  const filtered = stations.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.state.toLowerCase().includes(q);
    const matchGenre = selectedGenre === 'All' || s.genre === selectedGenre;
    const matchFav = showFavoritesOnly ? favorites.has(s.id) : true;
    return matchSearch && matchGenre && matchFav;
  });

  const visibleStations = filtered.slice(0, showMore);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <img src="https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 rounded-2xl animate-pulse" />
          <p className="text-white/40 text-sm">Loading Bugle Boy Radio...</p>
        </div>
      </div>
    );
  }

  // Admin Login Page
  if (showAdminLogin && !isAdminLoggedIn) {
    return (
      <AdminLogin
        isDark={isDark}
        onLogin={(success) => {
          if (success) {
            setIsAdminLoggedIn(true);
            setShowAdminLogin(false);
          }
        }}
        onBack={() => setShowAdminLogin(false)}
      />
    );
  }

  // Admin Dashboard
  if (isAdminLoggedIn) {
    return (
      <AdminDashboard
        isDark={isDark}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          sessionStorage.removeItem('adminAuth');
          sessionStorage.removeItem('adminLoginTime');
        }}
      />
    );
  }

  // Maintenance Screen (for regular users, admins can bypass)
  if (maintenanceMode && !isAdminLoggedIn) {
    return (
      <MaintenanceScreen
        message={maintenanceMessage}
        endTime={maintenanceEndTime}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* ANNOUNCEMENT BANNER */}
      {announcementEnabled && announcement && showAnnouncementBanner && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 text-center text-sm font-medium relative">
          <span>{announcement}</span>
          <button 
            onClick={() => setShowAnnouncementBanner(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black text-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${isDark ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Logo - click 5 times for admin */}
            <img 
              src="https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png" 
              alt="Logo" 
              className="w-10 h-10 rounded-xl shadow-lg flex-shrink-0 cursor-pointer"
              onClick={handleLogoClick}
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent leading-tight">Bugle Boy Radio</h1>
              <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stations.length} USA Stations 🇺🇸</p>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Chat Button */}
            <button
              onClick={openChat}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              title="Open chat"
            >
              💬
              {onlineCount > 0 && (
                <span className="absolute -top-1 -left-1 flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-green-500/20 border border-green-500/30">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] text-green-400 font-bold">{onlineCount}</span>
                </span>
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center px-1 animate-bounce shadow-lg shadow-red-500/40">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <UserMenu isDark={isDark} />
          </div>

          {/* Search */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="🔍 Search stations, genres, cities..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowMore(60); }}
              className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${isDark ? 'bg-gray-900 text-white placeholder-gray-600 border border-gray-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20' : 'bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'}`}
            />
          </div>
        </div>
      </header>

      {/* GENRE FILTERS */}
      <div className={`sticky top-[120px] z-30 border-b transition-colors ${isDark ? 'bg-gray-950/95 border-gray-800/50 backdrop-blur-xl' : 'bg-white/95 border-gray-200 backdrop-blur-xl'}`}>
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => {
                if (!user) { setShowAuthModal(true); return; }
                setShowFavoritesOnly(!showFavoritesOnly);
                setShowMore(60);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${showFavoritesOnly ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : isDark ? 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
            >
              ❤️ Favorites {favorites.size > 0 && `(${favorites.size})`}
            </button>

            {allGenres.map(g => {
              const cnt = g === 'All' ? stations.length : stations.filter(s => s.genre === g).length;
              return (
                <button
                  key={g}
                  onClick={() => { setSelectedGenre(g); setShowMore(60); setShowFavoritesOnly(false); }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${selectedGenre === g && !showFavoritesOnly ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25' : isDark ? 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
                >
                  {genreEmoji[g] || '🎵'} {g} ({cnt})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STATIONS GRID */}
      <main className={`max-w-7xl mx-auto px-4 py-4 ${playingStation ? 'pb-32' : 'pb-8'}`}>
        {showFavoritesOnly && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">❤️</p>
            <p className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No favorites yet</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Tap the heart on any station to save it</p>
            <button onClick={() => setShowFavoritesOnly(false)} className="mt-4 px-6 py-2.5 bg-amber-500 text-black rounded-full text-sm font-semibold hover:bg-amber-400 transition">
              Browse Stations
            </button>
          </div>
        )}

        {!showFavoritesOnly && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No stations found</p>
            <button onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }} className="mt-3 text-amber-500 text-sm font-medium hover:underline">
              Clear filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleStations.map(station => (
            <StationCard
              key={station.id}
              station={station}
              isActive={playingStation?.id === station.id}
              isPlaying={playingStation?.id === station.id && isPlaying}
              isLoading={playingStation?.id === station.id && isBuffering}
              isFavorite={isFavorite(station.id)}
              isDark={isDark}
              onPlay={playStation}
              onToggleFavorite={(id) => {
                if (!user) { setShowAuthModal(true); return; }
                toggleFavorite(id);
              }}
            />
          ))}
        </div>

        {visibleStations.length < filtered.length && (
          <div className="text-center py-6">
            <button
              onClick={() => setShowMore(p => p + 60)}
              className="px-8 py-3 bg-amber-500 text-black rounded-xl font-semibold text-sm hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              Load More ({filtered.length - visibleStations.length} remaining)
            </button>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="text-center pt-4">
            <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              Showing {Math.min(showMore, filtered.length)} of {filtered.length} stations
            </p>
          </div>
        )}
      </main>

      {/* PLAYER BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <PlayerBar
          station={playingStation}
          isPlaying={isPlaying}
          isLoading={isBuffering}
          volume={volume}
          isMuted={isMuted}
          isFavorite={playingStation ? isFavorite(playingStation.id) : false}
          isDark={isDark}
          onTogglePlay={togglePlay}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onToggleFavorite={() => {
            if (!user) { setShowAuthModal(true); return; }
            if (playingStation) toggleFavorite(playingStation.id);
          }}
        />
      </div>

      {/* CHAT ROOM */}
      <ChatRoom
        isOpen={isChatOpen}
        onClose={closeChat}
        isDark={isDark}
        currentStationName={playingStation?.name}
      />

      {/* AUTH MODAL */}
      <AuthModal />

      {/* FOOTER */}
      <Footer 
        isDark={isDark} 
        onShowPrivacy={() => setShowPrivacy(true)}
        onShowTerms={() => setShowTerms(true)}
      />

      {/* PRIVACY POLICY MODAL */}
      {showPrivacy && (
        <PrivacyPolicy isDark={isDark} onClose={() => setShowPrivacy(false)} />
      )}

      {/* TERMS OF SERVICE MODAL */}
      {showTerms && (
        <TermsOfService isDark={isDark} onClose={() => setShowTerms(false)} />
      )}
    </div>
  );
}

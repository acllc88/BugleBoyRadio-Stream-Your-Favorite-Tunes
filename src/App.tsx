import { useState, useMemo } from "react";
import { stations, genres } from "./data/stations";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useAuth } from "./contexts/AuthContext";
import { StationCard } from "./components/StationCard";
import { PlayerBar } from "./components/PlayerBar";
import { AuthModal } from "./components/AuthModal";
import { UserMenu } from "./components/UserMenu";
import { cn } from "./utils/cn";

const genreEmoji: Record<string, string> = {
  Classical: "🎻",
  Jazz: "🎷",
  Rock: "🎸",
  Country: "🤠",
  Pop: "🎤",
  News: "📰",
  Eclectic: "🌈",
  Electronic: "🎧",
  Ambient: "🌙",
  Lounge: "🍸",
  Blues: "🎵",
  World: "🌍",
  Indie: "💜",
  Folk: "🪕",
  Retro: "📻",
  Metal: "⚡",
  Soul: "❤️‍🔥",
  Chill: "🌿",
  Holiday: "🎄",
  Reggae: "🟢",
  Experimental: "🔮",
};

export function App() {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const {
    currentStation,
    isPlaying,
    isLoading,
    volume,
    isMuted,
    playStation,
    togglePlay,
    changeVolume,
    toggleMute,
  } = useAudioPlayer();

  const { user, favorites, toggleFavorite, isFavorite, setShowAuthModal, loading } = useAuth();

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      if (showFavorites && !favorites.has(station.id)) return false;
      const matchesGenre =
        selectedGenre === "All" || station.genre === selectedGenre;
      const matchesSearch =
        searchQuery === "" ||
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, searchQuery, showFavorites, favorites]);

  const handleToggleFavorite = (stationId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    toggleFavorite(stationId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <img
          src="https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png"
          alt="Bugle Boy Radio"
          className="w-20 h-20 rounded-2xl shadow-lg shadow-amber-500/15 animate-pulse object-contain"
        />
        <div className="flex items-center gap-2 text-white/40">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 20" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 pt-4 pb-3">
          {/* Brand + User */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img
                  src="https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png"
                  alt="Bugle Boy Radio"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-lg shadow-amber-500/10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  Bugle Boy Radio
                </h1>
                <p className="text-white/30 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5">
                  <span className="inline-block w-4 text-center">🇺🇸</span>
                  <span>{stations.length} USA Stations</span>
                  <span className="text-white/15">•</span>
                  <span>All Genres</span>
                  {user && favorites.size > 0 && (
                    <>
                      <span className="text-white/15">•</span>
                      <span className="text-red-400/60">
                        ❤️ {favorites.size} saved
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* User Menu / Sign In Button */}
            <UserMenu />
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by station, genre, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Genre filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
            {/* Favorites Button */}
            <button
              onClick={() => {
                if (!user) {
                  setShowAuthModal(true);
                  return;
                }
                setShowFavorites(!showFavorites);
                if (!showFavorites) setSelectedGenre("All");
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1",
                showFavorites
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/20"
                  : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08] hover:text-white/60 border border-white/[0.06]"
              )}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill={
                  showFavorites || favorites.size > 0
                    ? "currentColor"
                    : "none"
                }
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Favorites ({favorites.size})
            </button>

            {/* All Button */}
            <button
              onClick={() => {
                setSelectedGenre("All");
                setShowFavorites(false);
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200",
                selectedGenre === "All" && !showFavorites
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08] hover:text-white/60 border border-white/[0.06]"
              )}
            >
              🎵 All ({stations.length})
            </button>
            {genres.map((genre) => {
              const count = stations.filter((s) => s.genre === genre).length;
              return (
                <button
                  key={genre}
                  onClick={() => {
                    setSelectedGenre(genre);
                    setShowFavorites(false);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200",
                    selectedGenre === genre && !showFavorites
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                      : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08] hover:text-white/60 border border-white/[0.06]"
                  )}
                >
                  {genreEmoji[genre] || "🎵"} {genre} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Stations grid */}
      <main className="relative z-10 px-4 pt-5 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Results info */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/20 text-xs font-medium">
              {filteredStations.length} station
              {filteredStations.length !== 1 ? "s" : ""}
              {showFavorites && (
                <span>
                  {" "}
                  in <span className="text-red-400/60">Favorites</span>
                </span>
              )}
              {selectedGenre !== "All" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="text-white/40">{selectedGenre}</span>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  matching{" "}
                  <span className="text-white/40">"{searchQuery}"</span>
                </span>
              )}
            </p>
            {(selectedGenre !== "All" || searchQuery || showFavorites) && (
              <button
                onClick={() => {
                  setSelectedGenre("All");
                  setSearchQuery("");
                  setShowFavorites(false);
                }}
                className="text-amber-400/60 text-[11px] hover:text-amber-400 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredStations.length === 0 ? (
            <div className="text-center py-20">
              {showFavorites ? (
                <>
                  <div className="text-6xl mb-4">❤️</div>
                  <p className="text-white/40 text-lg font-medium">
                    No favorites yet
                  </p>
                  <p className="text-white/20 text-sm mt-1">
                    Tap the heart icon on any station to save it
                  </p>
                  <button
                    onClick={() => setShowFavorites(false)}
                    className="mt-5 px-5 py-2 bg-amber-500/15 text-amber-300 rounded-xl text-sm font-medium hover:bg-amber-500/25 transition-colors"
                  >
                    Browse all stations
                  </button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">📻</div>
                  <p className="text-white/40 text-lg font-medium">
                    No stations found
                  </p>
                  <p className="text-white/20 text-sm mt-1">
                    Try adjusting your search or genre filter
                  </p>
                  <button
                    onClick={() => {
                      setSelectedGenre("All");
                      setSearchQuery("");
                    }}
                    className="mt-5 px-5 py-2 bg-amber-500/15 text-amber-300 rounded-xl text-sm font-medium hover:bg-amber-500/25 transition-colors"
                  >
                    Show all stations
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredStations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  isActive={currentStation?.id === station.id}
                  isPlaying={
                    currentStation?.id === station.id && isPlaying
                  }
                  isLoading={
                    currentStation?.id === station.id && isLoading
                  }
                  isFavorite={isFavorite(station.id)}
                  onPlay={playStation}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Player Bar */}
      <PlayerBar
        station={currentStation}
        isPlaying={isPlaying}
        isLoading={isLoading}
        volume={volume}
        isMuted={isMuted}
        isFavorite={currentStation ? isFavorite(currentStation.id) : false}
        onTogglePlay={togglePlay}
        onVolumeChange={changeVolume}
        onToggleMute={toggleMute}
        onToggleFavorite={() => {
          if (currentStation) handleToggleFavorite(currentStation.id);
        }}
      />

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
}

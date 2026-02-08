import type { RadioStation } from "../data/stations";
import { cn } from "../utils/cn";

interface StationCardProps {
  station: RadioStation;
  isActive: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  isFavorite: boolean;
  onPlay: (station: RadioStation) => void;
  onToggleFavorite: (stationId: string) => void;
}

export function StationCard({
  station,
  isActive,
  isPlaying,
  isLoading,
  isFavorite,
  onPlay,
  onToggleFavorite,
}: StationCardProps) {
  return (
    <div
      className={cn(
        "group relative w-full text-left rounded-2xl transition-all duration-300 overflow-hidden",
        isActive
          ? "ring-2 ring-white/30 shadow-2xl scale-[1.01]"
          : "hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02]"
      )}
    >
      {/* Active gradient background */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0"
        )}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br", station.color)} />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Inactive background */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500 rounded-2xl",
          isActive ? "opacity-0" : "opacity-100",
          "bg-white/[0.04] border border-white/[0.08]",
          "group-hover:bg-white/[0.07] group-hover:border-white/[0.12]"
        )}
      />

      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(station.id);
        }}
        className={cn(
          "absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
          "hover:scale-125 active:scale-95",
          isFavorite
            ? "text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.6)]"
            : isActive
              ? "text-white/40 hover:text-red-300"
              : "text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100"
        )}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <button
        onClick={() => onPlay(station)}
        className="relative w-full text-left p-4 flex items-center gap-3.5 active:scale-[0.98] transition-transform"
      >
        {/* Station emoji badge */}
        <div
          className={cn(
            "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 relative",
            isActive
              ? "bg-white/20 shadow-lg backdrop-blur-sm"
              : cn("bg-gradient-to-br shadow-md", station.color)
          )}
        >
          {isActive && isLoading ? (
            <svg className="w-6 h-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 20" strokeLinecap="round" />
            </svg>
          ) : isActive && isPlaying ? (
            <div className="flex items-end gap-[3px] h-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[3px] bg-white rounded-full animate-eq"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          ) : (
            <span>{station.emoji}</span>
          )}

          {/* Live pulse ring around badge when playing */}
          {isActive && isPlaying && (
            <>
              <span className="absolute inset-0 rounded-xl border-2 border-green-400/50 animate-ping" />
              <span className="absolute -top-1 -right-1 flex items-center justify-center">
                <span className="absolute w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
                <span className="relative w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              </span>
            </>
          )}
        </div>

        {/* Station info */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                "font-bold text-sm truncate leading-tight",
                isActive ? "text-white" : "text-white/90 group-hover:text-white"
              )}
            >
              {station.name}
            </h3>
            {/* LIVE badge on card */}
            {isActive && isPlaying && (
              <span className="flex-shrink-0 flex items-center gap-1 bg-green-500/20 text-green-300 text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-wider border border-green-400/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400 shadow-[0_0_4px_rgba(74,222,128,1)]" />
                </span>
                LIVE
              </span>
            )}
            {isActive && isLoading && (
              <span className="flex-shrink-0 flex items-center gap-1 bg-amber-500/15 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                <svg className="w-2.5 h-2.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" />
                </svg>
                TUNING
              </span>
            )}
          </div>
          <p
            className={cn(
              "text-xs mt-1 truncate",
              isActive ? "text-white/70" : "text-white/40"
            )}
          >
            {station.description}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-white/[0.07] text-white/50 group-hover:bg-white/10"
              )}
            >
              {station.genre}
            </span>
            <span
              className={cn(
                "text-[10px] truncate flex items-center gap-1",
                isActive ? "text-white/60" : "text-white/30"
              )}
            >
              📍 {station.city}, {station.state}
            </span>
            {station.frequency !== "WEB" && (
              <span
                className={cn(
                  "text-[10px] font-mono",
                  isActive ? "text-white/50" : "text-white/25"
                )}
              >
                {station.frequency} FM
              </span>
            )}
          </div>
        </div>

        {/* Play / Active state */}
        <div className="flex-shrink-0">
          {isActive && isPlaying ? (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1.5" />
                <rect x="14" y="4" width="4" height="16" rx="1.5" />
              </svg>
            </div>
          ) : isActive && isLoading ? (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 20" strokeLinecap="round" />
              </svg>
            </div>
          ) : (
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-white/20"
                  : "bg-white/[0.05] group-hover:bg-white/10 group-hover:scale-110"
              )}
            >
              <svg
                className={cn(
                  "w-4 h-4 ml-0.5 transition-colors",
                  isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                )}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

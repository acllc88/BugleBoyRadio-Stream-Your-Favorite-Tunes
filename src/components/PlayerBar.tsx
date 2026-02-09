import type { RadioStation } from "../data/stations";
import { cn } from "../utils/cn";

interface PlayerBarProps {
  station: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  isFavorite: boolean;
  isDark: boolean;
  onTogglePlay: () => void;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
  onToggleFavorite: () => void;
}

function EqBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn("w-[4px] rounded-full transition-all", playing ? "bg-green-400 animate-eq" : "bg-white/30 h-1")}
          style={{ animationDelay: `${i * 0.12}s`, height: playing ? undefined : "4px" }}
        />
      ))}
    </div>
  );
}

export function PlayerBar({
  station, isPlaying, isLoading, volume, isMuted, isFavorite, isDark,
  onTogglePlay, onVolumeChange, onToggleMute, onToggleFavorite,
}: PlayerBarProps) {
  if (!station) {
    return (
      <div className="relative z-50">
        <div className={cn("backdrop-blur-2xl border-t", isDark ? "bg-gray-950/95 border-white/[0.06]" : "bg-white/95 border-gray-200")}>
          <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-center gap-3">
            <div className={cn("flex items-center gap-2", isDark ? "text-white/20" : "text-gray-400")}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="2" />
                <path d="M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49" />
                <path d="M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14" />
              </svg>
              <p className="text-sm font-medium">Select a station to start listening</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-50">
      <div className="relative h-[2px]">
        <div className={cn("absolute inset-0 bg-gradient-to-r", station.color)} />
        {isPlaying && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />}
      </div>

      {isPlaying && (
        <div className={cn("absolute -top-8 left-1/4 right-1/4 h-12 bg-gradient-to-r blur-2xl opacity-20 pointer-events-none", station.color)} />
      )}

      <div className={cn("backdrop-blur-2xl", isDark ? "bg-gray-950/95" : "bg-white/95 border-t border-gray-200")}>
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative flex-shrink-0">
              <div className={cn("w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-all duration-300", station.color, isPlaying && "shadow-xl")}>
                <span className="text-2xl sm:text-3xl">{station.emoji}</span>
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center">
                  <span className="absolute w-4 h-4 bg-green-400 rounded-full animate-ping opacity-40" />
                  <span className={cn("relative w-3 h-3 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)] border-2", isDark ? "border-gray-950" : "border-white")} />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <h4 className={cn("font-bold text-sm sm:text-base truncate", isDark ? "text-white" : "text-gray-900")}>{station.name}</h4>
                {isPlaying && (
                  <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5 bg-green-500/15 border border-green-400/25 text-green-400 text-[10px] font-black px-2.5 py-1 rounded-lg tracking-widest">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)]" />
                    </span>
                    LIVE
                  </div>
                )}
                {isLoading && (
                  <span className="flex-shrink-0 flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" /></svg>
                    TUNING
                  </span>
                )}
              </div>
              <p className={cn("text-xs sm:text-sm truncate mt-0.5", isDark ? "text-white/40" : "text-gray-500")}>
                {station.genre} • {station.city}, {station.state}
              </p>
              {isPlaying && (
                <div className="flex sm:hidden mt-1.5 items-center gap-1.5 bg-green-500/15 border border-green-400/25 text-green-400 text-[10px] font-black px-2 py-0.5 rounded-lg tracking-widest w-fit">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" /></span>
                  LIVE
                </div>
              )}
            </div>

            <div className="hidden md:block"><EqBars playing={isPlaying} /></div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={onToggleFavorite}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90",
                  isFavorite ? "text-red-400 bg-red-500/10" : isDark ? "text-white/30 hover:text-red-400 hover:bg-white/5" : "text-gray-400 hover:text-red-400 hover:bg-gray-100"
                )}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              <button
                onClick={onTogglePlay}
                disabled={isLoading}
                className={cn(
                  "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95",
                  isPlaying
                    ? isDark ? "bg-white text-gray-900 shadow-xl shadow-white/20" : "bg-gray-900 text-white shadow-xl"
                    : "bg-gradient-to-br text-white shadow-lg " + station.color,
                  isLoading && "opacity-70 cursor-wait"
                )}
              >
                {isLoading ? (
                  <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 20" strokeLinecap="round" /></svg>
                ) : isPlaying ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.5" /><rect x="14" y="4" width="4" height="16" rx="1.5" /></svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
                {isPlaying && (
                  <>
                    <span className={cn("absolute inset-0 rounded-full border-2 animate-ping", isDark ? "border-white/20" : "border-gray-900/20")} />
                    <span className={cn("absolute inset-[-4px] rounded-full border animate-[ping_2s_ease-in-out_infinite_0.5s]", isDark ? "border-white/10" : "border-gray-900/10")} />
                  </>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <button onClick={onToggleMute} className={cn("p-1 transition-colors", isDark ? "text-white/50 hover:text-white" : "text-gray-400 hover:text-gray-700")}>
                  {isMuted || volume === 0 ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                  ) : volume < 0.5 ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                  )}
                </button>
                <div className="relative w-24 h-6 flex items-center group">
                  <div className={cn("absolute w-full h-1.5 rounded-full overflow-hidden", isDark ? "bg-white/10" : "bg-gray-200")}>
                    <div className={cn("h-full rounded-full bg-gradient-to-r transition-all", station.color)} style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(e) => onVolumeChange(parseFloat(e.target.value))} className="absolute w-full h-6 opacity-0 cursor-pointer z-10" />
                  <div className={cn("absolute w-3.5 h-3.5 rounded-full shadow-md pointer-events-none transition-all group-hover:scale-125", isDark ? "bg-white shadow-black/30" : "bg-gray-700 shadow-gray-400/30")} style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 7px)` }} />
                </div>
                <span className={cn("text-[10px] font-mono w-7 text-right", isDark ? "text-white/30" : "text-gray-400")}>
                  {Math.round((isMuted ? 0 : volume) * 100)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

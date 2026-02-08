import { useState, useRef, useCallback, useEffect } from "react";
import type { RadioStation } from "../data/stations";

export function useAudioPlayer() {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolume = useRef(0.7);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    audio.addEventListener("playing", () => {
      setIsPlaying(true);
      setIsLoading(false);
    });

    audio.addEventListener("waiting", () => {
      setIsLoading(true);
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("error", () => {
      setIsLoading(false);
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const playStation = useCallback(
    (station: RadioStation) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentStation?.id === station.id && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      setIsLoading(true);
      setCurrentStation(station);
      audio.src = station.streamUrl;
      audio.volume = isMuted ? 0 : volume;
      audio.play().catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
      });
    },
    [currentStation, isPlaying, volume, isMuted]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;

    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      audio.src = currentStation.streamUrl;
      audio.volume = isMuted ? 0 : volume;
      audio.play().catch(() => {
        setIsLoading(false);
      });
    }
  }, [isPlaying, currentStation, volume, isMuted]);

  const changeVolume = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : newVolume;
      }
      if (isMuted && newVolume > 0) {
        setIsMuted(false);
        if (audioRef.current) {
          audioRef.current.volume = newVolume;
        }
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = previousVolume.current;
      setVolume(previousVolume.current);
      setIsMuted(false);
    } else {
      previousVolume.current = volume;
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  return {
    currentStation,
    isPlaying,
    isLoading,
    volume,
    isMuted,
    playStation,
    togglePlay,
    changeVolume,
    toggleMute,
  };
}

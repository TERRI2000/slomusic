import React, { createContext, useContext, useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export type Track = {
  id: string;
  title: string;
  artist: string;
  color: string;
};

type PlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  setTrack: (track: Track) => void;
  togglePlayPause: () => void;
  playNext: () => void;
};

// ── Default track (so mini-player is always visible in prototype) ─────────────

export const DEFAULT_TRACK: Track = {
  id: '1',
  title: 'Midnight Code',
  artist: 'MaxVibe',
  color: '#FA243C',
};

// ── Context ──────────────────────────────────────────────────────────────────

const PlayerContext = createContext<PlayerContextType>({
  currentTrack: DEFAULT_TRACK,
  isPlaying: false,
  setTrack: () => {},
  togglePlayPause: () => {},
  playNext: () => {},
});

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(DEFAULT_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);

  const setTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => setIsPlaying((prev) => !prev);

  const playNext = () => {
    // In prototype just toggle — real queue logic comes later
    setIsPlaying(true);
  };

  return (
    <PlayerContext.Provider
      value={{ currentTrack, isPlaying, setTrack, togglePlayPause, playNext }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);

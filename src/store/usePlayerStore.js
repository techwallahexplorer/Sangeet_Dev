import { create } from 'zustand';

// Load recently played from localStorage
const loadRecentlyPlayed = () => {
  try {
    const stored = localStorage.getItem('sangeet_recently_played');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

const saveRecentlyPlayed = (songs) => {
  try {
    localStorage.setItem('sangeet_recently_played', JSON.stringify(songs.slice(0, 50)));
  } catch {}
};

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off', // 'off' | 'all' | 'one'

  // New features
  showNowPlaying: false,
  showQueue: false,
  recentlyPlayed: loadRecentlyPlayed(),
  sleepTimer: null, // timestamp when music should stop
  sleepTimerInterval: null,

  playSong: (song, newQueue = null) => {
    const queue = newQueue || get().queue;
    const index = queue.findIndex(s => s.id === song.id);

    // Add to recently played
    const recent = get().recentlyPlayed.filter(s => s.id !== song.id);
    const updatedRecent = [song, ...recent].slice(0, 50);
    saveRecentlyPlayed(updatedRecent);

    set({
      currentSong: song,
      queue: newQueue ? newQueue : queue,
      queueIndex: index !== -1 ? index : get().queueIndex,
      isPlaying: true,
      progress: 0,
      recentlyPlayed: updatedRecent,
    });
  },

  togglePlay: () => {
    if (get().currentSong) {
      set({ isPlaying: !get().isPlaying });
    }
  },

  setVolume: (volume) => {
    set({ volume: Math.round(volume * 100) / 100 });
  },

  setProgress: (progress) => {
    set({ progress });
  },

  setDuration: (duration) => {
    set({ duration });
  },

  toggleShuffle: () => {
    set({ shuffle: !get().shuffle });
  },

  cycleRepeat: () => {
    const modes = ['off', 'all', 'one'];
    const current = modes.indexOf(get().repeat);
    set({ repeat: modes[(current + 1) % modes.length] });
  },

  next: () => {
    const { queue, queueIndex, shuffle, repeat } = get();
    if (queue.length === 0) return;

    if (repeat === 'one') {
      set({ progress: 0, isPlaying: true });
      return;
    }

    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
    }

    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        set({ isPlaying: false });
        return;
      }
    }

    const song = queue[nextIndex];
    const recent = get().recentlyPlayed.filter(s => s.id !== song.id);
    const updatedRecent = [song, ...recent].slice(0, 50);
    saveRecentlyPlayed(updatedRecent);

    set({
      currentSong: song,
      queueIndex: nextIndex,
      isPlaying: true,
      progress: 0,
      recentlyPlayed: updatedRecent,
    });
  },

  prev: () => {
    const { queue, queueIndex, progress } = get();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart current song
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    if (queueIndex > 0) {
      set({
        currentSong: queue[queueIndex - 1],
        queueIndex: queueIndex - 1,
        isPlaying: true,
        progress: 0,
      });
    }
  },

  // Queue panel
  toggleQueue: () => set({ showQueue: !get().showQueue }),
  
  removeFromQueue: (index) => {
    const { queue, queueIndex } = get();
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    set({
      queue: newQueue,
      queueIndex: index < queueIndex ? queueIndex - 1 : queueIndex,
    });
  },

  moveInQueue: (from, to) => {
    const { queue, queueIndex, currentSong } = get();
    const newQueue = [...queue];
    const [moved] = newQueue.splice(from, 1);
    newQueue.splice(to, 0, moved);
    const newIndex = newQueue.findIndex(s => s.id === currentSong?.id);
    set({ queue: newQueue, queueIndex: newIndex !== -1 ? newIndex : queueIndex });
  },

  // Now Playing fullscreen
  toggleNowPlaying: () => set({ showNowPlaying: !get().showNowPlaying }),

  // Sleep timer
  setSleepTimer: (minutes) => {
    // Clear any existing timer
    const existingInterval = get().sleepTimerInterval;
    if (existingInterval) clearInterval(existingInterval);

    if (!minutes) {
      set({ sleepTimer: null, sleepTimerInterval: null });
      return;
    }

    const endTime = Date.now() + minutes * 60 * 1000;
    const interval = setInterval(() => {
      if (Date.now() >= endTime) {
        get().clearSleepTimer();
        set({ isPlaying: false });
      }
    }, 1000);

    set({ sleepTimer: endTime, sleepTimerInterval: interval });
  },

  clearSleepTimer: () => {
    const interval = get().sleepTimerInterval;
    if (interval) clearInterval(interval);
    set({ sleepTimer: null, sleepTimerInterval: null });
  },

  clearRecentlyPlayed: () => {
    localStorage.removeItem('sangeet_recently_played');
    set({ recentlyPlayed: [] });
  },
}));

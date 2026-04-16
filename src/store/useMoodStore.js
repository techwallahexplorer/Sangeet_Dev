import { create } from 'zustand';

export const useMoodStore = create((set) => ({
  currentMood: 'chill',

  moods: [
    { id: 'happy', label: 'Happy Vibes', emoji: '☀️', desc: 'Upbeat, cheerful, energetic' },
    { id: 'chill', label: 'Chill & Relax', emoji: '🌊', desc: 'Lofi, acoustic, smooth' },
    { id: 'party', label: 'Party Mode', emoji: '🔥', desc: 'EDM, pop, high BPM' },
    { id: 'sad', label: 'Late Night', emoji: '🌙', desc: 'Melancholic, deep, slow' },
    { id: 'focus', label: 'Deep Focus', emoji: '🎯', desc: 'Ambient, instrumental, binaural' },
    { id: 'romantic', label: 'Romantic', emoji: '💜', desc: 'Soulful, R&B, slow jams' },
  ],

  // CSS gradient strings for inline styles (not Tailwind classes)
  moodGradients: {
    happy: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
    sad: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #1e1b4b 100%)',
    focus: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)',
    party: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6d28d9 100%)',
    chill: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #155e75 100%)',
    romantic: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #be123c 100%)',
  },

  // Tailwind gradient classes for components
  moodColors: {
    happy: 'from-amber-400 via-orange-500 to-rose-500',
    sad: 'from-blue-500 via-indigo-600 to-indigo-950',
    focus: 'from-emerald-500 via-green-600 to-green-900',
    party: 'from-pink-500 via-purple-500 to-violet-700',
    chill: 'from-cyan-500 via-teal-600 to-teal-900',
    romantic: 'from-purple-500 via-pink-500 to-rose-700',
  },

  setMood: (mood) => set({ currentMood: mood }),
}));

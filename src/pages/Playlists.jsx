import { Plus, ListMusic, Shuffle, Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/useMoodStore';

const presetPlaylists = [
  {
    id: 'weekly',
    title: 'Your Weekly\nDiscovery',
    subtitle: 'Based on your mood patterns',
    badge: 'Auto Mix',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
  },
  {
    id: 'focus',
    title: 'Deep Focus\nSession',
    subtitle: '2 hours of concentration',
    badge: 'AI Curated',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
  },
  {
    id: 'mood',
    title: 'Mood Ring\nPlaylist',
    subtitle: 'Adapts to your current vibe',
    badge: 'Dynamic',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #ef4444 100%)',
  },
];

export function Playlists() {
  const { currentMood, moodGradients } = useMoodStore();

  return (
    <div className="pb-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Playlists</h1>
          <p className="text-gray-500 text-sm mt-1">Your curated collections</p>
        </div>
        <button className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all border border-white/[0.08] hover:border-white/[0.15]">
          <Plus size={18} />
          New Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {presetPlaylists.map((playlist, idx) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="aspect-square rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
            style={{ background: playlist.gradient }}
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

            {/* Badge */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                {playlist.badge}
              </div>
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all backdrop-blur-md">
                <Play fill="white" size={18} className="ml-[2px] text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white leading-tight whitespace-pre-line">{playlist.title}</h3>
              <p className="text-white/60 text-xs mt-1.5">{playlist.subtitle}</p>
            </div>
          </motion.div>
        ))}

        {/* Create new playlist card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="aspect-square border-2 border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:border-white/[0.2] hover:text-gray-400 hover:bg-white/[0.02] transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-current flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Plus size={24} />
          </div>
          <p className="font-bold text-sm">Create Playlist</p>
          <p className="text-xs mt-1 text-gray-700">Start a new collection</p>
        </motion.div>
      </div>

      {/* Mood-based suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-5 rounded-2xl border border-white/[0.06] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: moodGradients[currentMood] }}
        />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">Auto-generate a playlist?</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Based on your <span className="text-primary-500 capitalize font-semibold">{currentMood}</span> mood, we can curate a perfect mix just for you.
            </p>
          </div>
          <button className="px-4 py-2 bg-white text-black font-bold text-sm rounded-full hover:scale-105 transition-transform flex-shrink-0">
            Generate
          </button>
        </div>
      </motion.div>
    </div>
  );
}

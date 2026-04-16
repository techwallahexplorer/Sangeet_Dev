import { useEffect, useState, useMemo } from 'react';
import { searchSongs } from '@/services/musicApi';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Play, TrendingUp, Sparkles, Clock, Radio, History } from 'lucide-react';
import { motion } from 'framer-motion';

// Skeleton card for loading state
function SongSkeleton() {
  return (
    <div className="min-w-[180px] p-4 rounded-2xl border border-white/[0.04]">
      <div className="w-full aspect-square rounded-xl skeleton mb-4" />
      <div className="h-4 w-3/4 skeleton mb-2" />
      <div className="h-3 w-1/2 skeleton" />
    </div>
  );
}

function QuickPlayCard({ song, songs, index }) {
  const { playSong, currentSong, isPlaying } = usePlayerStore();
  const isActive = currentSong?.id === song.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => playSong(song, songs)}
      className={`group relative flex items-center overflow-hidden rounded-xl transition-all cursor-pointer border ${
        isActive
          ? 'bg-white/[0.08] border-primary-500/30'
          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.04] hover:border-white/[0.08]'
      }`}
    >
      <div className="w-[72px] h-[72px] flex-shrink-0 relative">
        <img src={song.cover_url} className="w-full h-full object-cover" alt="" loading="lazy" />
        {isActive && isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="flex items-end gap-[2px]">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-primary-500 rounded-full"
                  animate={{ height: [4, 14, 4] }}
                  transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 px-3.5 py-2 min-w-0">
        <h3 className="font-bold text-white text-sm truncate">{song.title}</h3>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>
      {/* Hover play button */}
      <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
        <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <Play fill="black" size={16} className="ml-[2px] text-black" />
        </div>
      </div>
    </motion.div>
  );
}

function SongCard({ song, songs, index }) {
  const { playSong, currentSong, isPlaying } = usePlayerStore();
  const isActive = currentSong?.id === song.id;

  return (
    <div
      onClick={() => playSong(song, songs)}
      className="min-w-[170px] max-w-[200px] p-3.5 rounded-2xl transition-all cursor-pointer group border border-white/[0.04] hover:border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] snap-start"
    >
      <div className="relative mb-3 rounded-xl overflow-hidden shadow-xl">
        <img src={song.cover_url} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" alt="" loading="lazy" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-primary-500 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all shadow-xl shadow-primary-500/40">
            <Play fill="black" size={18} className="ml-[2px] text-black" />
          </div>
        </div>
        {isActive && isPlaying && (
          <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center">
            <div className="flex items-end gap-[2px]">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-black rounded-full"
                  animate={{ height: [3, 10, 3] }}
                  transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <h4 className="font-bold text-white text-[13px] truncate leading-tight">{song.title}</h4>
      <p className="text-[11px] text-gray-500 mt-1 truncate">{song.artist}</p>
    </div>
  );
}

export function Home() {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [freshSongs, setFreshSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuthStore();
  const recentlyPlayed = usePlayerStore(s => s.recentlyPlayed);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Fetch from JioSaavn API in parallel
        const [trending, fresh] = await Promise.all([
          searchSongs('trending bollywood hits', 12),
          searchSongs('latest new songs 2025', 12),
        ]);
        setTrendingSongs(trending);
        setFreshSongs(fresh);
      } catch (err) {
        console.error('Failed to fetch songs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const allSongs = [...trendingSongs, ...freshSongs];

  return (
    <div className="flex flex-col gap-10 pb-8">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {greeting}{profile?.username ? `, ${profile.username}` : ''}
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">Here's what matches your vibe right now.</p>
      </motion.div>

      {/* Quick play grid — top 6 trending */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <Radio size={16} className="text-primary-500" />
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Quick Play</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {loading
            ? Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[72px] rounded-xl skeleton" />
            ))
            : trendingSongs.slice(0, 6).map((song, i) => (
              <QuickPlayCard key={song.id} song={song} songs={allSongs} index={i} />
            ))
          }
        </div>
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center gap-2.5 mb-5">
          <TrendingUp size={18} className="text-primary-500" />
          <h2 className="text-lg font-bold text-white">Trending Now</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {loading
            ? Array(6).fill(0).map((_, i) => <SongSkeleton key={i} />)
            : trendingSongs.map((song, i) => (
              <SongCard key={song.id} song={song} songs={allSongs} index={i} />
            ))
          }
        </div>
      </section>

      {/* Fresh Drops */}
      {freshSongs.length > 0 && (
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Sparkles size={18} className="text-accent-500" />
            <h2 className="text-lg font-bold text-white">Fresh Drops</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {freshSongs.map((song, i) => (
              <SongCard key={song.id} song={song} songs={allSongs} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <History size={18} className="text-gray-400" />
            <h2 className="text-lg font-bold text-white">Recently Played</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {recentlyPlayed.slice(0, 12).map((song, i) => (
              <SongCard key={`recent-${song.id}`} song={song} songs={recentlyPlayed} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

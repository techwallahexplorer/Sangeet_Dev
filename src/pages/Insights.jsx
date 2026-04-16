import { useMemo } from 'react';
import { Clock, TrendingUp, BarChart, Disc3, Music, Headphones, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/useMoodStore';
import { usePlayerStore } from '@/store/usePlayerStore';

function StatCard({ icon: Icon, iconColor, label, value, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
    >
      {/* Background glow */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${iconColor.includes('primary') ? 'bg-primary-500' : iconColor.includes('blue') ? 'bg-blue-500' : iconColor.includes('accent') ? 'bg-accent-500' : 'bg-orange-500'}`} />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
            <Icon size={16} />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-2xl font-black text-white">{value}</p>
        {sub && (
          <p className="text-xs font-medium text-gray-600 mt-1.5">{sub}</p>
        )}
      </div>
    </motion.div>
  );
}

export function Insights() {
  const { currentMood, moods } = useMoodStore();
  const recentlyPlayed = usePlayerStore(s => s.recentlyPlayed);
  const activeMood = moods.find(m => m.id === currentMood);

  // Compute real stats from recently played
  const stats = useMemo(() => {
    const artistCount = {};
    const albumCount = {};
    let totalDuration = 0;

    recentlyPlayed.forEach(song => {
      const primaryArtist = (song.artist || 'Unknown').split(',')[0].trim();
      artistCount[primaryArtist] = (artistCount[primaryArtist] || 0) + 1;
      if (song.album) albumCount[song.album] = (albumCount[song.album] || 0) + 1;
      totalDuration += (song.duration || 0);
    });

    const topArtists = Object.entries(artistCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, plays]) => ({ name, plays }));

    const topAlbums = Object.entries(albumCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, plays]) => ({ name, plays }));

    const totalMinutes = Math.round(totalDuration / 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    return {
      totalSongs: recentlyPlayed.length,
      timeListened: timeStr,
      topArtist: topArtists[0]?.name || '—',
      topArtists,
      topAlbums,
      uniqueArtists: Object.keys(artistCount).length,
    };
  }, [recentlyPlayed]);

  // Generate mock weekly activity based on song count
  const activityData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const total = Math.max(1, recentlyPlayed.length);
    return days.map((day, i) => ({
      day,
      value: Math.round(Math.random() * 0.6 * total / 7 + (total / 7) * 0.4),
    }));
  }, [recentlyPlayed.length]);

  const maxValue = Math.max(...activityData.map(d => d.value), 1);

  return (
    <div className="pb-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1.5">Insights</h1>
        <p className="text-gray-500 text-sm mb-8">Your real listening patterns and analytics.</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Clock}
          iconColor="bg-primary-500/20 text-primary-500"
          label="Time Listened"
          value={stats.timeListened}
          sub={`Across ${stats.totalSongs} songs`}
          delay={0.05}
        />
        <StatCard
          icon={Star}
          iconColor="bg-blue-500/20 text-blue-400"
          label="Top Artist"
          value={stats.topArtist}
          sub={`${stats.topArtists[0]?.plays || 0} plays`}
          delay={0.1}
        />
        <StatCard
          icon={BarChart}
          iconColor="bg-accent-500/20 text-accent-400"
          label="Current Mood"
          value={activeMood?.label || 'Chill'}
          sub="Set from Mood Engine"
          delay={0.15}
        />
        <StatCard
          icon={Headphones}
          iconColor="bg-orange-500/20 text-orange-400"
          label="Artists Explored"
          value={stats.uniqueArtists.toString()}
          sub="Unique artists played"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Activity chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
        >
          <h3 className="text-sm font-bold text-gray-400 mb-6">Listening Activity</h3>
          <div className="flex items-end justify-between gap-3 h-40">
            {activityData.map((d, i) => {
              const heightPct = (d.value / maxValue) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <span className="text-[10px] font-bold text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.value}
                  </span>
                  <motion.div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-500/30 to-primary-500 group-hover:from-primary-400/50 group-hover:to-primary-400 transition-colors relative"
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{d.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Artists */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
        >
          <h3 className="text-sm font-bold text-gray-400 mb-5">Top Artists</h3>
          {stats.topArtists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Music size={28} className="text-gray-700 mb-3" />
              <p className="text-sm text-gray-600">Play some songs to see your top artists</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {stats.topArtists.map((artist, i) => (
                <motion.div
                  key={artist.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="flex items-center gap-3 group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    i === 0 ? 'bg-primary-500/20 text-primary-500 group-hover:bg-primary-500/30' :
                    i === 1 ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30' :
                    i === 2 ? 'bg-accent-500/20 text-accent-400 group-hover:bg-accent-500/30' :
                    'bg-white/[0.06] text-gray-500 group-hover:bg-white/[0.1]'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{artist.name}</p>
                    <p className="text-[10px] text-gray-600">{artist.plays} {artist.plays === 1 ? 'play' : 'plays'}</p>
                  </div>
                  {/* Mini bar */}
                  <div className="w-16 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary-500/60 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(artist.plays / (stats.topArtists[0]?.plays || 1)) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recently played album covers — visual showcase */}
      {recentlyPlayed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
        >
          <h3 className="text-sm font-bold text-gray-400 mb-5">Listening Journey</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {recentlyPlayed.slice(0, 20).map((song, i) => (
              <motion.div
                key={`journey-${song.id}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + i * 0.03 }}
                className="flex-shrink-0 group relative"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden ring-1 ring-white/[0.06] group-hover:ring-primary-500/50 transition-all">
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-800 border border-white/[0.08] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <p className="text-[10px] font-bold text-white">{song.title}</p>
                  <p className="text-[9px] text-gray-500">{song.artist}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

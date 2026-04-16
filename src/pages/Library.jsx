import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { searchSongs } from '@/services/musicApi';
import { Play, Pause, Clock, Music, Hash, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export function Library() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong, currentSong, isPlaying, togglePlay, queue } = usePlayerStore();

  useEffect(() => {
    const fetchLibrary = async () => {
      // If user has a queue (already played songs), show that
      if (queue.length > 0) {
        setSongs(queue);
        setLoading(false);
        return;
      }

      // Otherwise fetch a default library from the API
      try {
        const results = await searchSongs('bollywood top songs', 30);
        setSongs(results);
      } catch (err) {
        console.error('Library fetch failed:', err);
      }
      setLoading(false);
    };
    fetchLibrary();
  }, [queue]);

  const formatDuration = (secs) => {
    if (!secs) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownload = (e, song) => {
    e.stopPropagation();
    if (!song.audio_url) return;
    const a = document.createElement('a');
    a.href = song.audio_url;
    a.download = `${song.title} - ${song.artist}.mp4`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="pb-8">
      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Your Library</h1>
      <p className="text-gray-500 text-sm mb-8">
        {queue.length > 0 ? `${songs.length} tracks in your current queue` : `${songs.length} tracks to explore`}
      </p>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[40px_1.5fr_1fr_80px_40px] gap-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/[0.04] mb-2">
        <span className="text-center"><Hash size={14} /></span>
        <span>Title</span>
        <span>Album</span>
        <span className="text-right"><Clock size={14} className="ml-auto" /></span>
        <span />
      </div>

      {/* Song list */}
      <div className="flex flex-col">
        {loading
          ? Array(8).fill(0).map((_, i) => (
            <div key={i} className="grid grid-cols-[40px_1.5fr_1fr_80px] gap-4 px-4 py-3 items-center">
              <div className="w-6 h-4 skeleton mx-auto" />
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded skeleton" />
                <div>
                  <div className="h-3.5 w-28 skeleton mb-1.5" />
                  <div className="h-3 w-20 skeleton" />
                </div>
              </div>
              <div className="h-3 w-16 skeleton" />
              <div className="h-3 w-10 skeleton ml-auto" />
            </div>
          ))
          : songs.map((song, i) => {
            const isActive = currentSong?.id === song.id;
            return (
              <motion.div
                key={`${song.id}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => {
                  if (isActive) {
                    togglePlay();
                  } else {
                    playSong(song, songs);
                  }
                }}
                className={`grid grid-cols-[40px_1fr] md:grid-cols-[40px_1.5fr_1fr_80px_40px] gap-4 px-4 py-2.5 items-center rounded-lg cursor-pointer transition-all group ${
                  isActive
                    ? 'bg-white/[0.06]'
                    : 'hover:bg-white/[0.03]'
                }`}
              >
                {/* Number / Play icon */}
                <div className="flex items-center justify-center">
                  {isActive && isPlaying ? (
                    <div className="flex items-end gap-[2px]">
                      {[0, 1, 2].map(j => (
                        <motion.div
                          key={j}
                          className="w-[2px] bg-primary-500 rounded-full"
                          animate={{ height: [3, 10, 3] }}
                          transition={{ duration: 0.5, delay: j * 0.12, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <span className="text-sm text-gray-600 font-mono group-hover:hidden block">{i + 1}</span>
                      <Play size={14} fill="white" className="text-white hidden group-hover:block" />
                    </>
                  )}
                </div>

                {/* Song info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden">
                    <img src={song.cover_url} className="w-full h-full object-cover" alt="" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-primary-500' : 'text-white'}`}>{song.title}</h4>
                    <span className="text-xs text-gray-500 truncate block">{song.artist}</span>
                  </div>
                </div>

                {/* Album — desktop only */}
                <div className="hidden md:block text-xs text-gray-500 truncate">
                  {song.album || '—'}
                </div>

                {/* Duration */}
                <div className="hidden md:block text-xs text-gray-600 font-mono text-right">
                  {formatDuration(song.duration)}
                </div>

                {/* Download */}
                <div className="hidden md:flex justify-center">
                  <button
                    onClick={(e) => handleDownload(e, song)}
                    className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })
        }
      </div>

      {!loading && songs.length === 0 && (
        <div className="text-center py-20">
          <Music size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-gray-500 text-lg font-medium">Your library is empty</p>
          <p className="text-gray-600 text-sm mt-1">Start playing songs to build your queue</p>
        </div>
      )}
    </div>
  );
}

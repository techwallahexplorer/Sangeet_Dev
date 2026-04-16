import { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { searchSongs } from '@/services/musicApi';
import { X, Play, User, Disc3, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ArtistSpotlight() {
  const currentSong = usePlayerStore(s => s.currentSong);
  const playSong = usePlayerStore(s => s.playSong);
  const [show, setShow] = useState(false);
  const [artistSongs, setArtistSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchArtistSongs = async () => {
    if (!currentSong?.artist) return;
    setLoading(true);
    setShow(true);
    // Get the primary artist name (before comma)
    const artistName = currentSong.artist.split(',')[0].trim();
    const songs = await searchSongs(artistName, 15);
    setArtistSongs(songs.filter(s => s.id !== currentSong.id));
    setLoading(false);
  };

  useEffect(() => {
    setShow(false);
  }, [currentSong?.id]);

  if (!currentSong) return null;

  const primaryArtist = currentSong.artist.split(',')[0].trim();

  return (
    <>
      {/* Trigger button — shown in Now Playing or as standalone */}
      <button
        onClick={fetchArtistSongs}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all"
      >
        <User size={12} />
        More by {primaryArtist}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-[480px] sm:max-h-[70vh] bg-dark-800/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl z-[96] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                    <User size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{primaryArtist}</h3>
                    <p className="text-xs text-gray-500">{artistSongs.length} tracks found</p>
                  </div>
                </div>
                <button
                  onClick={() => setShow(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>

              {/* Song list */}
              <div className="flex-1 overflow-y-auto py-2 px-3 hide-scrollbar">
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5">
                      <div className="w-10 h-10 rounded-lg skeleton" />
                      <div className="flex-1">
                        <div className="h-3.5 w-32 skeleton mb-1.5" />
                        <div className="h-3 w-24 skeleton" />
                      </div>
                    </div>
                  ))
                ) : (
                  artistSongs.map((song, i) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => { playSong(song, artistSongs); setShow(false); }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] cursor-pointer group transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img src={song.cover_url} className="w-full h-full object-cover" alt="" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                          <Play size={14} fill="white" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{song.title}</h4>
                        <p className="text-[11px] text-gray-600 truncate">{song.album || song.artist}</p>
                      </div>
                      <span className="text-[11px] text-gray-700 font-mono tabular-nums">
                        {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : ''}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

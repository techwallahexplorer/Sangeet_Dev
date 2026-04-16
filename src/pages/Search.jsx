import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { searchSongs } from '@/services/musicApi';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Search as SearchIcon, Play, X, Music, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const popularSearches = ['Arijit Singh', 'A.R. Rahman', 'Pritam', 'Diljit Dosanjh', 'Shreya Ghoshal', 'Atif Aslam', 'Lata Mangeshkar', 'KK'];

export function Search() {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { playSong, currentSong, isPlaying } = usePlayerStore();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search — auto-search after 400ms of typing
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSongs([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    const results = await searchSongs(searchQuery, 30);
    setSongs(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, performSearch]);

  const handleQuickSearch = (term) => {
    setQuery(term);
  };

  const handleDownload = async (e, song) => {
    e.stopPropagation();
    if (!song.audio_url) return;
    try {
      const a = document.createElement('a');
      a.href = song.audio_url;
      a.download = `${song.title} - ${song.artist}.mp4`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-6">Search</h1>

      {/* Search Input */}
      <div className="relative mb-6 max-w-2xl">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search songs, artists..."
          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.06] transition-all placeholder:text-gray-600"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Popular quick searches — shown when no query */}
      {!hasSearched && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Popular Artists</h3>
          <div className="flex gap-2 flex-wrap">
            {popularSearches.map(term => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="px-4 py-2 rounded-full text-xs font-bold bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary-500" />
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && (
        <>
          <p className="text-xs text-gray-500 mb-4">
            {songs.length} result{songs.length !== 1 ? 's' : ''} for "<span className="text-white">{query}</span>"
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {songs.map((song, idx) => {
                const isActive = currentSong?.id === song.id;
                return (
                  <motion.div
                    key={song.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                    onClick={() => playSong(song, songs)}
                    className={`rounded-2xl p-3.5 transition-all cursor-pointer group border ${
                      isActive
                        ? 'bg-white/[0.06] border-primary-500/30'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.04] hover:border-white/[0.08]'
                    }`}
                  >
                    <div className="relative mb-3 overflow-hidden rounded-xl">
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
                      {/* Download button */}
                      <button
                        onClick={(e) => handleDownload(e, song)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
                        title="Download"
                      >
                        <Download size={12} className="text-white" />
                      </button>
                    </div>
                    <h4 className="font-bold text-white text-[13px] truncate">{song.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">{song.artist}</p>
                    {song.album && song.album !== song.title && (
                      <p className="text-[10px] text-gray-600 mt-0.5 truncate">{song.album}</p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {songs.length === 0 && (
            <div className="text-center py-20">
              <Music size={48} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-500 text-lg font-medium">No results found</p>
              <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

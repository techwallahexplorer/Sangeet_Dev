import { usePlayerStore } from '@/store/usePlayerStore';
import { X, Play, Trash2, GripVertical, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function QueuePanel() {
  const {
    queue, queueIndex, currentSong, showQueue, toggleQueue,
    playSong, removeFromQueue, isPlaying,
  } = usePlayerStore();

  const upNext = queue.slice(queueIndex + 1);
  const played = queue.slice(0, queueIndex);

  return (
    <AnimatePresence>
      {showQueue && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleQueue}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[400px] bg-dark-900/95 backdrop-blur-2xl border-l border-white/[0.06] z-[91] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-base font-bold text-white">Queue</h2>
              <button
                onClick={toggleQueue}
                className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 hide-scrollbar">
              {/* Now Playing */}
              {currentSong && (
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5 px-2">Now Playing</p>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.05] border border-primary-500/20">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img src={currentSong.cover_url} className="w-full h-full object-cover" alt="" />
                      {isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="flex items-end gap-[2px]">
                            {[0, 1, 2].map(i => (
                              <motion.div
                                key={i}
                                className="w-[2px] bg-primary-500 rounded-full"
                                animate={{ height: [3, 10, 3] }}
                                transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-primary-500 truncate">{currentSong.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{currentSong.artist}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Up Next */}
              {upNext.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5 px-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Up Next · {upNext.length}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {upNext.map((song, i) => (
                      <motion.div
                        key={`${song.id}-next-${i}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] group cursor-pointer transition-colors"
                        onClick={() => playSong(song, queue)}
                      >
                        <div className="w-4 flex-shrink-0 flex items-center justify-center">
                          <GripVertical size={12} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={song.cover_url} className="w-full h-full object-cover" alt="" loading="lazy" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-white truncate">{song.title}</h4>
                          <p className="text-[11px] text-gray-600 truncate">{song.artist}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromQueue(queueIndex + 1 + i); }}
                          className="text-gray-700 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previously Played */}
              {played.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5 px-2">
                    Previously Played · {played.length}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {played.map((song, i) => (
                      <div
                        key={`${song.id}-prev-${i}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] group cursor-pointer transition-colors opacity-60 hover:opacity-100"
                        onClick={() => playSong(song, queue)}
                      >
                        <div className="w-4 flex-shrink-0" />
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={song.cover_url} className="w-full h-full object-cover" alt="" loading="lazy" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-white truncate">{song.title}</h4>
                          <p className="text-[11px] text-gray-600 truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {queue.length === 0 && (
                <div className="text-center py-16">
                  <Music size={40} className="mx-auto mb-3 text-gray-800" />
                  <p className="text-gray-600 text-sm font-medium">Queue is empty</p>
                  <p className="text-gray-700 text-xs mt-1">Play a song to get started</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

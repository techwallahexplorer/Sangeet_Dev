import { useEffect, useState, useRef } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { getLyrics } from '@/services/musicApi';
import { ArtistSpotlight } from '@/components/ArtistSpotlight';
import { ShareCard } from '@/components/ShareCard';
import { X, ChevronDown, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Heart, ListMusic, Download, Timer, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NowPlaying() {
  const {
    currentSong, isPlaying, progress, duration, shuffle, repeat,
    togglePlay, next, prev, toggleShuffle, cycleRepeat,
    showNowPlaying, toggleNowPlaying, toggleQueue,
    setProgress, sleepTimer, setSleepTimer, clearSleepTimer,
  } = usePlayerStore();

  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState('');
  const lyricsContainerRef = useRef(null);

  // Fetch lyrics when song changes
  useEffect(() => {
    if (!currentSong?.id || currentSong.source !== 'jiosaavn') {
      setLyrics(null);
      return;
    }
    if (!currentSong.has_lyrics) {
      setLyrics(null);
      return;
    }

    setLyricsLoading(true);
    getLyrics(currentSong.id).then(data => {
      setLyrics(data);
      setLyricsLoading(false);
    });
  }, [currentSong?.id]);

  // Update sleep timer display
  useEffect(() => {
    if (!sleepTimer) { setTimerRemaining(''); return; }
    const tick = setInterval(() => {
      const remaining = Math.max(0, sleepTimer - Date.now());
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setTimerRemaining(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(tick);
  }, [sleepTimer]);

  const formatTime = (t) => {
    if (isNaN(t) || !isFinite(t)) return '0:00';
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
  };

  const progressPct = duration ? (progress / duration) * 100 : 0;

  const handleDownload = () => {
    if (!currentSong?.audio_url) return;
    const a = document.createElement('a');
    a.href = currentSong.audio_url;
    a.download = `${currentSong.title} - ${currentSong.artist}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sleepOptions = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
  ];

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      {showNowPlaying && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[100] flex flex-col"
        >
          {/* Blurred album art background */}
          <div className="absolute inset-0">
            <img
              src={currentSong.cover_url}
              alt=""
              className="w-full h-full object-cover scale-125 blur-[80px] opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-dark-900/80 to-dark-900" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <button
                onClick={toggleNowPlaying}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronDown size={20} className="text-white" />
              </button>
              <div className="text-center">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Now Playing</p>
              </div>
              <button
                onClick={() => { toggleNowPlaying(); toggleQueue(); }}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ListMusic size={18} className="text-white" />
              </button>
            </div>

            {/* Main content - scrollable */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pb-6">
              {/* Album art */}
              <motion.div
                key={currentSong.id}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/50 mb-8 mt-4"
              >
                <motion.img
                  src={currentSong.cover_url}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                  animate={isPlaying ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              {/* Song info */}
              <div className="w-full max-w-[380px] text-center mb-6">
                <motion.h2
                  key={currentSong.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl sm:text-2xl font-black text-white truncate"
                >
                  {currentSong.title}
                </motion.h2>
                <p className="text-sm text-gray-400 mt-1 truncate">{currentSong.artist}</p>
                {currentSong.album && currentSong.album !== currentSong.title && (
                  <p className="text-xs text-gray-600 mt-0.5">{currentSong.album}</p>
                )}
              </div>

              {/* Action buttons row */}
              <div className="flex items-center gap-6 mb-6">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`transition-colors ${liked ? 'text-primary-500' : 'text-gray-500 hover:text-white'}`}
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button onClick={handleDownload} className="text-gray-500 hover:text-white transition-colors" title="Download">
                  <Download size={20} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowSleepMenu(!showSleepMenu)}
                    className={`transition-colors relative ${sleepTimer ? 'text-primary-500' : 'text-gray-500 hover:text-white'}`}
                    title="Sleep Timer"
                  >
                    <Timer size={20} />
                    {timerRemaining && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary-500 whitespace-nowrap font-mono">
                        {timerRemaining}
                      </span>
                    )}
                  </button>

                  {/* Sleep timer menu */}
                  <AnimatePresence>
                    {showSleepMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 8 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-dark-800 border border-white/[0.08] rounded-xl p-2 min-w-[140px] shadow-2xl z-50"
                      >
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 pb-1.5 mb-1 border-b border-white/[0.06]">
                          Sleep Timer
                        </p>
                        {sleepTimer && (
                          <button
                            onClick={() => { clearSleepTimer(); setShowSleepMenu(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-white/[0.04] rounded-lg transition-colors"
                          >
                            Cancel Timer
                          </button>
                        )}
                        {sleepOptions.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => { setSleepTimer(opt.value); setShowSleepMenu(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Artist & Share buttons */}
              <div className="flex items-center gap-3 mb-6">
                <ArtistSpotlight />
                <ShareCard />
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-[380px] mb-4">
                <div className="w-full h-1.5 bg-white/[0.1] rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-white rounded-full transition-[width] duration-200"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[11px] text-gray-500 font-mono">{formatTime(progress)}</span>
                  <span className="text-[11px] text-gray-500 font-mono">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-8 mb-8">
                <button
                  onClick={toggleShuffle}
                  className={`transition-colors ${shuffle ? 'text-primary-500' : 'text-gray-500 hover:text-white'}`}
                >
                  <Shuffle size={20} />
                </button>
                <button onClick={prev} className="text-white hover:scale-110 transition-transform">
                  <SkipBack size={28} fill="currentColor" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
                </button>
                <button onClick={next} className="text-white hover:scale-110 transition-transform">
                  <SkipForward size={28} fill="currentColor" />
                </button>
                <button
                  onClick={cycleRepeat}
                  className={`transition-colors ${repeat !== 'off' ? 'text-primary-500' : 'text-gray-500 hover:text-white'}`}
                >
                  {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
                </button>
              </div>

              {/* Lyrics */}
              {currentSong.has_lyrics && (
                <div className="w-full max-w-[480px]" ref={lyricsContainerRef}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Lyrics</h3>
                  {lyricsLoading ? (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <div className="h-3 w-48 skeleton" />
                      <div className="h-3 w-36 skeleton" />
                      <div className="h-3 w-52 skeleton" />
                    </div>
                  ) : lyrics ? (
                    <div className="text-center space-y-3 pb-8">
                      {lyrics.lines.map((line, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-base text-white/70 leading-relaxed font-medium hover:text-white transition-colors"
                        >
                          {line}
                        </motion.p>
                      ))}
                      {lyrics.copyright && (
                        <p className="text-[10px] text-gray-700 mt-6 pt-4 border-t border-white/[0.04]">
                          {lyrics.copyright}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 text-sm py-8">Lyrics not available for this track</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

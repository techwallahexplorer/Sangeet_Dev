import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, Heart, ListMusic, Maximize2 } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { motion, AnimatePresence } from 'framer-motion';

export function PlayerBar() {
  const {
    currentSong, isPlaying, volume, progress, duration,
    togglePlay, setProgress, next, prev, setDuration,
    shuffle, repeat, toggleShuffle, cycleRepeat, setVolume,
    toggleQueue, toggleNowPlaying
  } = usePlayerStore();

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && !isSeeking) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  }, [isSeeking, setProgress, setDuration]);

  const handleProgressClick = (e) => {
    if (!progressRef.current || !audioRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const time = pct * duration;
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  // Seek from NowPlaying progress bar
  useEffect(() => {
    const handleSeek = () => {
      if (audioRef.current && Math.abs(audioRef.current.currentTime - progress) > 1.5) {
        audioRef.current.currentTime = progress;
      }
    };
    handleSeek();
  }, []);

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPct = duration ? (progress / duration) * 100 : 0;

  return (
    <>
      {/* Desktop player — hidden on mobile */}
      <div className="fixed bottom-0 left-0 right-0 h-20 z-40 hidden lg:flex">
        {/* Glass background */}
        <div className="absolute inset-0 bg-dark-900/95 backdrop-blur-3xl border-t border-white/[0.06]" />

        <div className="relative z-10 w-full flex items-center px-4 gap-4">
          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={currentSong?.audio_url}
            crossOrigin="anonymous"
            onTimeUpdate={handleTimeUpdate}
            onEnded={next}
          />

          {/* Track Info — Left */}
          <div className="w-[280px] flex items-center gap-3.5 flex-shrink-0">
            <AnimatePresence mode="wait">
              {currentSong ? (
                <motion.div
                  key={currentSong.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3.5 flex-1 min-w-0"
                >
                  <div
                    onClick={toggleNowPlaying}
                    className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg relative group cursor-pointer"
                  >
                    <img
                      src={currentSong.cover_url}
                      alt={currentSong.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Maximize2 size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={toggleNowPlaying}
                      className="font-bold text-white text-sm truncate cursor-pointer hover:underline"
                    >
                      {currentSong.title}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
                  </div>
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex-shrink-0 transition-colors ${liked ? 'text-primary-500' : 'text-gray-500 hover:text-white'}`}
                  >
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                  </button>
                </motion.div>
              ) : (
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-lg skeleton" />
                  <div className="flex-1 min-w-0">
                    <div className="h-3.5 w-28 skeleton mb-2" />
                    <div className="h-3 w-20 skeleton" />
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls — Center */}
          <div className="flex-1 flex flex-col items-center justify-center gap-1.5 max-w-[600px] mx-auto">
            {/* Buttons */}
            <div className="flex items-center gap-5">
              <button
                onClick={toggleShuffle}
                className={`transition-colors ${shuffle ? 'text-primary-500' : 'text-gray-500 hover:text-white'}`}
                title="Shuffle"
              >
                <Shuffle size={16} />
              </button>

              <button onClick={prev} className="text-gray-400 hover:text-white transition-colors" title="Previous">
                <SkipBack size={18} fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-[2px]" />}
              </button>

              <button onClick={next} className="text-gray-400 hover:text-white transition-colors" title="Next">
                <SkipForward size={18} fill="currentColor" />
              </button>

              <button
                onClick={cycleRepeat}
                className={`transition-colors ${repeat !== 'off' ? 'text-primary-500' : 'text-gray-500 hover:text-white'}`}
                title={`Repeat: ${repeat}`}
              >
                {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full flex items-center gap-2.5">
              <span className="text-[11px] text-gray-500 font-mono w-10 text-right tabular-nums">{formatTime(progress)}</span>
              <div
                ref={progressRef}
                onClick={handleProgressClick}
                className="flex-1 h-1 bg-white/[0.08] rounded-full cursor-pointer group relative"
              >
                <div
                  className="h-full bg-white rounded-full relative transition-[width] duration-75"
                  style={{ width: `${progressPct}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-[11px] text-gray-500 font-mono w-10 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Extra Controls — Right */}
          <div className="w-[280px] flex items-center justify-end gap-3 flex-shrink-0">
            <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} />

            {/* Queue button */}
            <button
              onClick={toggleQueue}
              className="text-gray-500 hover:text-white transition-colors"
              title="Queue"
            >
              <ListMusic size={16} />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile player — shown above mobile nav */}
      <div className="fixed bottom-[52px] left-0 right-0 z-40 lg:hidden">
        {currentSong && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="mx-2 mb-1"
          >
            <div
              onClick={toggleNowPlaying}
              className="bg-dark-800/95 backdrop-blur-2xl border border-white/[0.06] rounded-xl p-2 flex items-center gap-3 shadow-2xl cursor-pointer"
            >
              <audio
                ref={audioRef}
                src={currentSong?.audio_url}
                crossOrigin="anonymous"
                onTimeUpdate={handleTimeUpdate}
                onEnded={next}
              />
              <img src={currentSong.cover_url} alt="" className="w-11 h-11 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{currentSong.title}</h4>
                <p className="text-[11px] text-gray-400 truncate">{currentSong.artist}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-9 h-9 flex items-center justify-center bg-white text-black rounded-full flex-shrink-0"
              >
                {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-[2px]" />}
              </button>
            </div>
            {/* Tiny progress bar */}
            <div className="h-[2px] bg-white/[0.06] rounded-full mx-3 -mt-0.5">
              <div className="h-full bg-primary-500 rounded-full transition-[width] duration-200" style={{ width: `${progressPct}%` }} />
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Zap } from 'lucide-react';

export function Game() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState([]);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('sangeet_highscore') || '0', 10);
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setNotes((prev) => {
          const filtered = prev.filter(n => Date.now() - n.id < 3000);
          return [...filtered, {
            id: Date.now(),
            x: Math.random() * 75 + 10,
            hue: Math.floor(Math.random() * 60) + 130, // Green to cyan range
          }];
        });
      }, 600);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying]);

  const tapNote = useCallback((id) => {
    const points = 10 + combo * 2;
    setScore(s => s + points);
    setCombo(c => {
      const newCombo = c + 1;
      setBestCombo(b => Math.max(b, newCombo));
      return newCombo;
    });
    setNotes(prev => prev.filter(n => n.id !== id));
  }, [combo]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setNotes([]);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setNotes([]);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('sangeet_highscore', String(score));
    }
  };

  // Auto-break combo on missed notes
  useEffect(() => {
    if (!isPlaying) return;
    const checker = setInterval(() => {
      setNotes(prev => {
        const expired = prev.filter(n => Date.now() - n.id > 2800);
        if (expired.length > 0) {
          setCombo(0);
        }
        return prev.filter(n => Date.now() - n.id < 3000);
      });
    }, 200);
    return () => clearInterval(checker);
  }, [isPlaying]);

  return (
    <div className="pb-8 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6 w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1.5">Beat Catch</h1>
        <p className="text-gray-500 text-sm">Tap the musical notes before they disappear. Build combos for bonus points!</p>
      </div>

      {/* Game arena */}
      <div className="w-full max-w-2xl rounded-2xl border border-white/[0.06] bg-black/40 h-[480px] relative overflow-hidden">
        {/* HUD */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/[0.08] backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/[0.06]">
              <Trophy size={14} className="text-amber-400" />
              <span className="font-black text-white font-mono text-sm">{score}</span>
            </div>
            {combo > 1 && (
              <motion.div
                key={combo}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 bg-primary-500/20 backdrop-blur-md px-3 py-2 rounded-xl border border-primary-500/20"
              >
                <Zap size={14} className="text-primary-500" />
                <span className="font-bold text-primary-500 text-xs">{combo}x</span>
              </motion.div>
            )}
          </div>

          <button
            onClick={isPlaying ? stopGame : startGame}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
              isPlaying
                ? 'bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30'
                : 'bg-primary-500 text-black hover:bg-primary-400'
            }`}
          >
            {isPlaying ? 'Stop' : 'Start Game'}
          </button>
        </div>

        {/* Notes */}
        <AnimatePresence>
          {notes.map(note => (
            <motion.div
              key={note.id}
              initial={{ top: '-60px', opacity: 0, scale: 0.5 }}
              animate={{ top: '110%', opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 2.8, ease: 'linear' }}
              onMouseDown={() => tapNote(note.id)}
              onTouchStart={() => tapNote(note.id)}
              className="absolute w-12 h-12 rounded-full cursor-pointer flex items-center justify-center active:scale-75 transition-transform z-10"
              style={{
                left: `${note.x}%`,
                background: `hsla(${note.hue}, 80%, 55%, 0.9)`,
                boxShadow: `0 0 24px hsla(${note.hue}, 80%, 55%, 0.5)`,
              }}
            >
              <div className="w-5 h-5 bg-white/30 rounded-full" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Idle / Game Over state */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              {score > 0 ? (
                <>
                  <h2 className="text-2xl font-black text-white mb-3">Game Over</h2>
                  <p className="text-3xl font-black text-primary-500 font-mono mb-2">{score}</p>
                  <p className="text-xs text-gray-400 mb-1">Best Combo: <span className="text-white font-bold">{bestCombo}x</span></p>
                  <p className="text-xs text-gray-400 mb-6">High Score: <span className="text-amber-400 font-bold">{highScore}</span></p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-primary-500 text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-400 transition-colors mx-auto"
                  >
                    <RotateCcw size={16} />
                    Play Again
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                    <Zap size={28} className="text-primary-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Ready to Play?</h2>
                  <p className="text-xs text-gray-400 mb-5 max-w-[240px]">
                    Tap the glowing notes as they fall. Build combos for bonus points!
                  </p>
                  <button
                    onClick={startGame}
                    className="bg-primary-500 text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-400 transition-colors"
                  >
                    Start Game
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* High score footer */}
      {highScore > 0 && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
          <Trophy size={12} className="text-amber-500" />
          <span>All-time high: <span className="text-amber-400 font-bold font-mono">{highScore}</span></span>
        </div>
      )}
    </div>
  );
}

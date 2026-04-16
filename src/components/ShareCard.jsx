import { useState, useRef, useCallback } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Share2, X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ShareCard() {
  const currentSong = usePlayerStore(s => s.currentSong);
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const handleCopyLink = useCallback(() => {
    if (!currentSong?.audio_url) return;
    navigator.clipboard.writeText(currentSong.audio_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currentSong]);

  const handleDownloadCard = useCallback(async () => {
    // Copy the song URL as a shareable link
    handleCopyLink();
  }, [handleCopyLink]);

  if (!currentSong) return null;

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all"
      >
        <Share2 size={12} />
        Share
      </button>

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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[96] flex flex-col items-center gap-5"
            >
              {/* The shareable card */}
              <div
                ref={cardRef}
                className="w-[320px] rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                }}
              >
                <div className="p-6 flex flex-col items-center">
                  {/* Album art */}
                  <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl mb-5 ring-2 ring-white/10">
                    <img
                      src={currentSong.cover_url}
                      alt=""
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>

                  {/* Song info */}
                  <h3 className="text-lg font-black text-white text-center leading-tight mb-1 max-w-full truncate">
                    {currentSong.title}
                  </h3>
                  <p className="text-sm text-gray-400 text-center truncate max-w-full">
                    {currentSong.artist}
                  </p>

                  {/* Branding */}
                  <div className="mt-5 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-[8px] font-black text-black">S</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
                      Playing on Sangeet
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-sm font-semibold text-white hover:bg-white/[0.12] transition-all"
                >
                  {copied ? <Check size={16} className="text-primary-500" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={() => setShow(false)}
                  className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center hover:bg-white/[0.12] transition-all"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

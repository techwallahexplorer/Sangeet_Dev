import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const shortcuts = [
  { category: 'Playback', items: [
    { keys: ['Space'], desc: 'Play / Pause' },
    { keys: ['Shift', '→'], desc: 'Next track' },
    { keys: ['Shift', '←'], desc: 'Previous track' },
    { keys: ['Shift', '↑'], desc: 'Volume up' },
    { keys: ['Shift', '↓'], desc: 'Volume down' },
  ]},
  { category: 'Navigation', items: [
    { keys: ['?'], desc: 'Show shortcuts' },
    { keys: ['F'], desc: 'Toggle Now Playing' },
    { keys: ['Q'], desc: 'Toggle queue' },
    { keys: ['M'], desc: 'Mute / Unmute' },
    { keys: ['S'], desc: 'Toggle shuffle' },
    { keys: ['R'], desc: 'Cycle repeat mode' },
  ]},
];

export function ShortcutsHelp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShow(s => !s);
      }
      if (e.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Floating trigger button — bottom right */}
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-24 right-4 z-30 w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/[0.08] transition-all opacity-0 hover:opacity-100 focus:opacity-100 hidden lg:flex"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard size={14} />
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[440px] bg-dark-800/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl z-[96] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <Keyboard size={18} className="text-primary-500" />
                  <h2 className="text-base font-bold text-white">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={() => setShow(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>

              {/* Shortcuts list */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
                {shortcuts.map((group, gi) => (
                  <div key={group.category} className={gi > 0 ? 'mt-5' : ''}>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                      {group.category}
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {group.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-gray-300">{item.desc}</span>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, ki) => (
                              <span key={ki}>
                                <kbd className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-xs font-mono text-gray-400 min-w-[28px] text-center inline-block">
                                  {key}
                                </kbd>
                                {ki < item.keys.length - 1 && (
                                  <span className="text-gray-700 mx-0.5 text-xs">+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-3 border-t border-white/[0.04]">
                <p className="text-[10px] text-gray-700 text-center">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[10px] font-mono text-gray-500">?</kbd> to toggle this panel
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useMoodStore } from '@/store/useMoodStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { User, LogOut, Moon, Volume2, Shield, ChevronRight, Palette, Trash2, History, Keyboard, Zap, Music, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ToggleSwitch({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-10 h-[22px] rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-white/[0.1]'}`}
    >
      <motion.div
        className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm"
        animate={{ left: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </button>
  );
}

function SettingRow({ icon: Icon, label, value, onClick, danger, children }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.02] transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
      <Icon size={18} className={`${danger ? 'text-red-400' : 'text-gray-400'} flex-shrink-0`} />
      <span className={`flex-1 text-sm font-medium ${danger ? 'text-red-400' : 'text-white'}`}>{label}</span>
      {children || (
        <>
          {value && <span className="text-xs text-gray-500">{value}</span>}
          {onClick && <ChevronRight size={16} className="text-gray-600" />}
        </>
      )}
    </div>
  );
}

export function Settings() {
  const { profile, signOut } = useAuthStore();
  const { currentMood, moodGradients } = useMoodStore();
  const recentlyPlayed = usePlayerStore(s => s.recentlyPlayed);
  const clearHistory = usePlayerStore(s => s.clearHistory);

  const [audioQuality, setAudioQuality] = useState('320kbps');
  const [autoplay, setAutoplay] = useState(true);
  const [showLyrics, setShowLyrics] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const qualityOptions = [
    { label: 'Low', value: '96kbps', desc: 'Save data' },
    { label: 'Normal', value: '160kbps', desc: 'Good quality' },
    { label: 'High', value: '320kbps', desc: 'Best quality' },
  ];

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="pb-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">Settings</h1>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 border border-white/[0.06] bg-white/[0.02] mb-6 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: moodGradients[currentMood] }}
        />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} className="w-full h-full rounded-2xl object-cover" alt="" />
            ) : (
              <User size={28} className="text-black" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{profile?.username || 'Sangeet Listener'}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Premium Member • {recentlyPlayed.length} songs played</p>
          </div>
          <div className="flex-shrink-0">
            <div className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-bold uppercase tracking-wider">
              PRO
            </div>
          </div>
        </div>
      </motion.div>

      {/* Audio Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Audio</h3>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
          {/* Quality selector */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-3.5 mb-3">
              <Volume2 size={18} className="text-gray-400" />
              <span className="text-sm text-white font-medium">Streaming Quality</span>
            </div>
            <div className="flex gap-2 ml-8">
              {qualityOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAudioQuality(opt.value)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    audioQuality === opt.value
                      ? 'bg-primary-500/20 text-primary-500 border border-primary-500/30'
                      : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:bg-white/[0.06]'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className="text-[9px] font-normal mt-0.5 opacity-70">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <SettingRow icon={Zap} label="Autoplay" value={null}>
            <ToggleSwitch enabled={autoplay} onToggle={() => setAutoplay(!autoplay)} />
          </SettingRow>

          <SettingRow icon={Music} label="Show Lyrics" value={null}>
            <ToggleSwitch enabled={showLyrics} onToggle={() => setShowLyrics(!showLyrics)} />
          </SettingRow>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Appearance</h3>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
          <SettingRow icon={Palette} label="Theme" value="Mood Adaptive" />
          <SettingRow icon={Moon} label="Dark Mode" value="Always On" />
          <SettingRow icon={Keyboard} label="Keyboard Shortcuts" value="Press ?" />
        </div>
      </motion.div>

      {/* Data */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Data & Privacy</h3>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
          <SettingRow icon={Shield} label="Listening Activity" value="Private" />
          <SettingRow icon={Download} label="Download Quality" value={audioQuality} />
          <SettingRow
            icon={History}
            label="Listening History"
            value={`${recentlyPlayed.length} songs`}
          />
          <SettingRow
            icon={Trash2}
            label="Clear Listening History"
            onClick={() => setShowClearConfirm(true)}
            danger
          />
        </div>
      </motion.div>

      {/* Account */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Account</h3>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <SettingRow icon={LogOut} label="Sign Out" onClick={signOut} danger />
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-10 text-center space-y-1">
        <p className="text-[11px] text-gray-700 font-medium">
          SANGEET v3.0 • Built with ♥
        </p>
        <p className="text-[10px] text-gray-800">
          Powered by JioSaavn API • React + Zustand + Framer Motion
        </p>
      </div>

      {/* Clear history confirmation modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[360px] bg-dark-800 border border-white/[0.08] rounded-2xl p-6 z-[96] shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Clear History?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                This will remove all {recentlyPlayed.length} songs from your listening history. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm font-semibold text-white hover:bg-white/[0.1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

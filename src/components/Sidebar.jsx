import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, ListMusic, Smile, Users, BarChart2, Gamepad2, Settings, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/useMoodStore';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Library, label: 'Library', path: '/library' },
  { icon: ListMusic, label: 'Playlists', path: '/playlists' },
  { divider: true },
  { icon: Smile, label: 'Mood', path: '/mood' },
  { icon: Users, label: 'Listen Together', path: '/social' },
  { icon: BarChart2, label: 'Insights', path: '/insights' },
  { icon: Gamepad2, label: 'Beat Catch', path: '/game' },
  { divider: true },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { currentMood, moodGradients } = useMoodStore();

  return (
    <aside className="w-[260px] h-full flex-shrink-0 flex flex-col relative z-10 hidden lg:flex">
      {/* Sidebar glass background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl border-r border-white/[0.06]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full pt-6 pb-6">
        {/* Brand */}
        <Link to="/" className="px-6 mb-8 flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
            <Music size={20} className="text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              SANGEET<span className="text-primary-500">.</span>
            </h1>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em]">Premium</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 flex flex-col gap-0.5">
          {navItems.map((item, idx) => {
            if (item.divider) {
              return <div key={`d-${idx}`} className="h-px bg-white/[0.04] my-3 mx-3" />;
            }

            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white/[0.08] rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-500 rounded-r-full shadow-[0_0_8px_rgba(29,185,84,0.6)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={18} className="relative z-10 flex-shrink-0" />
                <span className="relative z-10 text-sm font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom ambient mood indicator */}
        <div className="px-4 mt-auto">
          <div
            className="h-24 rounded-2xl overflow-hidden relative flex items-end p-4 transition-all duration-1000"
            style={{ background: moodGradients[currentMood] }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 mb-0.5">Current Mood</p>
              <p className="text-sm font-bold text-white capitalize">{currentMood}</p>
            </div>
            {/* Animated bars */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-end gap-[3px] opacity-60">
              {[12, 20, 8, 16, 24, 10, 18].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-white/80 rounded-full"
                  animate={{ height: [h, h * 0.4, h, h * 0.7, h] }}
                  transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

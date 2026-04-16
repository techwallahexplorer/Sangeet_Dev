import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Smile, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const mobileNavItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Library, label: 'Library', path: '/library' },
  { icon: Smile, label: 'Mood', path: '/mood' },
  { icon: Settings, label: 'More', path: '/settings' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Glass background */}
      <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-2xl border-t border-white/[0.06]" />

      <div className="relative z-10 flex items-center justify-around px-2 py-2 safe-bottom">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative ${
                isActive ? 'text-primary-500' : 'text-gray-500'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-primary-500 rounded-full shadow-[0_0_8px_rgba(29,185,84,0.5)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

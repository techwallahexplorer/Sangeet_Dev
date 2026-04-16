import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { AppLayout } from '@/layouts/AppLayout';
import { ShortcutsHelp } from '@/components/ShortcutsHelp';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy-load all page components for code splitting
const Auth = lazy(() => import('@/pages/Auth').then(m => ({ default: m.Auth })));
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const Mood = lazy(() => import('@/pages/Mood').then(m => ({ default: m.Mood })));
const Social = lazy(() => import('@/pages/Social').then(m => ({ default: m.Social })));
const Game = lazy(() => import('@/pages/Game').then(m => ({ default: m.Game })));
const Search = lazy(() => import('@/pages/Search').then(m => ({ default: m.Search })));
const Library = lazy(() => import('@/pages/Library').then(m => ({ default: m.Library })));
const Playlists = lazy(() => import('@/pages/Playlists').then(m => ({ default: m.Playlists })));
const Insights = lazy(() => import('@/pages/Insights').then(m => ({ default: m.Insights })));
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })));

// Full-screen page loading spinner
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        <span className="text-sm text-gray-500 font-medium">Loading...</span>
      </div>
    </div>
  );
}

// Animated page wrapper for smooth transitions
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};
const pageTransition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] };

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="h-screen w-full bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-[3px] border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-500 font-medium tracking-wide">Initializing SANGEET...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  return <AppLayout>{children}</AppLayout>;
}

// Inner route renderer (needs to be inside Router)
function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />} key={location.pathname}>
        <Routes location={location}>
          <Route path="/auth" element={<AnimatedPage><Auth /></AnimatedPage>} />

          <Route path="/" element={<ProtectedRoute><AnimatedPage><Home /></AnimatedPage></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><AnimatedPage><Search /></AnimatedPage></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><AnimatedPage><Library /></AnimatedPage></ProtectedRoute>} />
          <Route path="/playlists" element={<ProtectedRoute><AnimatedPage><Playlists /></AnimatedPage></ProtectedRoute>} />
          <Route path="/mood" element={<ProtectedRoute><AnimatedPage><Mood /></AnimatedPage></ProtectedRoute>} />
          <Route path="/social" element={<ProtectedRoute><AnimatedPage><Social /></AnimatedPage></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><AnimatedPage><Insights /></AnimatedPage></ProtectedRoute>} />
          <Route path="/game" element={<ProtectedRoute><AnimatedPage><Game /></AnimatedPage></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AnimatedPage><Settings /></AnimatedPage></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Global keyboard shortcuts for player
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if not typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const store = usePlayerStore.getState();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          store.togglePlay();
          break;
        case 'ArrowRight':
          if (e.shiftKey) store.next();
          break;
        case 'ArrowLeft':
          if (e.shiftKey) store.prev();
          break;
        case 'ArrowUp':
          if (e.shiftKey) {
            e.preventDefault();
            store.setVolume(Math.min(1, store.volume + 0.1));
          }
          break;
        case 'ArrowDown':
          if (e.shiftKey) {
            e.preventDefault();
            store.setVolume(Math.max(0, store.volume - 0.1));
          }
          break;
        case 'KeyF':
          if (!e.metaKey && !e.ctrlKey) store.toggleNowPlaying();
          break;
        case 'KeyQ':
          if (!e.metaKey && !e.ctrlKey) store.toggleQueue();
          break;
        case 'KeyM':
          if (!e.metaKey && !e.ctrlKey) store.setVolume(store.volume === 0 ? 0.8 : 0);
          break;
        case 'KeyS':
          if (!e.metaKey && !e.ctrlKey) store.toggleShuffle();
          break;
        case 'KeyR':
          if (!e.metaKey && !e.ctrlKey) store.cycleRepeat();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
      <ShortcutsHelp />
    </>
  );
}

export default App;

import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { PlayerBar } from '@/components/PlayerBar';
import { NowPlaying } from '@/components/NowPlaying';
import { QueuePanel } from '@/components/QueuePanel';
import { useMoodStore } from '@/store/useMoodStore';
import { usePlayerStore } from '@/store/usePlayerStore';

export function AppLayout({ children }) {
  const { currentMood, moodGradients } = useMoodStore();
  const currentSong = usePlayerStore(s => s.currentSong);

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden">
      {/* Ambient background — three-layer gradient system */}
      <div className="absolute inset-0 bg-dark-900 z-0" />

      {/* Mood-reactive gradient layer */}
      <div
        className="absolute inset-0 z-0 transition-all duration-[2000ms] ease-in-out"
        style={{
          background: moodGradients[currentMood],
          opacity: 0.15,
        }}
      />

      {/* Album art color bleed (subtle ambient glow from current song) */}
      {currentSong?.cover_url && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={currentSong.cover_url}
            alt=""
            className="w-full h-full object-cover blur-[120px] opacity-[0.06] scale-150 transition-all duration-[3000ms]"
          />
        </div>
      )}

      {/* Subtle grain overlay for depth */}
      <div
        className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto w-full relative" id="main-content">
          <div className="min-h-full px-4 sm:px-6 lg:px-8 py-6 pb-40">
            {children}
          </div>
        </main>
      </div>

      {/* Player bar — always at bottom */}
      <PlayerBar />

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Overlays */}
      <NowPlaying />
      <QueuePanel />
    </div>
  );
}

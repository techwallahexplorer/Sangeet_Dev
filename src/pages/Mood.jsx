import { useMoodStore } from '@/store/useMoodStore';
import { motion } from 'framer-motion';

export function Mood() {
  const { currentMood, setMood, moods, moodColors, moodGradients } = useMoodStore();

  return (
    <div className="pb-8">
      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1.5">Mood Engine</h1>
      <p className="text-gray-500 text-sm mb-10">
        Select your vibe and SANGEET adapts the entire experience to match.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {moods.map((mood, idx) => {
          const isActive = currentMood === mood.id;

          return (
            <motion.button
              key={mood.id}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => setMood(mood.id)}
              className={`relative overflow-hidden rounded-2xl text-left transition-all group h-36 p-5 flex flex-col justify-end border-2 ${
                isActive
                  ? 'border-white shadow-xl'
                  : 'border-white/[0.06] hover:border-white/[0.15]'
              }`}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-40' : 'opacity-10 group-hover:opacity-20'}`}
                style={{ background: moodGradients[mood.id] }}
              />

              {/* Emoji */}
              <span className="absolute top-5 right-5 text-3xl transition-transform group-hover:scale-110">
                {mood.emoji}
              </span>

              {/* Active checkmark */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-5 left-5 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                >
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}

              {/* Label */}
              <div className="relative z-10">
                <h3 className={`text-xl font-bold ${isActive ? 'text-white' : 'text-gray-200'}`}>
                  {mood.label}
                </h3>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                  {mood.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active mood indicator */}
      <motion.div
        key={currentMood}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 p-6 rounded-2xl border border-white/[0.06] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: moodGradients[currentMood] }}
        />
        <div className="relative z-10 flex items-center gap-4">
          <span className="text-4xl">
            {moods.find(m => m.id === currentMood)?.emoji}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Active Mood</p>
            <p className="text-xl font-bold text-white capitalize">{currentMood}</p>
          </div>
          <p className="ml-auto text-sm text-gray-500 hidden sm:block">
            The UI theme, recommendations, and playlists are now tuned to this mood.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

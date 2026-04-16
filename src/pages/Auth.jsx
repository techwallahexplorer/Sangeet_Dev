import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await signUp(email, password, username);
        if (error) throw error;
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center relative overflow-hidden selection:bg-primary-500/30 selection:text-white px-4">
      {/* Animated ambient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 60, 0],
          y: [0, -40, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full mix-blend-screen filter blur-[180px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          x: [0, -40, 0],
          y: [0, 60, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-accent-500/15 rounded-full mix-blend-screen filter blur-[180px] pointer-events-none"
      />

      {/* Auth card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] p-8 sm:p-10 bg-white/[0.025] backdrop-blur-3xl border border-white/[0.06] shadow-[0_0_80px_rgba(29,185,84,0.08)] rounded-3xl z-10"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div
            whileHover={{ rotate: 90, scale: 1.05 }}
            transition={{ duration: 0.4, ease: 'circOut' }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center mb-5 shadow-xl shadow-primary-500/20"
          >
            <Music size={26} className="text-black" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            SANGEET<span className="text-primary-500">.</span>
          </h1>
          <p className="text-gray-500 text-xs font-medium mt-1.5">
            {isLogin ? 'Welcome back. Sign in to continue.' : 'Join the future of music streaming.'}
          </p>
        </div>

        {/* Error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-xs font-medium flex items-center gap-2.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-[10px] font-bold text-gray-500 mb-1.5 block ml-0.5 uppercase tracking-widest">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all"
                  placeholder="Your unique alias"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-[10px] font-bold text-gray-500 mb-1.5 block ml-0.5 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all"
              placeholder="hello@example.com"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 mb-1.5 block ml-0.5 uppercase tracking-widest">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading}
            type="submit"
            className="w-full py-3.5 mt-1 bg-gradient-to-r from-primary-500 to-primary-400 text-black font-bold text-sm rounded-xl hover:shadow-[0_0_24px_rgba(29,185,84,0.35)] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        {/* Toggle */}
        <div className="mt-7 pt-6 border-t border-white/[0.04] text-center">
          <p className="text-xs text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="mt-1.5 text-sm text-white font-bold hover:text-primary-400 transition-colors"
          >
            {isLogin ? 'Create one' : 'Sign in instead'}
            <span className="text-primary-500 ml-1">→</span>
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <p className="mt-8 text-[10px] text-gray-700 z-10">
        By continuing, you agree to SANGEET's Terms of Service.
      </p>
    </div>
  );
}

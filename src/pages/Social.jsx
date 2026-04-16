import { useEffect, useState } from 'react';
import { supabase } from '@/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Users, Play, Radio, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Social() {
  const { profile } = useAuthStore();
  const { currentSong, isPlaying } = usePlayerStore();
  const [roomCode, setRoomCode] = useState('');
  const [activeChannel, setActiveChannel] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (activeChannel) supabase.removeChannel(activeChannel);
    };
  }, [activeChannel]);

  const joinRoom = () => {
    if (!roomCode || activeChannel) return;

    const channel = supabase.channel(`room:${roomCode}`, {
      config: { presence: { key: profile?.username || 'Guest' } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state).map(k => state[k][0]?.username || k);
        setParticipants(users);
      })
      .on('broadcast', { event: 'play_state' }, ({ payload }) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(m => [...m, { text: `Host changed playback`, time }]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ username: profile?.username || 'Guest' });
          setActiveChannel(channel);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setMessages([{ text: `You joined room ${roomCode}`, time }]);
        }
      });
  };

  const leaveRoom = () => {
    if (activeChannel) {
      supabase.removeChannel(activeChannel);
      setActiveChannel(null);
      setRoomCode('');
      setParticipants([]);
      setMessages([]);
    }
  };

  const broadcastPlay = () => {
    if (activeChannel) {
      activeChannel.send({
        type: 'broadcast',
        event: 'play_state',
        payload: { isPlaying, song: currentSong?.id }
      });
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(m => [...m, { text: `You synced playback`, time }]);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-8 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1.5">Listen Together</h1>
      <p className="text-gray-500 text-sm mb-10">Sync your playback with friends in real-time.</p>

      <AnimatePresence mode="wait">
        {!activeChannel ? (
          <motion.div
            key="join"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Radio size={20} className="text-primary-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Join or host a room</h2>
                <p className="text-xs text-gray-500">Share the code with friends to listen together</p>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter room code (e.g. VIBE99)"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && joinRoom()}
                className="flex-1 bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500/50 uppercase tracking-widest font-mono placeholder:font-sans placeholder:tracking-normal placeholder:normal-case placeholder:text-gray-600"
              />
              <button
                onClick={joinRoom}
                disabled={!roomCode}
                className="bg-primary-500 text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Join
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="room"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Room info — takes 3/5 */}
              <div className="lg:col-span-3 p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                {/* Room header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
                    <h2 className="text-lg font-bold text-white font-mono tracking-wider">{roomCode}</h2>
                    <button
                      onClick={copyRoomCode}
                      className="text-gray-500 hover:text-white transition-colors"
                      title="Copy room code"
                    >
                      {copied ? <Check size={14} className="text-primary-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <button onClick={leaveRoom} className="text-xs text-red-400 hover:text-red-300 font-bold border border-red-400/20 px-3 py-1 rounded-lg transition-colors">
                    Leave
                  </button>
                </div>

                {/* Listeners */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Listeners ({participants.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {participants.map((p, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/[0.05] rounded-full text-xs text-white font-medium border border-white/[0.06]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activity log */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Activity</h3>
                  <div className="h-28 overflow-y-auto flex flex-col gap-1.5 hide-scrollbar">
                    {messages.length === 0 && (
                      <span className="text-xs text-gray-600">No activity yet.</span>
                    )}
                    {messages.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600 font-mono text-[10px]">{m.time}</span>
                        <span className="text-gray-400">{m.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DJ panel — takes 2/5 */}
              <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Users size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">You're the DJ</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
                    Play, pause, or change songs to sync everyone in the room.
                  </p>
                </div>
                <button
                  onClick={broadcastPlay}
                  className="px-5 py-2.5 bg-white text-black font-bold text-sm rounded-full hover:scale-105 transition-transform shadow-lg"
                >
                  Sync Playback
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

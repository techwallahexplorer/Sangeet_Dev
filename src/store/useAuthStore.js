import { create } from 'zustand';
import { supabase } from '@/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,

  initialize: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user || null });
      if (session?.user) {
        await get().fetchProfile(session.user.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user || null });
      if (session?.user) {
        await get().fetchProfile(session.user.id);
      } else {
        set({ profile: null });
      }
    });
  },

  fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) {
      set({ profile: data });
    }
  },

  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({ provider: 'google' });
  },

  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password 
    });
    if (error) return { error };
    if (data?.user) {
      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        username,
      });
    }
    return { data };
  },

  signOut: async () => {
    await supabase.auth.signOut();
  }
}));

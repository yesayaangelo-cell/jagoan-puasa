import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  name: string;
  points: number;
  avatar: string;
  is_premium: boolean;
}

export function usePlayer() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from DB
  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (data) {
      setProfile(data as Profile);
    }
  }, []);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => fetchProfile(u.id), 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchProfile(u.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const addPoints = useCallback(async (pts: number) => {
    if (!profile) return;
    const newPoints = profile.points + pts;
    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", profile.id);
    if (!error) {
      setProfile((prev) => prev ? { ...prev, points: newPoints } : prev);
    }
  }, [profile]);

  const spendPoints = useCallback(async (pts: number): Promise<boolean> => {
    if (!profile || profile.points < pts) return false;
    const newPoints = profile.points - pts;
    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", profile.id);
    if (!error) {
      setProfile((prev) => prev ? { ...prev, points: newPoints } : prev);
      return true;
    }
    return false;
  }, [profile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return { user, profile, loading, signUp, signIn, addPoints, spendPoints, logout, fetchProfile };
}

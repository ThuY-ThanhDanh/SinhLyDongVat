"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "./supabase/client";
import { Profile } from "./supabase/types";
import { UserProgress } from "@/types";
import { getProgress, saveProgress } from "./storage";
import { fetchCloudProgress, migrateLocalDataToCloud } from "./supabase/sync";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  pendingMigration: UserProgress | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  confirmMigration: () => Promise<boolean>;
  dismissMigration: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  isConfigured: false,
  pendingMigration: null,
  signIn: async () => ({ error: "Not initialized" }),
  signUp: async () => ({ error: "Not initialized" }),
  signOut: async () => {},
  confirmMigration: async () => false,
  dismissMigration: () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingMigration, setPendingMigration] = useState<UserProgress | null>(null);

  const fetchUserProfile = useCallback(async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (data) {
        setProfile(data as Profile);
      }
    } catch (e) {
      console.warn("fetchUserProfile error:", e);
    }
  }, []);

  const checkForPendingMigration = useCallback(async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      // Check if user already migrated before
      const { data: receipts } = await supabase
        .from("migration_receipts")
        .select("id")
        .eq("user_id", userId)
        .limit(1);

      if (!receipts || receipts.length === 0) {
        // User has never migrated. Check local storage
        const local = getProgress();
        // If local storage has XP > 0 or completed lessons
        if (local.xp > 0 || local.completedLessons.length > 0 || local.masteredFlashcards.length > 0) {
          const alreadyDismissed = localStorage.getItem(`dismissed_migration_${userId}`);
          if (!alreadyDismissed) {
            setPendingMigration(local);
          }
        }
      }
    } catch (e) {
      console.warn("checkForPendingMigration error:", e);
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        checkForPendingMigration(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchUserProfile(newSession.user.id);
        await checkForPendingMigration(newSession.user.id);
        // Also pull cloud progress and update local storage cache for smooth offline UX
        const cloudProgress = await fetchCloudProgress(newSession.user.id);
        if (cloudProgress) {
          saveProgress(cloudProgress);
        }
      } else {
        setProfile(null);
        setPendingMigration(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, checkForPendingMigration]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Supabase chưa được kết nối" };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
        await checkForPendingMigration(data.user.id);
      }
      return { error: null };
    } catch (e: any) {
      return { error: e.message || "Lỗi đăng nhập" };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<{ error: string | null }> => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Supabase chưa được kết nối" };

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
        await checkForPendingMigration(data.user.id);
      }
      return { error: null };
    } catch (e: any) {
      return { error: e.message || "Lỗi đăng ký" };
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setPendingMigration(null);
  };

  const confirmMigration = async (): Promise<boolean> => {
    if (!user || !pendingMigration) return false;
    const res = await migrateLocalDataToCloud(user.id, pendingMigration);
    if (res.success) {
      setPendingMigration(null);
      await fetchUserProfile(user.id);
      const cloud = await fetchCloudProgress(user.id);
      if (cloud) saveProgress(cloud);
      return true;
    }
    return false;
  };

  const dismissMigration = () => {
    if (user) {
      localStorage.setItem(`dismissed_migration_${user.id}`, "true");
    }
    setPendingMigration(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        pendingMigration,
        signIn,
        signUp,
        signOut,
        confirmMigration,
        dismissMigration,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

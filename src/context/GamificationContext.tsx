import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProfile, UserAchievement } from '../types/gamification';
import type { Session } from '@supabase/supabase-js';

interface GamificationContextType {
    profile: UserProfile | null;
    achievements: UserAchievement[];
    loading: boolean;
    refreshProfile: () => Promise<void>;
    addPointsOptimistic: (points: number) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [achievements, setAchievements] = useState<UserAchievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchGamificationData = async () => {
        if (!session?.user) return;

        try {
            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching profile:', profileError);
            } else if (profileData) {
                setProfile(profileData);
            }

            // Fetch Achievements
            const { data: achievementData, error: achievementError } = await supabase
                .from('user_achievements')
                .select('*, achievement:achievements(*)')
                .eq('user_id', session.user.id);

            if (achievementError) {
                console.error('Error fetching achievements:', achievementError);
            } else {
                setAchievements(achievementData || []);
            }
        } catch (error) {
            console.error('Error in gamification fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchGamificationData();

            // Subscribe to Realtime changes for Profile
            const profileSub = supabase
                .channel('public:user_profiles')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'user_profiles',
                        filter: `user_id=eq.${session.user.id}`,
                    },
                    (payload) => {
                        setProfile(payload.new as UserProfile);
                    }
                )
                .subscribe();

            // Subscribe to Realtime changes for Achievements
            const achievementSub = supabase
                .channel('public:user_achievements')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'user_achievements',
                        filter: `user_id=eq.${session.user.id}`,
                    },
                    () => {
                        // Refresh achievements on new insert
                        fetchGamificationData();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(profileSub);
                supabase.removeChannel(achievementSub);
            };
        } else {
            setLoading(false);
        }
    }, [session]);

    // Optimistic update for instant feedback
    const addPointsOptimistic = (points: number) => {
        if (!profile) return;

        const newPoints = profile.points + points;
        const newLevel = 1 + Math.floor(newPoints / 500);

        setProfile({
            ...profile,
            points: newPoints,
            level: newLevel,
        });
    };

    return (
        <GamificationContext.Provider value={{ profile, achievements, loading, refreshProfile: fetchGamificationData, addPointsOptimistic }}>
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
}

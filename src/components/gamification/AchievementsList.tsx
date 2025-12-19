import { BadgeCheck, Lock } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Achievement } from '../../types/gamification';

export function AchievementsList() {
    const { achievements: unlocked } = useGamification();
    const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        supabase.from('achievements').select('*').then(({ data }) => {
            if (data) setAllAchievements(data);
        });
    }, []);

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Badges & Achievements</h3>
            <div className="grid gap-3 sm:grid-cols-2">
                {allAchievements.map((badge) => {
                    const isUnlocked = unlocked.some((u) => u.achievement_id === badge.id);

                    return (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={cn(
                                "flex items-center gap-3 rounded-xl p-3 transition-colors",
                                isUnlocked ? "bg-indigo-50" : "bg-gray-50"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full",
                                    isUnlocked ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-400"
                                )}
                            >
                                {isUnlocked ? <BadgeCheck className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                            </div>
                            <div>
                                <h4 className={cn("text-sm font-semibold", isUnlocked ? "text-indigo-900" : "text-gray-500")}>
                                    {badge.name}
                                </h4>
                                <p className="text-xs text-gray-500">{badge.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

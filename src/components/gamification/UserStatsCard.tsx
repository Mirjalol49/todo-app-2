import { Trophy, Star, TrendingUp } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { motion } from 'framer-motion';

export function UserStatsCard() {
    const { profile, loading } = useGamification();

    if (loading || !profile) return null;

    // Calculate progress to next level
    // Formula from SQL: new_level := 1 + floor(new.points / 500);
    // So Level 1 = 0-499, Level 2 = 500-999
    const pointsPerLevel = 500;
    const currentLevelStart = (profile.level - 1) * pointsPerLevel;
    const nextLevelStart = profile.level * pointsPerLevel;
    const progress = ((profile.points - currentLevelStart) / pointsPerLevel) * 100;

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg"
            >
                <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                        <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-indigo-100">Current Level</p>
                        <h3 className="text-2xl font-bold">Level {profile.level}</h3>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-indigo-100 mb-1">
                        <span>{Math.round(progress)}% to Level {profile.level + 1}</span>
                        <span>{profile.points} / {nextLevelStart} XP</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-black/20">
                        <motion.div
                            layout
                            style={{ width: `${progress}%` }}
                            className="h-2 rounded-full bg-white"
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
                <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-yellow-50 p-3">
                        <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Points</p>
                        <h3 className="text-2xl font-bold text-gray-900">{profile.points}</h3>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
                <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-green-50 p-3">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Day Streak</p>
                        <h3 className="text-2xl font-bold text-gray-900">{profile.current_streak} days</h3>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export interface UserProfile {
    user_id: string;
    points: number;
    level: number;
    current_streak: number;
    last_active_date: string;
}

export interface Achievement {
    id: number;
    name: string;
    description: string;
    points_threshold: number;
}

export interface UserAchievement {
    user_id: string;
    achievement_id: number;
    unlocked_at: string;
    achievement?: Achievement; // Joined data
}

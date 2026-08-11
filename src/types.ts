export type CategoryId = 'Learn' | 'Fitness' | 'Personal' | 'Skill';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  color: string; // Tailwind text color or hex
  bgHex: string;
  borderHex: string;
  dotColor: string;
  iconName: string;
}

export interface Habit {
  id: string;
  title: string;
  category: CategoryId;
  icon: string; // Icon identifier e.g. 'zap', 'book', 'gem', 'sparkles', 'code'
  createdAt: string; // Date string or ISO timestamp 'YYYY-MM-DD'
  archivedAt?: string | null; // Date string or ISO timestamp when archived 'YYYY-MM-DD'
}

// Map of habitId -> array of date strings 'YYYY-MM-DD' that were completed
// Or a map of 'YYYY-MM-DD': { [habitId]: boolean }
export interface HabitLogs {
  [dateKey: string]: {
    [habitId: string]: boolean;
  };
}

export type AchievementTier = 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: AchievementTier;
  icon: string;
  progressMax?: number;
  checkUnlocked: (stats: {
    currentStreak: number;
    longestStreak: number;
    totalTasks: number;
    habits: Habit[];
    logs: HabitLogs;
    monthlyConsistency: number;
  }) => { unlocked: boolean; progress?: number };
}

export type NavigationTab = 'dashboard' | 'insights';

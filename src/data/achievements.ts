import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // LEGENDARY
  {
    id: 'unbreakable',
    title: 'Unbreakable',
    description: 'Maintain a 200-day streak',
    tier: 'LEGENDARY',
    icon: 'Gem',
    checkUnlocked: (stats) => ({ unlocked: stats.longestStreak >= 200, progress: Math.min(stats.longestStreak, 200) }),
  },
  {
    id: 'transcendent',
    title: 'Transcendent',
    description: 'Complete 1000 tasks total',
    tier: 'LEGENDARY',
    icon: 'Sparkle',
    checkUnlocked: (stats) => ({ unlocked: stats.totalTasks >= 1000, progress: Math.min(stats.totalTasks, 1000) }),
  },

  // EPIC
  {
    id: 'legend',
    title: 'Legend',
    description: 'Maintain a 100-day streak',
    tier: 'EPIC',
    icon: 'Crown',
    checkUnlocked: (stats) => ({ unlocked: stats.longestStreak >= 100, progress: Math.min(stats.longestStreak, 100) }),
  },
  {
    id: 'task_master',
    title: 'Task Master',
    description: 'Complete 500 tasks total',
    tier: 'EPIC',
    icon: 'Trophy',
    checkUnlocked: (stats) => ({ unlocked: stats.totalTasks >= 500, progress: Math.min(stats.totalTasks, 500) }),
  },
  {
    id: 'perfect_month',
    title: 'Perfect Month',
    description: 'Complete tasks every day for a full month',
    tier: 'EPIC',
    icon: 'Moon',
    checkUnlocked: (stats) => ({ unlocked: stats.monthlyConsistency >= 100, progress: stats.monthlyConsistency }),
  },
  {
    id: 'speed_runner',
    title: 'Speed Runner',
    description: 'Complete 10 tasks in a single day',
    tier: 'EPIC',
    icon: 'Timer',
    checkUnlocked: (stats) => {
      const maxInADay = Object.values(stats.logs).reduce((max, dayLog) => {
        const count = Object.values(dayLog).filter(Boolean).length;
        return Math.max(max, count);
      }, 0);
      return { unlocked: maxInADay >= 10, progress: Math.min(maxInADay, 10) };
    },
  },

  // RARE
  {
    id: 'quarter_century',
    title: 'Quarter Century',
    description: 'Maintain a 25-day streak',
    tier: 'RARE',
    icon: 'Orbit',
    checkUnlocked: (stats) => ({ unlocked: stats.longestStreak >= 25, progress: Math.min(stats.longestStreak, 25) }),
  },
  {
    id: 'monthly_master',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    tier: 'RARE',
    icon: 'Calendar',
    checkUnlocked: (stats) => ({ unlocked: stats.longestStreak >= 30, progress: Math.min(stats.longestStreak, 30) }),
  },
  {
    id: 'iron_will',
    title: 'Iron Will',
    description: 'Maintain a 60-day streak',
    tier: 'RARE',
    icon: 'Shield',
    checkUnlocked: (stats) => ({ unlocked: stats.longestStreak >= 60, progress: Math.min(stats.longestStreak, 60) }),
  },
  {
    id: 'relentless',
    title: 'Relentless',
    description: 'Complete 200 tasks total',
    tier: 'RARE',
    icon: 'Zap',
    checkUnlocked: (stats) => ({ unlocked: stats.totalTasks >= 200, progress: Math.min(stats.totalTasks, 200) }),
  },
  {
    id: 'all_rounder',
    title: 'All-Rounder',
    description: 'Complete all 4 task types in one day',
    tier: 'RARE',
    icon: 'Tent',
    checkUnlocked: (stats) => {
      const unlocked = Object.values(stats.logs).some((dayLog) => {
        const categoriesDone = new Set<string>();
        Object.entries(dayLog).forEach(([habitId, completed]) => {
          if (completed) {
            const habit = stats.habits.find((h) => h.id === habitId);
            if (habit) categoriesDone.add(habit.category);
          }
        });
        return categoriesDone.size >= 4;
      });
      return { unlocked };
    },
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Achieve 90% monthly consistency',
    tier: 'RARE',
    icon: 'Building',
    checkUnlocked: (stats) => ({ unlocked: stats.monthlyConsistency >= 90, progress: stats.monthlyConsistency }),
  },
  {
    id: 'overachiever',
    title: 'Overachiever',
    description: 'Complete 5+ tasks in a single day',
    tier: 'RARE',
    icon: 'Rocket',
    checkUnlocked: (stats) => {
      const maxInADay = Object.values(stats.logs).reduce((max, dayLog) => {
        const count = Object.values(dayLog).filter(Boolean).length;
        return Math.max(max, count);
      }, 0);
      return { unlocked: maxInADay >= 5, progress: Math.min(maxInADay, 5) };
    },
  },

  // COMMON
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your very first task',
    tier: 'COMMON',
    icon: 'Footprints',
    checkUnlocked: (stats) => ({ unlocked: stats.totalTasks >= 1, progress: Math.min(stats.totalTasks, 1) }),
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    tier: 'COMMON',
    icon: 'Swords',
    checkUnlocked: (stats) => ({ unlocked: stats.longestStreak >= 7, progress: Math.min(stats.longestStreak, 7) }),
  },
  {
    id: 'fortnight',
    title: 'Fortnight',
    description: 'Maintain a 14-day streak',
    tier: 'COMMON',
    icon: 'Flame',
    checkUnlocked: (stats) => ({ unlocked: stats.longestStreak >= 14, progress: Math.min(stats.longestStreak, 14) }),
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Complete 100 tasks total',
    tier: 'COMMON',
    icon: 'Hundred',
    checkUnlocked: (stats) => ({ unlocked: stats.totalTasks >= 100, progress: Math.min(stats.totalTasks, 100) }),
  },
  {
    id: 'fitness_fanatic',
    title: 'Fitness Fanatic',
    description: 'Complete 20 fitness tasks',
    tier: 'COMMON',
    icon: 'Dumbbell',
    checkUnlocked: (stats) => {
      let fitnessCount = 0;
      Object.values(stats.logs).forEach((dayLog) => {
        Object.entries(dayLog).forEach(([habitId, done]) => {
          if (done) {
            const h = stats.habits.find((habit) => habit.id === habitId);
            if (h && h.category === 'Fitness') fitnessCount++;
          }
        });
      });
      return { unlocked: fitnessCount >= 20, progress: Math.min(fitnessCount, 20) };
    },
  },
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Complete 20 learn tasks',
    tier: 'COMMON',
    icon: 'BookOpen',
    checkUnlocked: (stats) => {
      let count = 0;
      Object.values(stats.logs).forEach((dayLog) => {
        Object.entries(dayLog).forEach(([habitId, done]) => {
          if (done) {
            const h = stats.habits.find((habit) => habit.id === habitId);
            if (h && h.category === 'Learn') count++;
          }
        });
      });
      return { unlocked: count >= 20, progress: Math.min(count, 20) };
    },
  },
  {
    id: 'skill_builder',
    title: 'Skill Builder',
    description: 'Complete 20 skill tasks',
    tier: 'COMMON',
    icon: 'Target',
    checkUnlocked: (stats) => {
      let count = 0;
      Object.values(stats.logs).forEach((dayLog) => {
        Object.entries(dayLog).forEach(([habitId, done]) => {
          if (done) {
            const h = stats.habits.find((habit) => habit.id === habitId);
            if (h && h.category === 'Skill') count++;
          }
        });
      });
      return { unlocked: count >= 20, progress: Math.min(count, 20) };
    },
  },
  {
    id: 'self_care_champion',
    title: 'Self-Care Champion',
    description: 'Complete 20 personal tasks',
    tier: 'COMMON',
    icon: 'Leaf',
    checkUnlocked: (stats) => {
      let count = 0;
      Object.values(stats.logs).forEach((dayLog) => {
        Object.entries(dayLog).forEach(([habitId, done]) => {
          if (done) {
            const h = stats.habits.find((habit) => habit.id === habitId);
            if (h && h.category === 'Personal') count++;
          }
        });
      });
      return { unlocked: count >= 20, progress: Math.min(count, 20) };
    },
  },
  {
    id: 'comeback_kid',
    title: 'Comeback Kid',
    description: 'Return after a 5+ day break',
    tier: 'COMMON',
    icon: 'RotateCcw',
    checkUnlocked: () => ({ unlocked: false }),
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Have 3+ tasks active at once',
    tier: 'COMMON',
    icon: 'Owl',
    checkUnlocked: (stats) => ({ unlocked: stats.habits.length >= 3, progress: Math.min(stats.habits.length, 3) }),
  },
  {
    id: 'variety_pack',
    title: 'Variety Pack',
    description: 'Have at least one task of every type',
    tier: 'COMMON',
    icon: 'Palette',
    checkUnlocked: (stats) => {
      const categoriesPresent = new Set(stats.habits.map((h) => h.category));
      return { unlocked: categoriesPresent.size >= 4, progress: categoriesPresent.size };
    },
  },
];

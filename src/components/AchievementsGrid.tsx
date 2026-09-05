import React from 'react';
import { AchievementTier, Habit, HabitLogs } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import { IconRenderer } from './IconRenderer';

interface AchievementsGridProps {
  currentStreak: number;
  longestStreak: number;
  totalTasks: number;
  habits: Habit[];
  logs: HabitLogs;
  monthlyConsistency: number;
}

const TIER_CONFIG: Record<
  AchievementTier,
  { label: string; colorClass: string; lineClass: string }
> = {
  LEGENDARY: {
    label: 'LEGENDARY',
    colorClass: 'text-purple-300',
    lineClass: 'from-purple-500/40 via-purple-900/20 to-transparent',
  },
  EPIC: {
    label: 'EPIC',
    colorClass: 'text-zinc-200',
    lineClass: 'from-zinc-400/40 via-zinc-800/20 to-transparent',
  },
  RARE: {
    label: 'RARE',
    colorClass: 'text-zinc-400',
    lineClass: 'from-zinc-500/40 via-zinc-900/20 to-transparent',
  },
  COMMON: {
    label: 'COMMON',
    colorClass: 'text-zinc-500',
    lineClass: 'from-zinc-700/40 via-zinc-900/20 to-transparent',
  },
};

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  currentStreak,
  longestStreak,
  totalTasks,
  habits,
  logs,
  monthlyConsistency,
}) => {
  const stats = {
    currentStreak,
    longestStreak,
    totalTasks,
    habits,
    logs,
    monthlyConsistency,
  };

  // Evaluate all achievements
  const evaluatedAchievements = ACHIEVEMENTS.map((ach) => {
    const result = ach.checkUnlocked(stats);
    return {
      ...ach,
      unlocked: result.unlocked,
      progress: result.progress,
    };
  });

  const unlockedCount = evaluatedAchievements.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const percentComplete = Math.round((unlockedCount / totalCount) * 100);

  const tiers: AchievementTier[] = ['LEGENDARY', 'EPIC', 'RARE', 'COMMON'];

  return (
    <div className="bg-[#0d0e15] border border-white/[0.08] rounded-xl p-6 shadow-xl w-full flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <h2 className="font-display text-xl font-bold text-white tracking-tight mb-1">
            Achievements
          </h2>
          <p className="text-xs text-zinc-400">
            {unlockedCount} / {totalCount} unlocked
          </p>
        </div>

        {/* Completion Badge */}
        <div className="bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-bold px-4 py-2 rounded-lg">
          {percentComplete}% Unlocked
        </div>
      </div>

      {/* Tier Sections */}
      <div className="space-y-8">
        {tiers.map((tier) => {
          const tierAchList = evaluatedAchievements.filter((a) => a.tier === tier);
          const tierUnlocked = tierAchList.filter((a) => a.unlocked).length;
          const config = TIER_CONFIG[tier];

          return (
            <div key={tier} className="space-y-4">
              {/* Tier Divider Line */}
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-bold tracking-wider ${config.colorClass}`}>
                  {config.label}
                </span>
                <div className={`h-[1px] flex-1 bg-gradient-to-r ${config.lineClass}`} />
                <span className="text-[11px] font-semibold text-zinc-500">
                  {tierUnlocked}/{tierAchList.length}
                </span>
              </div>

              {/* Achievements Grid for this Tier */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {tierAchList.map((ach) => {
                  return (
                    <div
                      key={ach.id}
                      className={`relative flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-200 group ${
                        ach.unlocked
                          ? 'bg-[#11121c] border-purple-500/30 shadow-md hover:border-purple-400'
                          : 'bg-[#08090f]/60 border-white/[0.04] opacity-40 hover:opacity-60'
                      }`}
                    >
                      {/* Unlocked Dot Indicator */}
                      {ach.unlocked && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400 shadow-sm" />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${
                          ach.unlocked
                            ? 'bg-purple-600 text-white shadow-sm border border-purple-400/30'
                            : 'bg-zinc-900 text-zinc-600 border border-white/[0.04]'
                        }`}
                      >
                        <IconRenderer name={ach.icon} className="w-5 h-5" />
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-xs font-bold mb-1 line-clamp-1 ${
                          ach.unlocked ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {ach.title}
                      </h4>

                      {/* Description */}
                      <p className="text-[10px] text-zinc-400 leading-tight line-clamp-2 mb-2">
                        {ach.description}
                      </p>

                      {/* Tier Tag */}
                      <span className="mt-auto text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        {ach.tier}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

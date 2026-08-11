import React from 'react';
import { Achievement, AchievementTier, Habit, HabitLogs } from '../types';
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
    colorClass: 'text-[#FE9677]',
    lineClass: 'from-[#FE9677] via-[#F64668]/50 to-transparent',
  },
  EPIC: {
    label: 'EPIC',
    colorClass: 'text-[#F64668]',
    lineClass: 'from-[#F64668] via-[#984063]/50 to-transparent',
  },
  RARE: {
    label: 'RARE',
    colorClass: 'text-[#984063]',
    lineClass: 'from-[#984063] via-[#41436A]/50 to-transparent',
  },
  COMMON: {
    label: 'COMMON',
    colorClass: 'text-indigo-300',
    lineClass: 'from-[#41436A] via-[#41436A]/40 to-transparent',
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
    <div className="bg-[#121324] border border-[#1e2038] rounded-2xl p-6 shadow-xl w-full flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1c1e36] pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide mb-1">
            Achievements
          </h2>
          <p className="text-xs text-gray-400">
            {unlockedCount} / {totalCount} unlocked
          </p>
        </div>

        {/* Overall Completion Percentage Badge */}
        <div className="bg-[#41436A]/30 border border-[#41436A] text-[#FE9677] text-xs font-bold px-4 py-2 rounded-xl shadow-inner">
          {percentComplete}% complete
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
                <span className={`text-xs font-extrabold tracking-widest ${config.colorClass}`}>
                  {config.label}
                </span>
                <div className={`h-[1px] flex-1 bg-gradient-to-r ${config.lineClass}`} />
                <span className="text-[11px] font-semibold text-gray-500">
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
                          ? 'bg-[#181a33] border-[#984063]/60 shadow-md shadow-[#984063]/10 hover:border-[#F64668]'
                          : 'bg-[#101120]/60 border-[#1a1c32] opacity-45 hover:opacity-65'
                      }`}
                    >
                      {/* Unlocked Dot Indicator */}
                      {ach.unlocked && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FE9677] shadow-sm shadow-[#FE9677]" />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                          ach.unlocked
                            ? 'bg-gradient-to-br from-indigo-600 via-[#984063] to-[#F64668] text-white shadow-md'
                            : 'bg-[#181a2e] text-gray-500'
                        }`}
                      >
                        <IconRenderer name={ach.icon} className="w-5 h-5" />
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-xs font-bold mb-1 line-clamp-1 ${
                          ach.unlocked ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {ach.title}
                      </h4>

                      {/* Description */}
                      <p className="text-[10px] text-gray-400 leading-tight line-clamp-2 mb-2">
                        {ach.description}
                      </p>

                      {/* Tier Tag */}
                      <span className="mt-auto text-[9px] font-extrabold uppercase tracking-wider text-gray-500">
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

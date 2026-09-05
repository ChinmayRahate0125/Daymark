import React from 'react';
import { Flame, Trophy, Activity, CheckCircle2 } from 'lucide-react';

interface StatCardsProps {
  currentStreak: number;
  longestStreak: number;
  monthlyConsistency: number;
  totalTasks: number;
}

export const StatCards: React.FC<StatCardsProps> = ({
  currentStreak,
  longestStreak,
  monthlyConsistency,
  totalTasks,
}) => {
  const stats = [
    {
      label: 'CURRENT STREAK',
      value: `${currentStreak}d`,
      subtitle: 'Active daily sequence',
      icon: Flame,
      highlight: true,
    },
    {
      label: 'LONGEST STREAK',
      value: `${longestStreak}d`,
      subtitle: 'Personal best streak',
      icon: Trophy,
      highlight: false,
    },
    {
      label: 'AVG CONSISTENCY',
      value: `${monthlyConsistency}%`,
      subtitle: 'This month rate',
      icon: Activity,
      highlight: false,
    },
    {
      label: 'TOTAL TASKS',
      value: `${totalTasks}`,
      subtitle: 'All-time completed',
      icon: CheckCircle2,
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            className={`relative bg-[#0d0e15] border border-white/[0.08] rounded-xl p-5 overflow-hidden transition-all duration-200 hover:border-purple-500/40 group ${
              stat.highlight ? 'border-purple-500/30' : ''
            }`}
          >
            {/* Header Row */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                {stat.label}
              </span>
              <div
                className={`p-1.5 rounded-lg border ${
                  stat.highlight
                    ? 'bg-purple-950/50 border-purple-500/30 text-purple-400'
                    : 'bg-zinc-900/60 border-white/[0.05] text-zinc-400'
                }`}
              >
                <IconComponent className="w-4 h-4 stroke-[1.75]" />
              </div>
            </div>

            {/* Main Value */}
            <div className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 group-hover:text-purple-200 transition-colors">
              {stat.value}
            </div>

            {/* Subtitle */}
            <p className="text-xs text-zinc-500 font-medium">
              {stat.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};

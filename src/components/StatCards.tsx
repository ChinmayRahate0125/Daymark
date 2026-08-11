import React from 'react';

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
      title: 'CURRENT STREAK',
      value: `${currentStreak}d`,
      subtitle: 'Keep it going 🔥',
      colorClass: 'text-[#FE9677]',
      borderLine: 'from-[#F64668] to-[#FE9677]',
      glow: 'shadow-[#F64668]/10',
    },
    {
      title: 'LONGEST STREAK',
      value: `${longestStreak}d`,
      subtitle: 'Personal best',
      colorClass: 'text-cyan-400',
      borderLine: 'from-cyan-400/80 to-[#41436A]',
      glow: 'shadow-cyan-500/5',
    },
    {
      title: 'AVG CONSISTENCY',
      value: `${monthlyConsistency}%`,
      subtitle: 'This month',
      colorClass: 'text-[#F64668]',
      borderLine: 'from-[#984063] to-[#F64668]',
      glow: 'shadow-[#984063]/10',
    },
    {
      title: 'TOTAL TASKS',
      value: `${totalTasks}`,
      subtitle: 'All time completed',
      colorClass: 'text-emerald-400',
      borderLine: 'from-emerald-400/80 to-[#41436A]',
      glow: 'shadow-emerald-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`relative bg-[#121324] border border-[#1e2038] rounded-2xl p-5 overflow-hidden shadow-lg ${stat.glow} transition-all duration-300 hover:border-[#41436A]`}
        >
          {/* Top colored gradient line accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.borderLine}`}
          />

          <h3 className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2">
            {stat.title}
          </h3>

          <div className={`text-3xl lg:text-4xl font-extrabold tracking-tight mb-1.5 ${stat.colorClass}`}>
            {stat.value}
          </div>

          <p className="text-xs text-gray-400 font-medium">
            {stat.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};

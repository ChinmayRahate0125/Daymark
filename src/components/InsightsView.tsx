import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Habit, HabitLogs } from '../types';
import {
  getDailyCompletionsForMonth,
  getSixMonthsOverview,
  MONTH_NAMES,
} from '../utils/habitUtils';
import { AchievementsGrid } from './AchievementsGrid';

interface InsightsViewProps {
  currentYear: number;
  currentMonth: number;
  habits: Habit[];
  logs: HabitLogs;
  currentStreak: number;
  longestStreak: number;
  totalTasks: number;
  monthlyConsistency: number;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  currentYear,
  currentMonth,
  habits,
  logs,
  currentStreak,
  longestStreak,
  totalTasks,
  monthlyConsistency,
}) => {
  const dailyData = getDailyCompletionsForMonth(currentYear, currentMonth, habits, logs);
  const sixMonths = getSixMonthsOverview(currentYear, currentMonth, habits, logs);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
          Insights & Analytics
        </h1>
        <p className="text-sm text-zinc-400">
          Your progress at a glance
        </p>
      </div>

      {/* Card 1: Daily Completions Bar Chart */}
      <div className="bg-[#0d0e15] border border-white/[0.08] rounded-xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-white tracking-tight">
            Daily Completions — {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </h2>
          <p className="text-xs text-zinc-400">Tasks completed per day</p>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: '#141522' }}
                contentStyle={{
                  backgroundColor: '#0d0e15',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f4f4f5',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.7)',
                }}
                formatter={(value: number, _name: string, props: { payload?: { totalActive?: number } }) => [
                  `${value} of ${props.payload?.totalActive || 0} active task(s)`,
                  'Completed',
                ]}
                labelFormatter={(label: number) =>
                  `${MONTH_NAMES[currentMonth - 1]} ${label}, ${currentYear}`
                }
              />
              <Bar
                dataKey="count"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card 2: Consistency Grid (6-Month Overview) */}
      <div className="bg-[#0d0e15] border border-white/[0.08] rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-white tracking-tight">
              Consistency Grid
            </h2>
            <p className="text-xs text-zinc-400">6-month overview</p>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#13141f] border border-white/[0.08]" />
              <span className="text-zinc-400">None</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-purple-950 border border-purple-700/50" />
              <span className="text-zinc-400">Partial</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-purple-600 border border-purple-400" />
              <span className="text-zinc-400">All Tasks</span>
            </div>
          </div>
        </div>

        {/* 6 Mini Month Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sixMonths.map((m) => (
            <div
              key={`${m.year}-${m.month}`}
              className="bg-[#090a10] border border-white/[0.06] hover:border-purple-500/30 transition-colors rounded-xl p-4 space-y-3"
            >
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                {m.shortMonthName} {m.year}
              </h3>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-zinc-500 font-semibold mb-1">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {m.days.map((d) => {
                  let bgStyle = 'bg-[#13141f] border border-white/[0.06] text-zinc-500';
                  if (d.status === 'partial') {
                    bgStyle = 'bg-purple-950/80 border border-purple-700/50 text-purple-300 font-bold';
                  } else if (d.status === 'all') {
                    bgStyle = 'bg-purple-600 text-white font-bold shadow-sm border border-purple-400/40';
                  }

                  return (
                    <div
                      key={d.dateKey}
                      title={`${m.monthName} ${d.day}, ${m.year}: ${d.doneCount} task(s) completed`}
                      className={`h-7 rounded flex items-center justify-center text-[10px] transition-colors ${bgStyle}`}
                    >
                      {d.day}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Achievements Grid */}
      <AchievementsGrid
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        totalTasks={totalTasks}
        habits={habits}
        logs={logs}
        monthlyConsistency={monthlyConsistency}
      />
    </div>
  );
};

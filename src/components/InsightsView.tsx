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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
          Insights
        </h1>
        <p className="text-sm text-gray-400">Your progress at a glance</p>
      </div>

      {/* Card 1: Daily Completions Bar Chart */}
      <div className="bg-[#121324] border border-[#1e2038] rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            Daily Completions — {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </h2>
          <p className="text-xs text-gray-400">Tasks completed per day</p>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: '#1a1c32' }}
                contentStyle={{
                  backgroundColor: '#16172b',
                  borderColor: '#41436A',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
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
                fill="#F64668"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card 2: Consistency Grid (6-Month Overview) */}
      <div className="bg-[#121324] border border-[#1e2038] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Consistency Grid</h2>
            <p className="text-xs text-gray-400">6-month overview</p>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#18192c] border border-[#232644]" />
              <span className="text-gray-400">None</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#984063]" />
              <span className="text-gray-400">Partial</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#F64668]" />
              <span className="text-gray-400">All Tasks</span>
            </div>
          </div>
        </div>

        {/* 6 Mini Month Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sixMonths.map((m) => (
            <div
              key={`${m.year}-${m.month}`}
              className="bg-[#18192d] border border-[#222544] hover:border-[#41436A] transition-colors rounded-xl p-4 space-y-3"
            >
              <h3 className="text-sm font-bold text-gray-200">
                {m.shortMonthName} {m.year}
              </h3>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-500 font-semibold mb-1">
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
                  let bgStyle = 'bg-[#121324] border border-[#222544] text-gray-500';
                  if (d.status === 'partial') {
                    bgStyle = 'bg-[#984063] text-white font-bold shadow-sm';
                  } else if (d.status === 'all') {
                    bgStyle = 'bg-[#F64668] text-white font-bold shadow-sm';
                  }

                  return (
                    <div
                      key={d.dateKey}
                      title={`${m.monthName} ${d.day}, ${m.year}: ${d.doneCount} task(s) completed`}
                      className={`h-7 rounded-md flex items-center justify-center text-[10px] font-medium transition-colors ${bgStyle}`}
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

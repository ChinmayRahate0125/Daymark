import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Archive, Settings, Check } from 'lucide-react';
import { Habit, HabitLogs, CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { IconRenderer } from './IconRenderer';
import {
  getMonthDaysArray,
  MONTH_NAMES,
  formatDateKey,
  getDaysInMonth,
  getHabitDateKey,
  isHabitActiveOnDate,
} from '../utils/habitUtils';

interface HabitMatrixProps {
  currentYear: number;
  currentMonth: number;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  habits: Habit[];
  logs: HabitLogs;
  onToggleCell: (habitId: string, dateKey: string) => void;
  onArchiveHabit: (habitId: string) => void;
  onManageHabit: (habit: Habit) => void;
  onOpenAddModal: () => void;
  onOpenArchivedModal?: () => void;
}

export const HabitMatrix: React.FC<HabitMatrixProps> = ({
  currentYear,
  currentMonth,
  onNavigateMonth,
  habits,
  logs,
  onToggleCell,
  onArchiveHabit,
  onManageHabit,
  onOpenAddModal,
  onOpenArchivedModal,
}) => {
  const daysInMonth = getMonthDaysArray(currentYear, currentMonth);

  // Today's key
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  // Filter ONLY active habits for the viewed month
  const endOfMonth = formatDateKey(currentYear, currentMonth, getDaysInMonth(currentYear, currentMonth));

  const activeHabits = habits.filter((h) => {
    if (h.archivedAt) return false;
    const createdKey = getHabitDateKey(h.createdAt);
    if (createdKey > endOfMonth) return false;
    return true;
  });

  const archivedCount = habits.filter((h) => !!h.archivedAt).length;

  return (
    <div className="bg-[#0d0e15] border border-white/[0.08] rounded-xl p-4 sm:p-6 shadow-xl w-full flex flex-col space-y-6">
      {/* Month Navigation & Action Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        {/* Month Picker */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-1 bg-[#13141f] p-1 rounded-lg border border-white/[0.08]">
            <button
              onClick={() => onNavigateMonth('prev')}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.75]" />
            </button>
            <button
              onClick={() => onNavigateMonth('next')}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>

          <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
            {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </h2>
        </div>

        {/* Action Buttons: Archived & Add Habit */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
          {archivedCount > 0 && (
            <button
              onClick={onOpenArchivedModal}
              className="flex items-center space-x-2 bg-[#13141f] hover:bg-[#181a29] text-zinc-300 hover:text-white border border-white/[0.08] text-xs px-3.5 py-2 rounded-lg transition-all font-medium"
              title="View Archived Habits"
            >
              <Archive className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="hidden sm:inline">Archived</span>
              <span className="bg-purple-950 text-purple-300 text-[10px] px-1.5 py-0.2 rounded font-bold border border-purple-500/30">
                {archivedCount}
              </span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Habit Grid */}
      <div className="w-full relative overflow-x-auto pb-2">
        <div className="flex flex-col space-y-1.5 relative z-10 min-w-[700px]">
          {/* Header Row: Days of Week and Day Numbers */}
          <div className="flex items-center pb-2 border-b border-white/[0.04]">
            {/* Left Header Spacer for Habit Title */}
            <div className="w-36 sm:w-48 md:w-56 shrink-0 pr-2 sm:pr-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Habits
              </span>
            </div>

            {/* Day Columns Header */}
            <div className="flex-1 min-w-0 flex items-center justify-between">
              {daysInMonth.map(({ dayNumber, dayLetter, dateKey }, idx) => {
                const isToday = dateKey === todayKey;
                const isWeekEnd = (idx + 1) % 7 === 0 && idx < daysInMonth.length - 1;

                return (
                  <div
                    key={dateKey}
                    className={`flex-1 flex flex-col items-center justify-center min-w-0 ${
                      isWeekEnd ? 'mr-1 sm:mr-1.5' : ''
                    }`}
                  >
                    <span className="text-[9px] font-semibold text-zinc-500 uppercase mb-0.5 select-none">
                      {dayLetter}
                    </span>
                    <span
                      className={`text-xs font-semibold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded transition-colors select-none ${
                        isToday
                          ? 'bg-purple-600 text-white font-bold shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {dayNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habit Rows List */}
          <div className="space-y-1 pt-1">
            {activeHabits.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs border border-dashed border-white/[0.08] rounded-xl bg-[#090a10]">
                No active habits for this month. Click &quot;Add Task&quot; above to create a habit!
              </div>
            ) : (
              activeHabits.map((habit) => {
                const catInfo = CATEGORIES[habit.category] || CATEGORIES.Personal;

                return (
                  <div
                    key={habit.id}
                    className="flex items-center group/row p-1 sm:p-1.5 rounded-lg hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/[0.04]"
                  >
                    {/* Habit Info Left Column */}
                    <div className="w-36 sm:w-48 md:w-56 shrink-0 flex items-center justify-between pr-2 sm:pr-4 min-w-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden min-w-0">
                        {/* Category Box */}
                        <div
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center shrink-0 border shadow-sm transition-colors"
                          style={{ backgroundColor: `${catInfo.bgHex}38`, borderColor: `${catInfo.bgHex}80` }}
                          title={`Category: ${catInfo.label}`}
                        >
                          <IconRenderer name={habit.icon || catInfo.iconName} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.2]" />
                        </div>
                        {/* Habit Title */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-zinc-200 truncate group-hover/row:text-white transition-colors">
                            {habit.title}
                          </span>
                        </div>
                      </div>

                      {/* Manage & Archive Buttons */}
                      <div className="opacity-0 group-hover/row:opacity-100 flex items-center space-x-0.5 transition-opacity shrink-0 ml-1">
                        <button
                          onClick={() => onManageHabit(habit)}
                          className="text-zinc-500 hover:text-purple-300 p-1 rounded hover:bg-white/[0.06] transition-colors"
                          title="Edit or Replace Habit"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onArchiveHabit(habit.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-white/[0.06] transition-colors"
                          title="Archive Habit"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Day Completion Grid Cells */}
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      {daysInMonth.map(({ dateKey }, idx) => {
                        const isActive = isHabitActiveOnDate(habit, dateKey);
                        const isCompleted = !!logs[dateKey]?.[habit.id];
                        const isWeekEnd = (idx + 1) % 7 === 0 && idx < daysInMonth.length - 1;

                        return (
                          <div
                            key={dateKey}
                            className={`flex-1 flex items-center justify-center min-w-0 ${
                              isWeekEnd ? 'mr-1 sm:mr-1.5' : ''
                            }`}
                          >
                            {isActive ? (
                              <button
                                onClick={() => onToggleCell(habit.id, dateKey)}
                                title={`${habit.title} — ${dateKey} (${isCompleted ? 'Completed' : 'Incomplete'})`}
                                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-150 transform hover:scale-105 active:scale-95 cursor-pointer ${
                                  isCompleted
                                    ? 'bg-purple-600 border border-purple-400/40 text-white shadow-sm'
                                    : 'bg-[#13141f] hover:bg-[#1a1c2b] border border-white/[0.1] hover:border-purple-500/40'
                                }`}
                              >
                                {isCompleted && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />}
                              </button>
                            ) : (
                              <div
                                title={`${habit.title} - Created on ${getHabitDateKey(habit.createdAt)}`}
                                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center bg-[#090a10]/50 border border-white/[0.02] cursor-not-allowed select-none"
                              >
                                <span className="text-[8px] text-zinc-700/60">•</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Category Legend */}
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/[0.06]">
        <span className="text-xs font-medium text-zinc-400">Categories</span>
        {(Object.keys(CATEGORIES) as CategoryId[]).map((catKey) => {
          const cat = CATEGORIES[catKey];
          return (
            <div key={catKey} className="flex items-center space-x-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.bgHex }}
              />
              <span className="text-xs text-zinc-400">{cat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
    // Archived habits must NEVER appear in the main active habit tracker
    if (h.archivedAt) return false;

    const createdKey = getHabitDateKey(h.createdAt);
    if (createdKey > endOfMonth) return false;

    return true;
  });

  const archivedCount = habits.filter((h) => !!h.archivedAt).length;

  return (
    <div className="bg-[#121324] border border-[#1e2038] rounded-2xl p-4 sm:p-6 shadow-xl w-full flex flex-col space-y-6">
      {/* Month Navigation & Action Buttons Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Month Picker */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigateMonth('prev')}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f213a] transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </h2>
          <button
            onClick={() => onNavigateMonth('next')}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f213a] transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons: Archived & Add Task */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {archivedCount > 0 && (
            <button
              onClick={onOpenArchivedModal}
              className="flex items-center space-x-2 bg-[#181a2e] hover:bg-[#222543] text-gray-300 hover:text-white border border-[#232644] font-medium px-3.5 py-2.5 rounded-xl transition-all text-xs sm:text-sm"
              title="View Archived Habits in Settings"
            >
              <Archive className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Archived</span>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                {archivedCount}
              </span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-[#984063] to-[#F64668] hover:opacity-95 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-[#F64668]/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Continuous Calendar Grid */}
      <div className="w-full relative">
        {/* Continuous 1px Vertical Weekly Separator Lines Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-stretch">
          {/* Left spacer matching habit info column */}
          <div className="w-32 sm:w-44 md:w-52 shrink-0 pr-2 sm:pr-4" />

          {/* Right side container matching day columns flex row */}
          <div className="flex-1 min-w-0 flex items-stretch justify-between">
            {daysInMonth.map(({ dateKey }, idx) => {
              const isWeekEnd = (idx + 1) % 7 === 0 && idx < daysInMonth.length - 1;
              return (
                <div
                  key={`sep-${dateKey}`}
                  className={`flex-1 min-w-0 relative ${isWeekEnd ? 'mr-1 sm:mr-2' : ''}`}
                >
                  {isWeekEnd && (
                    <div className="absolute top-0 bottom-0 -right-[2.5px] sm:-right-[4.5px] w-[1px] bg-[#2A2D4A]/60" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col space-y-2 relative z-10">
          {/* Header Row: Days of Week and Day Numbers */}
          <div className="flex items-center pb-1">
            {/* Left Header Spacer for Habit Names */}
            <div className="w-32 sm:w-44 md:w-52 shrink-0 pr-2 sm:pr-4" />

            {/* Day Columns Grid - ONE continuous row */}
            <div className="flex-1 min-w-0 flex items-center justify-between">
              {daysInMonth.map(({ dayNumber, dayLetter, dateKey }, idx) => {
                const isToday = dateKey === todayKey;
                const isWeekEnd = (idx + 1) % 7 === 0 && idx < daysInMonth.length - 1;

                return (
                  <div
                    key={dateKey}
                    className={`flex-1 flex flex-col items-center justify-center min-w-0 ${
                      isWeekEnd ? 'mr-1 sm:mr-2' : ''
                    }`}
                  >
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-gray-500 uppercase mb-0.5 select-none">
                      {dayLetter}
                    </span>
                    <span
                      className={`text-[9px] sm:text-[10px] md:text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 max-w-full flex items-center justify-center rounded-sm sm:rounded-md transition-colors select-none ${
                        isToday
                          ? 'bg-gradient-to-tr from-indigo-600 to-[#984063] text-white font-bold shadow-md shadow-[#F64668]/20 ring-1 sm:ring-2 ring-[#FE9677]/40'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {dayNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habit Rows */}
          <div className="space-y-2">
            {activeHabits.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border border-dashed border-[#222542] rounded-xl">
                No active habits for this month. Click &quot;Add Task&quot; above to create a habit!
              </div>
            ) : (
              activeHabits.map((habit) => {
                const catInfo = CATEGORIES[habit.category] || CATEGORIES.Personal;

                return (
                  <div
                    key={habit.id}
                    className="flex items-center group/row p-1 sm:p-1.5 rounded-xl hover:bg-[#18192f]/50 transition-colors"
                  >
                    {/* Habit Info Left Column */}
                    <div className="w-32 sm:w-44 md:w-52 shrink-0 flex items-center justify-between pr-2 sm:pr-4 min-w-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden min-w-0">
                        {/* Category Colored Icon Box */}
                        <div
                          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 text-white"
                          style={{ backgroundColor: catInfo.bgHex }}
                        >
                          <IconRenderer name={habit.icon || catInfo.iconName} className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                        </div>
                        {/* Habit Title */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-200 truncate group-hover/row:text-white">
                            {habit.title}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Edit / Replace / Archive */}
                      <div className="opacity-0 group-hover/row:opacity-100 flex items-center space-x-1 transition-all shrink-0 ml-1">
                        <button
                          onClick={() => onManageHabit(habit)}
                          className="text-gray-500 hover:text-indigo-300 p-1 rounded hover:bg-[#20223f] transition-all"
                          title="Edit or Replace Habit"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onArchiveHabit(habit.id)}
                          className="text-gray-500 hover:text-rose-400 p-1 rounded hover:bg-[#20223f] transition-all"
                          title="Archive Habit (Hide from tracker, preserve history)"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Day Cells Right Columns - ONE continuous row */}
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      {daysInMonth.map(({ dateKey }, idx) => {
                        const isActive = isHabitActiveOnDate(habit, dateKey);
                        const isCompleted = !!logs[dateKey]?.[habit.id];
                        const isWeekEnd = (idx + 1) % 7 === 0 && idx < daysInMonth.length - 1;

                        return (
                          <div
                            key={dateKey}
                            className={`flex-1 flex items-center justify-center min-w-0 ${
                              isWeekEnd ? 'mr-1 sm:mr-2' : ''
                            }`}
                          >
                            {isActive ? (
                              <button
                                onClick={() => onToggleCell(habit.id, dateKey)}
                                title={`${habit.title} - ${dateKey} (${isCompleted ? 'Completed' : 'Incomplete'})`}
                                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 max-w-full rounded-sm sm:rounded-md flex items-center justify-center transition-all duration-150 transform hover:scale-105 active:scale-95 ${
                                  isCompleted
                                    ? 'bg-[#F64668] shadow-sm text-white font-bold'
                                    : 'bg-[#181a2e] hover:bg-[#252848] border border-[#232644]'
                                }`}
                              >
                                {isCompleted && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-white stroke-[3]" />}
                              </button>
                            ) : (
                              <div
                                title={`${habit.title} - Created on ${getHabitDateKey(habit.createdAt)}`}
                                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 max-w-full rounded-sm sm:rounded-md flex items-center justify-center bg-[#10111d]/40 border border-[#1a1c32]/30 text-gray-700 cursor-not-allowed select-none"
                              >
                                <span className="text-[10px] text-gray-700/60 font-bold">•</span>
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
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#1a1c32]">
        {(Object.keys(CATEGORIES) as CategoryId[]).map((catKey) => {
          const cat = CATEGORIES[catKey];
          return (
            <div key={catKey} className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${cat.dotColor}`} />
              <span className="text-xs font-medium text-gray-400">{cat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

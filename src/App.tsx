/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Habit, HabitLogs, NavigationTab, CategoryId } from './types';
import { INITIAL_HABITS, INITIAL_LOGS } from './data/initialData';
import {
  calculateStreaks,
  calculateTotalTasks,
  calculateMonthlyConsistency,
  formatDateKey,
} from './utils/habitUtils';
import { Sidebar } from './components/Sidebar';
import { StatCards } from './components/StatCards';
import { HabitMatrix } from './components/HabitMatrix';
import { AddTaskModal } from './components/AddTaskModal';
import { EditHabitModal } from './components/EditHabitModal';
import { ArchivedHabitsModal } from './components/ArchivedHabitsModal';
import { InsightsView } from './components/InsightsView';

const STORAGE_KEY_HABITS = 'daymark_habits_v1';
const STORAGE_KEY_LOGS = 'daymark_logs_v1';
const LEGACY_STORAGE_KEY_HABITS = 'habit_tracker_habits_v1';
const LEGACY_STORAGE_KEY_LOGS = 'habit_tracker_logs_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState<boolean>(false);

  // Management modal state
  const [selectedHabitToManage, setSelectedHabitToManage] = useState<Habit | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Initialize habits state with local storage fallback
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HABITS) || localStorage.getItem(LEGACY_STORAGE_KEY_HABITS);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error('Failed to load habits from localStorage:', err);
    }
    return INITIAL_HABITS;
  });

  // Initialize logs state with local storage fallback
  const [logs, setLogs] = useState<HabitLogs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS) || localStorage.getItem(LEGACY_STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error('Failed to load logs from localStorage:', err);
    }
    return INITIAL_LOGS;
  });

  // Save habits & logs to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    } catch (err) {
      console.error('Failed to save habits:', err);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (err) {
      console.error('Failed to save logs:', err);
    }
  }, [logs]);

  // Derived statistics (calculated based on active habits on each date)
  const { currentStreak, longestStreak } = calculateStreaks(habits, logs);
  const totalTasks = calculateTotalTasks(logs);
  const monthlyConsistency = calculateMonthlyConsistency(currentYear, currentMonth, habits, logs);

  // Month navigation
  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  };

  // Toggle cell completion
  const handleToggleCell = (habitId: string, dateKey: string) => {
    setLogs((prevLogs) => {
      const dayLog = prevLogs[dateKey] ? { ...prevLogs[dateKey] } : {};
      dayLog[habitId] = !dayLog[habitId];

      const newLogs = { ...prevLogs, [dateKey]: dayLog };
      // Clean up empty objects
      if (Object.values(dayLog).every((v) => !v)) {
        delete newLogs[dateKey];
      }
      return newLogs;
    });
  };

  // Add new habit starting from today
  const handleAddHabit = (title: string, category: CategoryId, icon: string) => {
    const todayStr = formatDateKey(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
    const newHabit: Habit = {
      id: `h_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      category,
      icon,
      createdAt: todayStr,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  // Edit existing habit details in-place (preserves habit ID and full history)
  const handleEditHabit = (habitId: string, title: string, category: CategoryId, icon: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, title, category, icon } : h
      )
    );
  };

  // Replace habit: archives old habit today (keeping past records intact) and creates new habit with new ID starting today
  const handleReplaceHabit = (oldHabitId: string, title: string, category: CategoryId, icon: string) => {
    const todayStr = formatDateKey(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());

    setHabits((prev) => {
      const updated = prev.map((h) =>
        h.id === oldHabitId ? { ...h, archivedAt: todayStr } : h
      );

      const newHabit: Habit = {
        id: `h_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title,
        category,
        icon,
        createdAt: todayStr,
      };

      return [...updated, newHabit];
    });
  };

  // Archive habit (removes from active list while strictly preserving historical completion records)
  const handleArchiveHabit = (habitId: string) => {
    const todayStr = formatDateKey(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, archivedAt: todayStr } : h
      )
    );
  };

  // Unarchive habit (restores habit to active tracker preserving all history)
  const handleUnarchiveHabit = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, archivedAt: null } : h
      )
    );
  };

  // Open manage/edit modal
  const handleOpenManageModal = (habit: Habit) => {
    setSelectedHabitToManage(habit);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex bg-[#06070a] bg-tech-grid text-zinc-100 min-h-screen font-sans antialiased selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStreak={currentStreak}
        onOpenArchivedModal={() => setIsArchivedModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto max-w-[1600px] mx-auto z-10">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8 w-full">
            {/* Header */}
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                Daymark Habit Tracker
              </h1>
              <p className="text-sm text-zinc-400">Track your daily progress</p>
            </div>

            {/* Top Stat Cards */}
            <StatCards
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              monthlyConsistency={monthlyConsistency}
              totalTasks={totalTasks}
            />

            {/* Main Habit Matrix */}
            <HabitMatrix
              currentYear={currentYear}
              currentMonth={currentMonth}
              onNavigateMonth={handleNavigateMonth}
              habits={habits}
              logs={logs}
              onToggleCell={handleToggleCell}
              onArchiveHabit={handleArchiveHabit}
              onManageHabit={handleOpenManageModal}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenArchivedModal={() => setIsArchivedModalOpen(true)}
            />
          </div>
        ) : (
          /* Insights View */
          <InsightsView
            currentYear={currentYear}
            currentMonth={currentMonth}
            habits={habits}
            logs={logs}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            totalTasks={totalTasks}
            monthlyConsistency={monthlyConsistency}
          />
        )}
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={handleAddHabit}
      />

      {/* Edit / Replace / Archive Modal */}
      <EditHabitModal
        isOpen={isEditModalOpen}
        habit={selectedHabitToManage}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHabitToManage(null);
        }}
        onEditHabit={handleEditHabit}
        onReplaceHabit={handleReplaceHabit}
        onArchiveHabit={handleArchiveHabit}
      />

      {/* Archived Habits Modal */}
      <ArchivedHabitsModal
        isOpen={isArchivedModalOpen}
        onClose={() => setIsArchivedModalOpen(false)}
        archivedHabits={habits.filter((h) => !!h.archivedAt)}
        onUnarchiveHabit={handleUnarchiveHabit}
      />
    </div>
  );
}

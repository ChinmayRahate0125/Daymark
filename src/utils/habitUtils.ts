import { Habit, HabitLogs } from '../types';

export function formatDateKey(year: number, month: number, day: number): string {
  const m = month.toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return { year, month, day };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function getDayOfWeekLetter(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  const dayIndex = date.getDay(); // 0 is Sun, 1 is Mon, ...
  const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return letters[dayIndex];
}

export function getMonthDaysArray(year: number, month: number) {
  const count = getDaysInMonth(year, month);
  const days = [];
  for (let i = 1; i <= count; i++) {
    days.push({
      dayNumber: i,
      dayLetter: getDayOfWeekLetter(year, month, i),
      dateKey: formatDateKey(year, month, i),
    });
  }
  return days;
}

export interface DayInfo {
  dayNumber: number;
  dayLetter: string;
  dateKey: string;
}

export interface WeekGroup {
  weekIndex: number;
  days: DayInfo[];
}

export function getCalendarWeekGroups(year: number, month: number): WeekGroup[] {
  const allDays = getMonthDaysArray(year, month);
  const weekGroups: WeekGroup[] = [];
  let currentWeekDays: DayInfo[] = [];

  allDays.forEach((dayInfo) => {
    const { year: y, month: m, day: d } = parseDateKey(dayInfo.dateKey);
    const date = new Date(y, m - 1, d);
    const dayOfWeek = date.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
    const monIndex = (dayOfWeek + 6) % 7;

    if (monIndex === 0 && currentWeekDays.length > 0) {
      weekGroups.push({
        weekIndex: weekGroups.length,
        days: currentWeekDays,
      });
      currentWeekDays = [];
    }

    currentWeekDays.push(dayInfo);
  });

  if (currentWeekDays.length > 0) {
    weekGroups.push({
      weekIndex: weekGroups.length,
      days: currentWeekDays,
    });
  }

  return weekGroups;
}

export function getHabitDateKey(dateStr?: string | null): string {
  if (!dateStr) return '1970-01-01';
  return dateStr.slice(0, 10);
}

export function isHabitActiveOnDate(habit: Habit, dateKey: string): boolean {
  const createdDateKey = getHabitDateKey(habit.createdAt);
  if (createdDateKey && dateKey < createdDateKey) {
    return false;
  }
  if (habit.archivedAt) {
    const archivedDateKey = getHabitDateKey(habit.archivedAt);
    if (archivedDateKey && dateKey > archivedDateKey) {
      return false;
    }
  }
  return true;
}

export function getActiveHabitsForDate(habits: Habit[], dateKey: string): Habit[] {
  return habits.filter((h) => isHabitActiveOnDate(h, dateKey));
}

export function getDailyStatsForDate(dateKey: string, habits: Habit[], logs: HabitLogs) {
  const activeHabits = getActiveHabitsForDate(habits, dateKey);
  const totalActive = activeHabits.length;
  const dayLog = logs[dateKey] || {};

  let completedCount = 0;
  activeHabits.forEach((h) => {
    if (dayLog[h.id]) {
      completedCount++;
    }
  });

  const rate = totalActive > 0 ? completedCount / totalActive : 0;
  const percentage = Math.round(rate * 100);
  const is100Percent = totalActive > 0 && completedCount === totalActive;

  return {
    dateKey,
    activeHabits,
    totalActive,
    completedCount,
    rate,
    percentage,
    is100Percent,
  };
}

export function calculateTotalTasks(logs: HabitLogs): number {
  let total = 0;
  Object.values(logs).forEach((dayMap) => {
    Object.values(dayMap).forEach((isDone) => {
      if (isDone) total++;
    });
  });
  return total;
}

export function calculateStreaks(habits: Habit[], logs: HabitLogs) {
  const allLogDates = Object.keys(logs);
  
  if (allLogDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // A day counts as completed if AT LEAST ONE habit is marked completed on that date
  const completedDates = allLogDates
    .filter((dateKey) => {
      const dayLog = logs[dateKey];
      if (!dayLog) return false;
      return Object.values(dayLog).some((isDone) => isDone === true);
    })
    .sort();

  if (completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Convert date keys to UTC midnight timestamps for safe day-difference calculations
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const timestamps = completedDates.map((d) => {
    const { year, month, day } = parseDateKey(d);
    return Date.UTC(year, month - 1, day);
  });

  // Calculate Longest Streak across all history
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < timestamps.length; i++) {
    const diffDays = Math.round((timestamps[i] - timestamps[i - 1]) / ONE_DAY_MS);
    if (diffDays === 1) {
      tempStreak++;
    } else if (diffDays > 1) {
      tempStreak = 1;
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // Calculate Current Streak counting backward from today / yesterday
  const today = new Date();
  const todayMs = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayMs = todayMs - ONE_DAY_MS;

  const lastActiveMs = timestamps[timestamps.length - 1];
  let currentStreak = 0;

  if (lastActiveMs === todayMs || lastActiveMs === yesterdayMs) {
    currentStreak = 1;
    for (let i = timestamps.length - 1; i > 0; i--) {
      const diffDays = Math.round((timestamps[i] - timestamps[i - 1]) / ONE_DAY_MS);
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}

export function calculateMonthlyConsistency(year: number, month: number, habits: Habit[], logs: HabitLogs): number {
  const daysInMonthCount = getDaysInMonth(year, month);
  let totalPossible = 0;
  let totalCompleted = 0;

  for (let day = 1; day <= daysInMonthCount; day++) {
    const key = formatDateKey(year, month, day);
    const stats = getDailyStatsForDate(key, habits, logs);
    totalPossible += stats.totalActive;
    totalCompleted += stats.completedCount;
  }

  if (totalPossible === 0) return 0;
  const percentage = Math.round((totalCompleted / totalPossible) * 100);
  return isNaN(percentage) ? 0 : percentage;
}

export function getDailyCompletionsForMonth(year: number, month: number, habits: Habit[], logs: HabitLogs) {
  const daysCount = getDaysInMonth(year, month);
  const data = [];
  for (let d = 1; d <= daysCount; d++) {
    const key = formatDateKey(year, month, d);
    const stats = getDailyStatsForDate(key, habits, logs);
    data.push({
      day: d,
      dateKey: key,
      count: stats.completedCount,
      totalActive: stats.totalActive,
      percentage: stats.percentage,
      is100Percent: stats.is100Percent,
    });
  }
  return data;
}

export function getSixMonthsOverview(currentYear: number, currentMonth: number, habits: Habit[], logs: HabitLogs) {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    let m = currentMonth - i;
    let y = currentYear;
    if (m <= 0) {
      m += 12;
      y -= 1;
    }

    const daysInM = getDaysInMonth(y, m);
    const days = [];
    for (let d = 1; d <= daysInM; d++) {
      const key = formatDateKey(y, m, d);
      const stats = getDailyStatsForDate(key, habits, logs);

      let status: 'none' | 'partial' | 'all' = 'none';
      if (stats.completedCount > 0) {
        if (stats.totalActive > 0 && stats.completedCount >= stats.totalActive) {
          status = 'all';
        } else {
          status = 'partial';
        }
      }

      days.push({
        day: d,
        dateKey: key,
        doneCount: stats.completedCount,
        totalActive: stats.totalActive,
        status,
        dayLetter: getDayOfWeekLetter(y, m, d),
      });
    }

    months.push({
      year: y,
      month: m,
      monthName: MONTH_NAMES[m - 1],
      shortMonthName: MONTH_NAMES[m - 1].slice(0, 3),
      days,
    });
  }
  return months;
}

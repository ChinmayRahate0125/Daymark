import { Habit, HabitLogs } from '../types';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h1',
    title: 'Morning run',
    category: 'Fitness',
    icon: 'Zap',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'h2',
    title: 'Read 30 mins',
    category: 'Learn',
    icon: 'BookOpen',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'h3',
    title: 'Practice guitar',
    category: 'Skill',
    icon: 'Gem',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'h4',
    title: 'Journaling',
    category: 'Personal',
    icon: 'Sparkles',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'h5',
    title: 'Coding practice',
    category: 'Skill',
    icon: 'Code',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'h6',
    title: 'Stretch & yoga',
    category: 'Fitness',
    icon: 'Zap',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
];

export const INITIAL_LOGS: HabitLogs = {
  '2026-08-08': {
    'h1': true,
  },
};

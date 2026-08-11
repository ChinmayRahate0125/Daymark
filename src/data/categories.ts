import { CategoryId, CategoryInfo } from '../types';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  Learn: {
    id: 'Learn',
    label: 'Learn',
    color: 'text-cyan-400',
    bgHex: '#06b6d4',
    borderHex: '#0891b2',
    dotColor: 'bg-cyan-400',
    iconName: 'BookOpen',
  },
  Fitness: {
    id: 'Fitness',
    label: 'Fitness',
    color: 'text-orange-400',
    bgHex: '#f97316',
    borderHex: '#ea580c',
    dotColor: 'bg-orange-400',
    iconName: 'Zap',
  },
  Personal: {
    id: 'Personal',
    label: 'Personal',
    color: 'text-purple-400',
    bgHex: '#a855f7',
    borderHex: '#9333ea',
    dotColor: 'bg-purple-400',
    iconName: 'Sparkles',
  },
  Skill: {
    id: 'Skill',
    label: 'Skill',
    color: 'text-emerald-400',
    bgHex: '#10b981',
    borderHex: '#059669',
    dotColor: 'bg-emerald-400',
    iconName: 'Gem',
  },
};

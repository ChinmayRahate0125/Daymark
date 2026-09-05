import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { IconRenderer } from './IconRenderer';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (title: string, category: CategoryId, icon: string) => void;
}

const AVAILABLE_ICONS = [
  'Zap',
  'BookOpen',
  'Gem',
  'Sparkles',
  'Code',
  'Music',
  'Dumbbell',
  'Heart',
  'Flame',
  'Target',
  'Coffee',
  'Moon',
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('Fitness');
  const [selectedIcon, setSelectedIcon] = useState('Zap');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddHabit(title.trim(), category, selectedIcon);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0d0e15] border border-white/[0.1] rounded-xl w-full max-w-md p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-display text-base font-bold text-white">Add New Habit</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Habit Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Read 30 mins, Morning Run..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#13141f] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-sans transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(CATEGORIES) as CategoryId[]).map((catKey) => {
                const cat = CATEGORIES[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setCategory(catKey);
                      setSelectedIcon(cat.iconName);
                    }}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-500/50 bg-purple-950/50 text-white font-semibold shadow-sm'
                        : 'border-white/[0.08] bg-[#13141f] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.bgHex }}
                    />
                    <span className="text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Choose Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((iconName) => {
                const isSelected = selectedIcon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-2.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-400 bg-purple-600 text-white shadow-sm'
                        : 'border-white/[0.08] bg-[#13141f] text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <IconRenderer name={iconName} className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/30 transition-all cursor-pointer shadow-sm"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

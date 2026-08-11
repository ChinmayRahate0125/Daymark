import React, { useState, useEffect } from 'react';
import { X, Edit3, RefreshCw, Archive, AlertCircle } from 'lucide-react';
import { Habit, CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { IconRenderer } from './IconRenderer';

interface EditHabitModalProps {
  isOpen: boolean;
  habit: Habit | null;
  onClose: () => void;
  onEditHabit: (habitId: string, title: string, category: CategoryId, icon: string) => void;
  onReplaceHabit: (oldHabitId: string, title: string, category: CategoryId, icon: string) => void;
  onArchiveHabit: (habitId: string) => void;
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

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  isOpen,
  habit,
  onClose,
  onEditHabit,
  onReplaceHabit,
  onArchiveHabit,
}) => {
  const [mode, setMode] = useState<'edit' | 'replace'>('edit');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('Fitness');
  const [selectedIcon, setSelectedIcon] = useState('Zap');

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setCategory(habit.category);
      setSelectedIcon(habit.icon || 'Zap');
      setMode('edit');
    }
  }, [habit]);

  if (!isOpen || !habit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === 'edit') {
      // Edit in place: preserves habit ID and all past history
      onEditHabit(habit.id, title.trim(), category, selectedIcon);
    } else {
      // Replace habit: archives current habit today and creates new habit with new ID
      onReplaceHabit(habit.id, title.trim(), category, selectedIcon);
    }
    onClose();
  };

  const handleArchive = () => {
    onArchiveHabit(habit.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121324] border border-[#222544] rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f223f] mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Manage Habit</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f223f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#181a2e] rounded-xl border border-[#232644] mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg transition-all ${
              mode === 'edit'
                ? 'bg-gradient-to-r from-indigo-600 to-[#984063] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('replace')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg transition-all ${
              mode === 'replace'
                ? 'bg-gradient-to-r from-[#984063] to-[#F64668] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Replace Habit</span>
          </button>
        </div>

        {/* Mode Explanatory Banner */}
        {mode === 'edit' ? (
          <div className="flex items-start space-x-2 p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-indigo-300 text-xs mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Edit Details:</strong> Renames or updates this habit while preserving 100% of its past completion history under the same habit ID.
            </span>
          </div>
        ) : (
          <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Replace Habit:</strong> Archives the current habit as of today (keeping its full history intact) and creates a new habit starting today with a new unique ID.
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Habit Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Read 30 mins, Morning Run..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#181a2e] border border-[#232644] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F64668] focus:ring-1 focus:ring-[#F64668] transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
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
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#984063] bg-[#984063]/20 text-white font-semibold shadow-sm'
                        : 'border-[#232644] bg-[#181a2e] text-gray-400 hover:text-gray-200 hover:border-[#41436A]'
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
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
                    className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#F64668] bg-[#F64668] text-white shadow-md shadow-[#F64668]/30'
                        : 'border-[#232644] bg-[#181a2e] text-gray-400 hover:text-white hover:border-[#41436A]'
                    }`}
                  >
                    <IconRenderer name={iconName} className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1f223f] mt-4">
            <button
              type="button"
              onClick={handleArchive}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-900/30 border border-rose-900/50 transition-colors"
              title="Archive habit without deleting historical completion data"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive Habit</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1f223f] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-[#984063] to-[#F64668] hover:opacity-95 shadow-lg shadow-[#F64668]/25 transition-all"
              >
                {mode === 'edit' ? 'Save Changes' : 'Confirm Replacement'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121324] border border-[#222544] rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f223f] mb-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#984063]/20 text-[#FE9677]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Add New Habit</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f223f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full bg-[#181a2e] border border-[#232644] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F64668] focus:ring-1 focus:ring-[#F64668] transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#984063] bg-[#984063]/20 text-white font-semibold shadow-sm'
                        : 'border-[#232644] bg-[#181a2e] text-gray-400 hover:text-gray-200 hover:border-[#41436A]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
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
                    className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
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

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1f223f]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1f223f] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-[#984063] to-[#F64668] hover:opacity-95 shadow-lg shadow-[#F64668]/25 transition-all"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

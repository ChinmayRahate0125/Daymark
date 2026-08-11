import React from 'react';
import { X, Archive, RotateCcw, Calendar, CheckCircle2 } from 'lucide-react';
import { Habit } from '../types';
import { CATEGORIES } from '../data/categories';
import { IconRenderer } from './IconRenderer';

interface ArchivedHabitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  archivedHabits: Habit[];
  onUnarchiveHabit: (habitId: string) => void;
}

export const ArchivedHabitsModal: React.FC<ArchivedHabitsModalProps> = ({
  isOpen,
  onClose,
  archivedHabits,
  onUnarchiveHabit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121324] border border-[#222544] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-white flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f223f] mb-4 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Archived Habits</h3>
              <p className="text-xs text-gray-400">
                {archivedHabits.length} habit{archivedHabits.length === 1 ? '' : 's'} archived in Settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f223f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="p-3.5 rounded-xl bg-[#181a2e] border border-[#232644] text-xs text-gray-300 mb-4 shrink-0 flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            Archived habits are hidden from your main monthly tracker to keep your grid clean, but all historical completion data is safely preserved for your analytics.
          </span>
        </div>

        {/* List of Archived Habits */}
        <div className="overflow-y-auto pr-1 space-y-3 flex-1">
          {archivedHabits.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#232644] text-gray-500">
              <Archive className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
              <p className="text-sm font-medium text-gray-400">No archived habits</p>
              <p className="text-xs text-gray-500 mt-1">
                Habits you archive in the future will be stored here safely.
              </p>
            </div>
          ) : (
            archivedHabits.map((habit) => {
              const catInfo = CATEGORIES[habit.category] || CATEGORIES.Personal;
              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#16172a] border border-[#212340] hover:border-[#2d3056] transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                      style={{ backgroundColor: catInfo.bgHex }}
                    >
                      <IconRenderer name={habit.icon || catInfo.iconName} className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-white truncate">
                        {habit.title}
                      </span>
                      <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span>Archived: {habit.archivedAt?.slice(0, 10)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onUnarchiveHabit(habit.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all shrink-0"
                    title="Restore to active tracker"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Unarchive</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#1f223f] mt-4 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-[#181a2e] hover:bg-[#20233e] border border-[#232644] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

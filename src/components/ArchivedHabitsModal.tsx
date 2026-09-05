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
      <div className="bg-[#0d0e15] border border-white/[0.1] rounded-xl w-full max-w-lg p-6 shadow-2xl relative text-white flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">Archived Habits</h3>
              <p className="text-xs text-zinc-400">
                {archivedHabits.length} habit{archivedHabits.length === 1 ? '' : 's'} archived
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="p-3.5 rounded-lg bg-[#13141f] border border-white/[0.06] text-xs text-zinc-300 mb-4 shrink-0 flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>
            Archived habits are hidden from your main monthly tracker, but all historical completion data is safely preserved for your analytics.
          </span>
        </div>

        {/* List of Archived Habits */}
        <div className="overflow-y-auto pr-1 space-y-2.5 flex-1">
          {archivedHabits.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-lg border border-dashed border-white/[0.08] text-zinc-500">
              <Archive className="w-8 h-8 mx-auto mb-2 opacity-30 text-zinc-400" />
              <p className="text-xs font-semibold text-zinc-400">No archived habits</p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Habits you archive in the future will be stored here safely.
              </p>
            </div>
          ) : (
            archivedHabits.map((habit) => {
              const catInfo = CATEGORIES[habit.category] || CATEGORIES.Personal;
              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#13141f] border border-white/[0.06] hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/[0.08]"
                      style={{ backgroundColor: `${catInfo.bgHex}25`, borderColor: `${catInfo.bgHex}50` }}
                    >
                      <IconRenderer name={habit.icon || catInfo.iconName} className="w-3.5 h-3.5 text-zinc-200" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-white truncate">
                        {habit.title}
                      </span>
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-400 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span>Archived: {habit.archivedAt?.slice(0, 10)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onUnarchiveHabit(habit.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 transition-all shrink-0 cursor-pointer"
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
        <div className="pt-4 border-t border-white/[0.06] mt-4 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 bg-[#13141f] hover:bg-zinc-800 border border-white/[0.08] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Home, BarChart3, Archive, Flame } from 'lucide-react';
import { NavigationTab } from '../types';
import daymarkLogo from '../assets/DayMark.png';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentStreak: number;
  onOpenArchivedModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentStreak,
  onOpenArchivedModal,
}) => {
  return (
    <aside className="w-16 md:w-20 bg-[#090a0f] border-r border-white/[0.06] flex flex-col items-center justify-between py-6 min-h-screen select-none shrink-0 z-20">
      {/* Top Logo & Navigation */}
      <div className="flex flex-col items-center space-y-8 w-full">
        {/* Daymark Logo */}
        <button
          onClick={() => setActiveTab('dashboard')}
          title="Daymark Dashboard"
          className="w-10 h-10 md:w-11 md:h-11 rounded-xl p-1 bg-[#101118] border border-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer shadow-sm group overflow-hidden"
        >
          <img
            src={daymarkLogo}
            alt="Daymark"
            className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
          />
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center space-y-3.5 w-full px-2">
          {/* Dashboard Item */}
          <button
            onClick={() => setActiveTab('dashboard')}
            title="Dashboard"
            className={`relative p-2.5 rounded-xl transition-all duration-200 group flex items-center justify-center w-11 h-11 ${
              activeTab === 'dashboard'
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border border-transparent'
            }`}
          >
            {activeTab === 'dashboard' && (
              <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-purple-500 rounded-r-full" />
            )}
            <Home className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Insights Item */}
          <button
            onClick={() => setActiveTab('insights')}
            title="Insights & Analytics"
            className={`relative p-2.5 rounded-xl transition-all duration-200 group flex items-center justify-center w-11 h-11 ${
              activeTab === 'insights'
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border border-transparent'
            }`}
          >
            {activeTab === 'insights' && (
              <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-purple-500 rounded-r-full" />
            )}
            <BarChart3 className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Archived Habits Item */}
          {onOpenArchivedModal && (
            <button
              onClick={onOpenArchivedModal}
              title="Archived Habits"
              className="relative p-2.5 rounded-xl transition-all duration-200 group flex items-center justify-center w-11 h-11 text-zinc-400 hover:text-purple-300 hover:bg-zinc-900/60 border border-transparent hover:border-white/[0.05]"
            >
              <Archive className="w-5 h-5 stroke-[1.75]" />
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Quiet Streak Indicator */}
      <div
        className="flex flex-col items-center space-y-1 group cursor-default p-2 rounded-xl border border-white/[0.04] bg-[#0c0d13] hover:border-purple-500/30 transition-all"
        title={`Current streak: ${currentStreak} days`}
      >
        <Flame className="w-5 h-5 text-purple-400 fill-purple-500/20 group-hover:scale-105 transition-transform duration-200" />
        <span className="text-xs font-semibold text-purple-300">
          {currentStreak}d
        </span>
      </div>
    </aside>
  );
};
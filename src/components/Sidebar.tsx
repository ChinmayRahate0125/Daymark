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
    <aside className="w-16 md:w-20 bg-[#0d0e18] border-r border-[#1a1c30] flex flex-col items-center justify-between py-6 min-h-screen select-none shrink-0 z-20">

      {/* Top Logo & Navigation */}
      <div className="flex flex-col items-center space-y-8 w-full">

        {/* Daymark Logo */}
        <button
          onClick={() => setActiveTab('dashboard')}
          title="Your Journey"
          className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            src={daymarkLogo}
            alt="Daymark"
            className="w-full h-full object-contain"
          />
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center space-y-4 w-full">

          {/* Dashboard Item */}
          <button
            onClick={() => setActiveTab('dashboard')}
            title="Your Journey"
            className={`relative p-3 rounded-xl transition-all duration-200 group flex items-center justify-center w-11 h-11 ${
              activeTab === 'dashboard'
                ? 'bg-[#41436A]/40 text-[#FE9677] border border-[#41436A] shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#161728]'
            }`}
          >
            {activeTab === 'dashboard' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-[#F64668] to-[#984063] rounded-r-full" />
            )}

            <Home className="w-5 h-5" />
          </button>

          {/* Insights Item */}
          <button
            onClick={() => setActiveTab('insights')}
            title="Insights & Analytics"
            className={`relative p-3 rounded-xl transition-all duration-200 group flex items-center justify-center w-11 h-11 ${
              activeTab === 'insights'
                ? 'bg-[#41436A]/40 text-[#FE9677] border border-[#41436A] shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#161728]'
            }`}
          >
            {activeTab === 'insights' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-[#F64668] to-[#984063] rounded-r-full" />
            )}

            <BarChart3 className="w-5 h-5" />
          </button>

          {/* Archived Habits Item */}
          {onOpenArchivedModal && (
            <button
              onClick={onOpenArchivedModal}
              title="Archived Habits (Settings)"
              className="relative p-3 rounded-xl transition-all duration-200 group flex items-center justify-center w-11 h-11 text-gray-400 hover:text-amber-300 hover:bg-[#161728]"
            >
              <Archive className="w-5 h-5" />
            </button>
          )}

        </nav>
      </div>

      {/* Bottom Flame Streak Indicator */}
      <div className="flex flex-col items-center space-y-1 group cursor-default">

        <div className="relative">
          <Flame
            className="w-6 h-6 text-[#F64668] fill-[#F64668]/20 group-hover:scale-110 transition-transform duration-200"
          />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FE9677] rounded-full animate-ping" />
        </div>

        <span className="text-xs font-bold text-[#FE9677]">
          {currentStreak}
        </span>

      </div>

    </aside>
  );
};
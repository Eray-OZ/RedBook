import React from 'react';
import { Sun, Moon } from 'lucide-react';

export type TabType = 'library' | 'add' | 'search' | 'logs' | 'tester';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isBackendOnline: boolean;
  bookCount: number;
  logCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBackendOnline,
  bookCount,
  logCount,
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
    <>
      {/* Desktop SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 w-64 border-r-2 border-on-background shadow-[6px_0px_0px_0px_var(--shadow-color)] p-4 gap-4 bg-tertiary-container z-40">
        <div className="flex items-center justify-between mb-4 mt-2 px-1">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('logs')}
          >
            <div className="w-10 h-10 bg-primary-container border-2 border-on-background rounded-full flex items-center justify-center shadow-brutal-sm shrink-0">
              <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                ink_pen
              </span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-on-tertiary-container leading-tight">Red Book</h1>
              <p className="font-caption text-caption text-on-tertiary-container opacity-80">Your Literary Journey</p>
            </div>
          </div>
        </div>

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="w-full py-2 px-3 bg-surface border-2 border-on-background rounded-lg font-label-md text-xs font-bold text-on-background shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-between mb-2"
          title="Toggle Theme"
        >
          <span className="flex items-center gap-2">
            {isDarkMode ? <Moon size={16} className="text-secondary" /> : <Sun size={16} className="text-primary" />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container border border-on-background rounded-full text-[10px] font-bold">
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </span>
        </button>

        <div className="flex-1 flex flex-col gap-2">
          {/* Active Tab: Reading Logs */}
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg font-label-md text-label-md transition-all text-left ${
              activeTab === 'logs'
                ? 'bg-primary text-on-primary border-2 border-on-background shadow-[2px_2px_0px_0px_var(--shadow-color)] active:scale-95 font-bold'
                : 'text-on-tertiary-container hover:bg-surface-variant/50 hover:bg-primary-container/20 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'logs' ? "'FILL' 1" : "'FILL' 0" }}>
                history_edu
              </span>
              Reading Logs
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border border-on-background ${activeTab === 'logs' ? 'bg-surface-bright text-on-background' : 'bg-surface-container text-on-surface-variant'}`}>
              {logCount}
            </span>
          </button>

          {/* Books */}
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg font-label-md text-label-md transition-all text-left ${
              activeTab === 'library'
                ? 'bg-primary text-on-primary border-2 border-on-background shadow-[2px_2px_0px_0px_var(--shadow-color)] active:scale-95 font-bold'
                : 'text-on-tertiary-container hover:bg-surface-variant/50 hover:bg-primary-container/20 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'library' ? "'FILL' 1" : "'FILL' 0" }}>
                book_2
              </span>
              Books
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border border-on-background ${activeTab === 'library' ? 'bg-surface-bright text-on-background' : 'bg-surface-container text-on-surface-variant'}`}>
              {bookCount}
            </span>
          </button>

          {/* Grand Archives / Search */}
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-label-md text-label-md transition-all text-left ${
              activeTab === 'search'
                ? 'bg-primary text-on-primary border-2 border-on-background shadow-[2px_2px_0px_0px_var(--shadow-color)] active:scale-95 font-bold'
                : 'text-on-tertiary-container hover:bg-surface-variant/50 hover:bg-primary-container/20 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'search' ? "'FILL' 1" : "'FILL' 0" }}>
              museum
            </span>
            Grand Archives
          </button>

          {/* Add New Log */}
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-label-md text-label-md transition-all text-left ${
              activeTab === 'add'
                ? 'bg-primary text-on-primary border-2 border-on-background shadow-[2px_2px_0px_0px_var(--shadow-color)] active:scale-95 font-bold'
                : 'text-on-tertiary-container hover:bg-surface-variant/50 hover:bg-primary-container/20 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              add_circle
            </span>
            Add New Log
          </button>

          {/* API Tester */}
          <button
            onClick={() => setActiveTab('tester')}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-label-md text-label-md transition-all text-left ${
              activeTab === 'tester'
                ? 'bg-primary text-on-primary border-2 border-on-background shadow-[2px_2px_0px_0px_var(--shadow-color)] active:scale-95 font-bold'
                : 'text-on-tertiary-container hover:bg-surface-variant/50 hover:bg-primary-container/20 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'tester' ? "'FILL' 1" : "'FILL' 0" }}>
              terminal
            </span>
            API Tester
          </button>
        </div>

        <button
          onClick={() => setActiveTab('logs')}
          className="w-full py-3 mb-2 bg-secondary text-on-secondary border-2 border-on-background rounded-lg font-label-md text-label-md shadow-brutal-sm hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">history_edu</span>
          Add New Log
        </button>

        <div className="mt-auto border-t-2 border-on-background pt-3 flex items-center justify-between px-1 text-xs text-on-tertiary-container font-caption">
          <span className="flex items-center gap-1.5 font-medium">
            <span className={`w-2.5 h-2.5 rounded-full border border-on-background ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            {isBackendOnline ? 'API Online' : 'Demo Mode'}
          </span>
          <span className="font-bold opacity-75">v2.0</span>
        </div>
      </nav>

      {/* Mobile TopAppBar */}
      <header className="md:hidden w-full top-0 z-50 border-b-2 border-on-background shadow-[4px_4px_0px_0px_rgba(154,70,0,1)] flex justify-between items-center px-4 py-3 bg-surface-bright sticky">
        <div 
          className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tighter cursor-pointer flex items-center gap-2"
          onClick={() => setActiveTab('logs')}
        >
          <span className="material-symbols-outlined text-2xl">ink_pen</span>
          Red Book
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded border border-on-background bg-surface text-on-background"
            title="Toggle Theme"
          >
            {isDarkMode ? <Moon size={18} className="text-secondary" /> : <Sun size={18} className="text-primary" />}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`p-2 rounded border border-on-background ${activeTab === 'logs' ? 'bg-primary text-on-primary' : 'text-primary bg-surface'}`}
            title="Reading Logs"
          >
            <span className="material-symbols-outlined text-xl block">history_edu</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`p-2 rounded border border-on-background ${activeTab === 'library' ? 'bg-primary text-on-primary' : 'text-primary bg-surface'}`}
            title="Books"
          >
            <span className="material-symbols-outlined text-xl block">book_2</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`p-2 rounded border border-on-background ${activeTab === 'search' ? 'bg-primary text-on-primary' : 'text-primary bg-surface'}`}
            title="Grand Archives"
          >
            <span className="material-symbols-outlined text-xl block">museum</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`p-2 rounded border border-on-background ${activeTab === 'add' ? 'bg-primary text-on-primary' : 'text-primary bg-surface'}`}
            title="Add New Log"
          >
            <span className="material-symbols-outlined text-xl block">add_circle</span>
          </button>
          <button
            onClick={() => setActiveTab('tester')}
            className={`p-2 rounded border border-on-background ${activeTab === 'tester' ? 'bg-primary text-on-primary' : 'text-primary bg-surface'}`}
            title="API Tester"
          >
            <span className="material-symbols-outlined text-xl block">terminal</span>
          </button>
        </div>
      </header>
    </>
  );
};

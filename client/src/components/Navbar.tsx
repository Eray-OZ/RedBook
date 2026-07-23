import React from 'react';
import { BookOpen, PlusCircle, Search, Terminal, Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: 'library' | 'add' | 'search' | 'tester';
  setActiveTab: (tab: 'library' | 'add' | 'search' | 'tester') => void;
  isBackendOnline: boolean;
  bookCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBackendOnline,
  bookCount,
}) => {
  return (
    <>
      {/* Desktop Sidebar (Medieval Dark Wood) */}
      <aside className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col p-6 dark-wood-sidebar hidden md:flex">
        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={() => setActiveTab('library')}>
            <div className="absolute inset-0 bg-[#d4af37]/20 blur-xl group-hover:bg-[#9e1b1b]/40 transition-all duration-700"></div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9e1b1b] to-[#5e1010] border-2 border-[#d4af37] flex items-center justify-center shadow-lg relative z-10">
              <BookOpen className="w-8 h-8 text-[#f4ecd8]" />
            </div>
          </div>
          <div className="text-center mt-3">
            <h1 className="font-display text-2xl font-black text-[#ffb4ac] tracking-tighter uppercase italic drop-shadow-md">
              RedBook
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold mt-0.5 opacity-90 font-label">
              Premium Library
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-3">
          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-sm border transition-all duration-300 font-label ${
              activeTab === 'library'
                ? 'bg-[#f4ecd8] text-[#383014] border-[#d4af37] shadow-lg font-bold'
                : 'text-[#e4e2e1]/70 hover:text-[#d4af37] border-transparent hover:border-[#d4af37]/30 ink-bleed-hover'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} className={activeTab === 'library' ? 'text-[#9e1b1b]' : ''} />
              <span className="text-xs uppercase tracking-widest font-semibold">Library</span>
            </div>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded ${
                activeTab === 'library' ? 'bg-[#9e1b1b] text-white' : 'bg-[#1b1c1c] text-[#d4af37] border border-[#d4af37]/40'
              }`}
            >
              {bookCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm border transition-all duration-300 font-label ${
              activeTab === 'add'
                ? 'bg-[#f4ecd8] text-[#383014] border-[#d4af37] shadow-lg font-bold'
                : 'text-[#e4e2e1]/70 hover:text-[#d4af37] border-transparent hover:border-[#d4af37]/30 ink-bleed-hover'
            }`}
          >
            <PlusCircle size={18} className={activeTab === 'add' ? 'text-[#9e1b1b]' : ''} />
            <span className="text-xs uppercase tracking-widest font-semibold">Add Book</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm border transition-all duration-300 font-label ${
              activeTab === 'search'
                ? 'bg-[#f4ecd8] text-[#383014] border-[#d4af37] shadow-lg font-bold'
                : 'text-[#e4e2e1]/70 hover:text-[#d4af37] border-transparent hover:border-[#d4af37]/30 ink-bleed-hover'
            }`}
          >
            <Search size={18} className={activeTab === 'search' ? 'text-[#9e1b1b]' : ''} />
            <span className="text-xs uppercase tracking-widest font-semibold">Google Books</span>
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm border transition-all duration-300 font-label ${
              activeTab === 'tester'
                ? 'bg-[#f4ecd8] text-[#383014] border-[#d4af37] shadow-lg font-bold'
                : 'text-[#e4e2e1]/70 hover:text-[#d4af37] border-transparent hover:border-[#d4af37]/30 ink-bleed-hover'
            }`}
          >
            <Terminal size={18} className={activeTab === 'tester' ? 'text-[#9e1b1b]' : ''} />
            <span className="text-xs uppercase tracking-widest font-semibold">API Tester</span>
          </button>
        </nav>

        {/* Sidebar Footer Action */}
        <div className="mt-auto pt-6 border-t border-[#d4af37]/20 space-y-4">
          <button onClick={() => setActiveTab('add')} className="w-full illuminated-btn">
            <PlusCircle size={16} />
            <span>Add Title</span>
          </button>

          <div className="flex items-center justify-between px-2 text-[11px] font-label text-[#e4e2e1]/60">
            <span className="flex items-center gap-1.5">
              <Radio size={12} className={isBackendOnline ? 'text-emerald-400 animate-pulse' : 'text-amber-400'} />
              {isBackendOnline ? 'API Connected' : 'Demo Mode'}
            </span>
            <span className="text-[#d4af37] font-bold">v2.1</span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden sticky top-0 left-0 right-0 z-40 mystical-header px-4 py-3 flex items-center justify-between border-b border-[#d4af37]/20 bg-[#131313]/90 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('library')}>
          <div className="w-8 h-8 rounded-full bg-[#9e1b1b] border border-[#d4af37] flex items-center justify-center text-[#f4ecd8]">
            <BookOpen size={16} />
          </div>
          <span className="font-display font-black text-lg text-[#ffb4ac] italic">RedBook</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`p-2 rounded ${activeTab === 'library' ? 'bg-[#f4ecd8] text-[#383014]' : 'text-[#d4af37]'}`}
          >
            <BookOpen size={18} />
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`p-2 rounded ${activeTab === 'add' ? 'bg-[#f4ecd8] text-[#383014]' : 'text-[#d4af37]'}`}
          >
            <PlusCircle size={18} />
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`p-2 rounded ${activeTab === 'search' ? 'bg-[#f4ecd8] text-[#383014]' : 'text-[#d4af37]'}`}
          >
            <Search size={18} />
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`p-2 rounded ${activeTab === 'tester' ? 'bg-[#f4ecd8] text-[#383014]' : 'text-[#d4af37]'}`}
          >
            <Terminal size={18} />
          </button>
        </div>
      </header>
    </>
  );
};

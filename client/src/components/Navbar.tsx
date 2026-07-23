import React from 'react';
import { BookOpen, PlusCircle, Search, Terminal } from 'lucide-react';

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
    <header className="app-navbar">
      <div className="brand-logo">
        <BookOpen className="w-8 h-8 text-violet-400" size={28} />
        <span>ReadRate <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 400 }}>v2.0</span></span>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-button ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <BookOpen size={18} />
          <span>Library</span>
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '2px 7px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            marginLeft: '2px'
          }}>
            {bookCount}
          </span>
        </button>

        <button
          className={`nav-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <PlusCircle size={18} />
          <span>Add Book</span>
        </button>

        <button
          className={`nav-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={18} />
          <span>Google Books</span>
        </button>

        <button
          className={`nav-button ${activeTab === 'tester' ? 'active' : ''}`}
          onClick={() => setActiveTab('tester')}
        >
          <Terminal size={18} />
          <span>API Status</span>
        </button>
      </nav>

      <div className="status-pill">
        <span className={`status-dot ${isBackendOnline ? 'online' : 'offline'}`}></span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {isBackendOnline ? 'API Connected' : 'Demo / Fallback'}
        </span>
      </div>
    </header>
  );
};

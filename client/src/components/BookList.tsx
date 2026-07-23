import React, { useState } from 'react';
import type { Book } from '../types/book';
import { Search, Filter, BookOpen, User, Calendar, FileText, PlusCircle, Sparkles } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onNavigateToAdd: () => void;
  onNavigateToSearch: () => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  onNavigateToAdd,
  onNavigateToSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const getItemTypeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'book': return 'badge-book';
      case 'ebook': return 'badge-ebook';
      case 'audiobook': return 'badge-audiobook';
      case 'magazine': return 'badge-magazine';
      case 'journal': return 'badge-journal';
      case 'comic': return 'badge-comic';
      default: return 'badge-book';
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.authorName || book.author?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType =
      selectedType === 'ALL' || book.itemType.toString().toUpperCase() === selectedType.toUpperCase();

    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="section-title-bar">
        <div>
          <h1 className="section-title">My Book Library</h1>
          <p className="section-subtitle">
            Manage your personal catalog, track page counts, and explore collection stats.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onNavigateToSearch}>
            <Sparkles size={18} className="text-violet-400" />
            <span>Find on Google Books</span>
          </button>
          <button className="btn btn-primary" onClick={onNavigateToAdd}>
            <PlusCircle size={18} />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="search-box" style={{ flex: '1 1 300px' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search books by title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Format:</span>
            {['ALL', 'Book', 'EBook', 'AudioBook', 'Magazine', 'Journal'].map((type) => (
              <button
                key={type}
                className={`btn btn-secondary ${selectedType === type ? 'btn-primary' : ''}`}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
                onClick={() => setSelectedType(type)}
              >
                {type === 'ALL' ? 'All Formats' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="book-grid">
          {filteredBooks.map((book) => {
            const authorDisplayName = book.authorName || book.author?.name || 'Unknown Author';
            const yearStr = book.publishYear ? new Date(book.publishYear).getFullYear() : 'N/A';

            return (
              <div key={book.id || book.title} className="glass-panel book-card">
                <div className="book-cover-container">
                  <span className={`book-cover-badge badge ${getItemTypeBadgeClass(String(book.itemType))}`}>
                    {String(book.itemType)}
                  </span>
                  <img
                    src={book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
                    alt={book.title}
                    className="book-cover-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>

                <div className="book-info">
                  <h3 className="book-title" title={book.title}>{book.title}</h3>
                  <div className="book-author" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={14} className="text-violet-400" />
                    <span>{authorDisplayName}</span>
                  </div>

                  <div className="book-meta">
                    <div className="book-meta-item">
                      <FileText size={14} />
                      <span>{book.defaultPageCount} pages</span>
                    </div>

                    <div className="book-meta-item">
                      <Calendar size={14} />
                      <span>{yearStr}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <BookOpen size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No books found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            No titles match your current filter or search criteria. Try adding a new book to your library!
          </p>
          <button className="btn btn-primary" onClick={onNavigateToAdd}>
            <PlusCircle size={18} />
            <span>Add Your First Book</span>
          </button>
        </div>
      )}
    </div>
  );
};

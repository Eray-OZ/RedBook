import React, { useState } from 'react';
import type { GoogleBookSearchResult, CreateBookDto } from '../types/book';
import { BookService } from '../services/api';
import { Search, Sparkles, BookOpen, Plus, Loader2, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface GoogleBooksSearchProps {
  onImportBook: (dto: CreateBookDto) => Promise<void>;
  onNavigateToLibrary?: () => void;
}

export const GoogleBooksSearch: React.FC<GoogleBooksSearchProps> = ({
  onImportBook,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [importedIds, setImportedIds] = useState<Record<string, boolean>>({});
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const { results: apiResults } = await BookService.searchGoogleBooks(query);
      setResults(apiResults);
    } catch (err) {
      console.error('Failed to search Google Books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (item: GoogleBookSearchResult) => {
    const primaryAuthor = item.authors && item.authors.length > 0 ? item.authors[0] : 'Unknown Author';
    
    let dateIso = new Date().toISOString();
    if (item.publishedDate) {
      const parsedDate = new Date(item.publishedDate);
      if (!isNaN(parsedDate.getTime())) {
        dateIso = parsedDate.toISOString();
      }
    }

    const dto: CreateBookDto = {
      title: item.title,
      itemType: 'Book',
      defaultPageCount: item.pageCount || 250,
      publishYear: dateIso,
      googleBooksId: item.id,
      isbn: item.isbn || undefined,
      coverImageUrl: item.coverUrl || undefined,
      author: {
        name: primaryAuthor,
        bio: item.authors && item.authors.length > 1 ? `Co-authored by ${item.authors.join(', ')}` : undefined,
      },
    };

    try {
      await onImportBook(dto);
      setImportedIds((prev) => ({ ...prev, [item.id]: true }));
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  return (
    <div>
      <div className="section-title-bar">
        <div>
          <h1 className="section-title">Google Books Search</h1>
          <p className="section-subtitle">
            Query millions of titles online via <code style={{ color: 'var(--accent-secondary)' }}>/api/book/search-google-books</code> and import them to your library in 1 click.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1 }}>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search Google Books by title, author, topic, or ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.85rem 1.75rem' }}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            <span>{loading ? 'Searching...' : 'Search Google Books'}</span>
          </button>
        </div>
      </form>

      {/* Results Grid */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Loader2 size={40} className="animate-spin text-violet-400" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Querying Google Books API endpoints...</p>
        </div>
      ) : results.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {results.map((book) => {
            const isImported = importedIds[book.id];
            const authorStr = book.authors ? book.authors.join(', ') : 'Unknown Author';

            return (
              <div key={book.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem' }}>
                  <img
                    src={book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
                    alt={book.title}
                    style={{
                      width: '90px',
                      height: '135px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      background: '#0f172a',
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <h3
                      style={{
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        marginBottom: '0.35rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      {authorStr}
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 'auto' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FileText size={12} /> {book.pageCount} p.
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} /> {book.publishedDate?.substring(0, 4) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {book.description && (
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-dim)',
                      padding: '0 1.25rem 1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {book.description}
                  </p>
                )}

                <div
                  style={{
                    marginTop: 'auto',
                    padding: '0.85rem 1.25rem',
                    background: 'rgba(15, 23, 42, 0.4)',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {isImported ? (
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                      <CheckCircle2 size={16} /> Added to Library!
                    </span>
                  ) : (
                    <button
                      className="btn btn-success"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', width: '100%' }}
                      onClick={() => handleImport(book)}
                    >
                      <Plus size={16} />
                      <span>Import Book</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : hasSearched ? (
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <BookOpen size={40} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No books found on Google Books for "{query}". Try a different keyword.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Sparkles size={48} className="text-violet-400" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Search millions of books</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto' }}>
            Type a book title, author, or topic above to fetch results live from Google Books API and import them directly into ReadRate.
          </p>
        </div>
      )}
    </div>
  );
};

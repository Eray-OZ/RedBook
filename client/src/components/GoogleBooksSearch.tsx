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
    const primaryAuthor = item.authorName || (item.authors && item.authors.length > 0 ? item.authors[0] : 'Unknown Author');

    let dateIso = new Date().toISOString();
    if (item.publishedDate || item.publishYear) {
      const parsedDate = new Date(item.publishedDate || item.publishYear || '');
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
      coverImageUrl: item.coverUrl || item.coverImageUrl || undefined,
      authorDto: {
        name: primaryAuthor,
        bio: item.authors && item.authors.length > 1 ? `Co-authors: ${item.authors.join(', ')}` : undefined,
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
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="border-b-2 border-on-background pb-4">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">
          Search Google Books Archives
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Search the online Google Books database and import volumes directly to your library.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch}>
        <div className="bg-surface border-2 border-on-background rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center shadow-brutal">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant z-10" size={18} />
            <input
              type="text"
              placeholder="Search by book title, author, genre, or ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface-container-low text-on-background border-2 border-on-background py-3 pl-10 pr-4 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto py-3 px-6 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-label-md font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span>{loading ? 'Searching...' : 'Search Online'}</span>
          </button>
        </div>
      </form>

      {/* Results Section */}
      {loading ? (
        <div className="bg-surface border-2 border-on-background rounded-lg p-12 text-center shadow-brutal">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-3" />
          <p className="font-label-md text-on-background font-bold">Querying Google Books API...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((book) => {
            const isImported = importedIds[book.id];
            const authorStr = book.authorName || (book.authors ? book.authors.join(', ') : 'Unknown Author');

            return (
              <div key={book.id} className="bg-surface border-2 border-on-background rounded-lg p-5 shadow-brutal-sm shadow-brutal-hover flex flex-col justify-between space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 h-36 flex-shrink-0 bg-surface-dim border-2 border-on-background rounded overflow-hidden shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                    <img
                      src={book.coverUrl || book.coverImageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-1.5 overflow-hidden">
                    <h3 className="font-headline-md text-headline-md text-on-background line-clamp-2" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="font-label-md text-xs font-bold text-on-surface-variant">
                      {authorStr}
                    </p>

                    <div className="flex items-center gap-3 text-xs font-caption text-on-surface-variant pt-2">
                      <span className="flex items-center gap-1">
                        <FileText size={12} /> {book.pageCount || 250} Pages
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {book.publishedDate?.substring(0, 4) || book.publishYear?.substring(0, 4) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {book.description && (
                  <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 border-t-2 border-on-background/10 pt-2">
                    {book.description}
                  </p>
                )}

                <div className="pt-2 border-t-2 border-on-background/20">
                  {isImported ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs font-label-md font-bold text-secondary">
                      <CheckCircle2 size={16} /> Imported to Library
                    </div>
                  ) : (
                    <button
                      onClick={() => handleImport(book)}
                      className="w-full py-2.5 font-label-md text-xs font-bold bg-primary text-on-primary border-2 border-on-background rounded-lg shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Import to Library</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : hasSearched ? (
        <div className="bg-surface border-2 border-on-background rounded-lg p-10 text-center shadow-brutal">
          <BookOpen size={40} className="mx-auto text-primary mb-3" />
          <p className="font-body-md text-on-background">No results found on Google Books for "{query}".</p>
        </div>
      ) : (
        <div className="bg-surface border-2 border-on-background rounded-lg p-12 text-center max-w-lg mx-auto shadow-brutal">
          <Sparkles size={48} className="mx-auto text-primary mb-4" />
          <h3 className="font-headline-md text-headline-md text-on-background mb-2">Search Online Database</h3>
          <p className="font-body-md text-on-surface-variant text-sm">
            Fetch cover artwork, author metadata, and page counts directly from the Google Books database.
          </p>
        </div>
      )}
    </div>
  );
};

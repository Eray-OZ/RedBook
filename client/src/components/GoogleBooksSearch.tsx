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
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="border-b border-[#d4af37]/20 pb-4">
        <h1 className="font-display text-3xl md:text-4xl text-[#e4e2e1] font-black uppercase tracking-wider italic">
          Google Books Archival Search
        </h1>
        <p className="font-label text-xs text-[#e4e2e1]/70 uppercase tracking-widest mt-1">
          Query Google Books database online and archive titles directly into your local library.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch}>
        <div className="parchment-card p-4 sm:p-6 rounded-sm border-2 border-[#d4af37] flex flex-col sm:flex-row gap-4 items-center shadow-xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#383014]/60 z-10" size={18} />
            <input
              type="text"
              placeholder="Search by title, author, subject, or ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 py-3 pl-10 pr-4 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="illuminated-btn w-full sm:w-auto"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span>{loading ? 'Searching...' : 'Search Online'}</span>
          </button>
        </div>
      </form>

      {/* Results Section */}
      {loading ? (
        <div className="parchment-card p-12 text-center rounded-sm border border-[#d4af37]">
          <Loader2 size={40} className="animate-spin text-[#9e1b1b] mx-auto mb-3" />
          <p className="font-body text-[#383014] font-bold">Querying Google Books API endpoints...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((book) => {
            const isImported = importedIds[book.id];
            const authorStr = book.authors ? book.authors.join(', ') : 'Unknown Scribe';

            return (
              <div key={book.id} className="parchment-card p-5 rounded-sm border border-[#d4af37] flex flex-col justify-between space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 h-36 flex-shrink-0 bg-[#1b1c1c] border border-[#d4af37]/40 rounded-sm overflow-hidden shadow-md">
                    <img
                      src={book.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-1.5 overflow-hidden">
                    <h3 className="font-display font-black text-base text-[#383014] line-clamp-2 italic" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="font-label text-xs font-bold text-[#383014]/70 uppercase tracking-wider">
                      {authorStr}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] font-label font-bold text-[#383014]/60 uppercase tracking-widest pt-2">
                      <span className="flex items-center gap-1">
                        <FileText size={12} /> {book.pageCount || 250} Pages
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {book.publishedDate?.substring(0, 4) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {book.description && (
                  <p className="font-body text-xs text-[#383014]/80 line-clamp-2 border-t border-[#383014]/10 pt-2">
                    {book.description}
                  </p>
                )}

                <div className="pt-2 border-t border-[#383014]/15">
                  {isImported ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs font-label font-bold text-emerald-800 uppercase tracking-wider">
                      <CheckCircle2 size={16} /> Archived to Library
                    </div>
                  ) : (
                    <button
                      onClick={() => handleImport(book)}
                      className="w-full py-2.5 font-label text-xs font-bold uppercase tracking-widest bg-[#9e1b1b] text-white hover:bg-[#b82121] transition-colors border border-[#d4af37] flex items-center justify-center gap-1.5 rounded-sm shadow-md"
                    >
                      <Plus size={14} />
                      <span>Archive Folio</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : hasSearched ? (
        <div className="parchment-card p-10 text-center rounded-sm border border-[#d4af37]">
          <BookOpen size={40} className="mx-auto text-[#9e1b1b] mb-3" />
          <p className="font-body text-[#383014]">No manuscripts found on Google Books for "{query}".</p>
        </div>
      ) : (
        <div className="parchment-card p-12 text-center max-w-lg mx-auto rounded-sm border-2 border-[#d4af37]">
          <Sparkles size={48} className="mx-auto text-[#9e1b1b] mb-4" />
          <h3 className="font-display text-xl font-bold text-[#383014] mb-2">Search Global Repository</h3>
          <p className="font-body text-[#383014]/80">
            Query Google Books to automatically fetch covers, authors, and page counts directly into RedBook.
          </p>
        </div>
      )}
    </div>
  );
};

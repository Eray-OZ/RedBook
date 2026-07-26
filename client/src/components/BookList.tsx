import React, { useState } from 'react';
import type { Book } from '../types/book';
import { Search, BookOpen, User, Calendar, PlusCircle, Sparkles, Headphones, BookMarked, Layers } from 'lucide-react';

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

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.authorName || book.author?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === 'ALL' || book.itemType.toString().toUpperCase() === selectedType.toUpperCase();

    return matchesSearch && matchesType;
  });

  const totalPages = books.reduce((sum, b) => sum + (b.defaultPageCount || 0), 0);
  const audioCount = books.filter((b) => String(b.itemType).toLowerCase() === 'audiobook').length;
  const comicCount = books.filter((b) => String(b.itemType).toLowerCase() === 'comic').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">
            Books
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            All books, comics, and audiobooks in your collection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToSearch}
            className="py-2.5 px-4 bg-surface border-2 border-on-background rounded-lg font-label-md text-label-md text-on-background shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
          >
            <Sparkles size={16} className="text-secondary" />
            <span>Import Google Books</span>
          </button>
          <button
            onClick={onNavigateToAdd}
            className="py-2.5 px-4 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-label-md shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-primary-container border-2 border-on-background rounded-lg p-5 shadow-brutal flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <BookOpen className="text-on-primary-container" size={28} />
            <span className="bg-surface-bright text-on-background font-caption text-caption px-2 py-0.5 rounded-full border border-on-background font-bold">Collection</span>
          </div>
          <div className="mt-3">
            <p className="font-label-md text-label-md text-on-primary-container opacity-90">Total Books</p>
            <p className="font-display-lg text-3xl font-bold text-on-primary-container mt-0.5">{books.length}</p>
          </div>
        </div>

        <div className="bg-secondary-container border-2 border-on-background rounded-lg p-5 shadow-brutal flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Layers className="text-on-secondary-container" size={28} />
            <span className="bg-surface-bright text-on-background font-caption text-caption px-2 py-0.5 rounded-full border border-on-background font-bold">Volume</span>
          </div>
          <div className="mt-3">
            <p className="font-label-md text-label-md text-on-secondary-container opacity-90">Total Pages</p>
            <p className="font-display-lg text-3xl font-bold text-on-secondary-container mt-0.5">{totalPages.toLocaleString('en-US')}</p>
          </div>
        </div>

        <div className="bg-tertiary-container border-2 border-on-background rounded-lg p-5 shadow-brutal flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Headphones className="text-on-tertiary-container" size={28} />
            <span className="bg-surface-bright text-on-background font-caption text-caption px-2 py-0.5 rounded-full border border-on-background font-bold">Audio</span>
          </div>
          <div className="mt-3">
            <p className="font-label-md text-label-md text-on-tertiary-container opacity-90">Audiobooks</p>
            <p className="font-display-lg text-3xl font-bold text-on-tertiary-container mt-0.5">{audioCount}</p>
          </div>
        </div>

        <div className="bg-surface border-2 border-on-background rounded-lg p-5 shadow-brutal flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <BookMarked className="text-primary" size={28} />
            <span className="bg-secondary-container text-on-secondary-container font-caption text-caption px-2 py-0.5 rounded-full border border-on-background font-bold">Comic</span>
          </div>
          <div className="mt-3">
            <p className="font-label-md text-label-md text-on-surface-variant">Comic / Manga</p>
            <p className="font-display-lg text-3xl font-bold text-on-background mt-0.5">{comicCount}</p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-on-background pb-4">
          <h3 className="font-headline-md text-headline-md text-on-background">
            Book Catalog
          </h3>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant z-10" size={18} />
            <input
              type="text"
              placeholder="Search by book title or author name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border-2 border-on-background py-2.5 pl-10 pr-4 text-on-background font-body-md placeholder:text-on-surface-variant/70 rounded-lg outline-none focus:border-secondary shadow-brutal-sm"
            />
          </div>
        </div>

        {/* Medium Type Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['ALL', 'Book', 'Comic', 'AudioBook', 'Other'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 font-label-md text-xs font-bold rounded-full border-2 border-on-background transition-all whitespace-nowrap ${
                selectedType === type
                  ? 'bg-primary text-on-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]'
                  : 'bg-surface text-on-background hover:bg-surface-variant'
              }`}
            >
              {type === 'ALL' ? 'All Formats' : type === 'Book' ? 'Book' : type === 'Comic' ? 'Comic' : type === 'AudioBook' ? 'Audiobook' : 'Other'}
            </button>
          ))}
        </div>
      </section>

      {/* Book Grid - Styled with Compact Thumbnails matching ReadingLogs */}
      {filteredBooks.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const authorDisplayName = book.authorName || book.author?.name || 'Unknown Author';
            const yearStr = book.publishYear ? new Date(book.publishYear).getFullYear() : 'N/A';

            return (
              <div
                key={book.id || book.title}
                className="bg-surface border-2 border-on-background rounded-lg p-5 shadow-brutal-sm shadow-brutal-hover flex flex-col justify-between group cursor-pointer transition-all"
              >
                <div>
                  <div className="flex items-start gap-4 border-b-2 border-on-background/20 pb-4">
                    {/* Compact Thumbnail Container like ReadingLogs */}
                    <div className="w-16 h-22 shrink-0 rounded border-2 border-on-background bg-surface-dim overflow-hidden shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                      <img
                        src={book.coverImage || book.coverImageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-secondary text-on-secondary border border-on-background rounded-full text-[11px] font-caption font-bold">
                          {String(book.itemType)}
                        </span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-on-background line-clamp-2 leading-snug">
                        {book.title}
                      </h4>
                      <p className="font-caption text-caption text-on-surface-variant line-clamp-1 mt-1 flex items-center gap-1">
                        <User size={13} className="text-primary shrink-0" /> {authorDisplayName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-on-background/10 flex items-center justify-between text-xs font-caption text-on-surface-variant">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Layers size={14} className="text-secondary" /> {book.defaultPageCount} pgs
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-primary" /> {yearStr}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Add New Card Slot */}
          <div
            onClick={onNavigateToAdd}
            className="bg-surface-variant/40 border-2 border-dashed border-on-background rounded-lg p-6 shadow-brutal-sm hover:bg-surface-variant flex flex-col items-center justify-center cursor-pointer transition-all group min-h-[160px]"
          >
            <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform mb-2">add_circle</span>
            <h4 className="font-label-md text-label-md text-on-background text-center font-bold">Add New Book</h4>
          </div>
        </section>
      ) : (
        <div className="bg-surface border-2 border-on-background rounded-lg p-12 text-center max-w-md mx-auto shadow-brutal">
          <BookOpen size={48} className="mx-auto text-primary mb-3" />
          <h3 className="font-headline-md text-headline-md text-on-background mb-2">No Books Found</h3>
          <p className="font-body-md text-on-surface-variant text-sm mb-6">
            No books match your search criteria. You can add a new book to your collection.
          </p>
          <button
            onClick={onNavigateToAdd}
            className="py-2.5 px-6 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-sm font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 mx-auto"
          >
            <PlusCircle size={16} />
            <span>Add New Book</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import type { Book } from '../types/book';
import { Search, BookOpen, User, Calendar, FileText, PlusCircle, Sparkles, Headphones, BookMarked, Layers } from 'lucide-react';

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
    <div className="space-y-12 pb-16">
      {/* Welcome Banner */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-[#e4e2e1] leading-tight">
              Welcome back to <br />
              <span className="text-[#d4af37] italic font-black drop-shadow-lg rune-glow">The Scriptorium</span>
            </h1>
            <p className="font-label text-sm text-[#e4e2e1]/70 uppercase tracking-widest mt-2">
              Your Sanctum of Knowledge & Archival Ledger
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onNavigateToSearch} className="illuminated-btn bg-[#1b1c1c] text-[#d4af37] border-[#d4af37]/40">
              <Sparkles size={16} />
              <span>Import Title</span>
            </button>
            <button onClick={onNavigateToAdd} className="illuminated-btn">
              <PlusCircle size={16} />
              <span>Add New Folio</span>
            </button>
          </div>
        </div>

        <div className="mt-8 p-6 md:p-8 parchment-card rounded-sm shadow-2xl relative overflow-hidden max-w-3xl border-2 border-[#d4af37]">
          <p className="text-lg md:text-xl text-[#383014] font-body leading-relaxed">
            Your collection holds <span className="text-[#9e1b1b] font-black border-b-2 border-[#9e1b1b]/30">{books.length} manuscript{books.length === 1 ? '' : 's'}</span>. 
            Total archived volume spans <span className="text-[#9e1b1b] font-black">{totalPages.toLocaleString()} pages</span> across diverse literary mediums.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="parchment-card p-5 flex flex-col justify-between rounded-sm">
          <div className="flex items-center justify-between">
            <BookOpen className="text-[#9e1b1b]" size={32} />
            <span className="text-emerald-800 font-label text-[10px] font-bold uppercase tracking-widest">+100% Active</span>
          </div>
          <div className="mt-4">
            <p className="text-[#383014]/70 font-label uppercase tracking-widest text-[11px] font-bold">Total Books</p>
            <p className="text-3xl font-black text-[#383014] font-display mt-0.5">{books.length}</p>
          </div>
        </div>

        <div className="parchment-card p-5 flex flex-col justify-between rounded-sm">
          <div className="flex items-center justify-between">
            <FileText className="text-[#9e1b1b]" size={32} />
            <span className="text-[#383014]/70 font-label text-[10px] font-bold uppercase tracking-widest">Pages Tracked</span>
          </div>
          <div className="mt-4">
            <p className="text-[#383014]/70 font-label uppercase tracking-widest text-[11px] font-bold">Pages Count</p>
            <p className="text-3xl font-black text-[#383014] font-display mt-0.5">{totalPages.toLocaleString()}</p>
          </div>
        </div>

        <div className="parchment-card p-5 flex flex-col justify-between rounded-sm">
          <div className="flex items-center justify-between">
            <Headphones className="text-[#9e1b1b]" size={32} />
            <span className="text-[#383014]/70 font-label text-[10px] font-bold uppercase tracking-widest">Auditory</span>
          </div>
          <div className="mt-4">
            <p className="text-[#383014]/70 font-label uppercase tracking-widest text-[11px] font-bold">Audiobooks</p>
            <p className="text-3xl font-black text-[#383014] font-display mt-0.5">{audioCount}</p>
          </div>
        </div>

        <div className="parchment-card p-5 flex flex-col justify-between rounded-sm">
          <div className="flex items-center justify-between">
            <BookMarked className="text-[#9e1b1b]" size={32} />
            <span className="text-[#383014]/70 font-label text-[10px] font-bold uppercase tracking-widest">Illustrated</span>
          </div>
          <div className="mt-4">
            <p className="text-[#383014]/70 font-label uppercase tracking-widest text-[11px] font-bold">Comics</p>
            <p className="text-3xl font-black text-[#383014] font-display mt-0.5">{comicCount}</p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
          <h2 className="font-display text-2xl md:text-3xl text-[#d4af37] tracking-widest uppercase italic drop-shadow-md">
            Recent Archive
          </h2>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#383014]/60 z-10" size={18} />
            <input
              type="text"
              placeholder="Search library archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f4ecd8] border border-[#d4af37] py-2.5 pl-10 pr-4 text-[#383014] font-body placeholder:text-[#383014]/50 rounded-sm outline-none focus:ring-2 focus:ring-[#9e1b1b]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {['ALL', 'Book', 'AudioBook', 'EBook', 'Magazine', 'Journal', 'Comic'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-2.5 font-label text-xs font-bold uppercase tracking-widest transition-all rounded-sm whitespace-nowrap ${
                selectedType === type
                  ? 'bg-[#f4ecd8] text-[#383014] border-2 border-[#d4af37] shadow-md'
                  : 'bg-[#1a1512] text-[#d4af37]/70 border border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:text-[#d4af37]'
              }`}
            >
              {type === 'ALL' ? 'All Mediums' : type}
            </button>
          ))}
        </div>
      </section>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book) => {
            const authorDisplayName = book.authorName || book.author?.name || 'Unknown Scribe';
            const yearStr = book.publishYear ? new Date(book.publishYear).getFullYear() : 'N/A';

            return (
              <div key={book.id || book.title} className="parchment-card group cursor-pointer overflow-hidden rounded-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-60 w-full overflow-hidden border-b-2 border-[#d4af37]/30 bg-[#1b1c1c]">
                    <img
                      src={book.coverImageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'}
                      alt={book.title}
                      className="w-full h-full object-cover sepia-[0.35] group-hover:sepia-0 group-hover:scale-105 transition-all duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge-crimson">
                        {String(book.itemType)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-lg text-[#383014] font-black tracking-tight line-clamp-1 italic">
                      {book.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-label font-bold text-[#383014]/70 uppercase tracking-wider">
                      <User size={13} className="text-[#9e1b1b]" />
                      <span>{authorDisplayName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-[#383014]/15 flex items-center justify-between text-[11px] font-label font-black text-[#383014]/60 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Layers size={13} /> {book.defaultPageCount} Pages
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {yearStr}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <div className="parchment-card p-12 text-center max-w-lg mx-auto rounded-sm border-2 border-[#d4af37]">
          <BookOpen size={48} className="mx-auto text-[#9e1b1b] mb-4" />
          <h3 className="font-display text-xl font-bold text-[#383014] mb-2">No Folios Discovered</h3>
          <p className="font-body text-[#383014]/80 mb-6">
            No manuscripts match your filter parameters. Initiate a new entry into the archive below.
          </p>
          <button onClick={onNavigateToAdd} className="illuminated-btn">
            <PlusCircle size={16} />
            <span>Archive New Title</span>
          </button>
        </div>
      )}
    </div>
  );
};

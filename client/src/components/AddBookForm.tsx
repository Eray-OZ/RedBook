import React, { useState } from 'react';
import type { CreateBookDto, ItemType } from '../types/book';
import { PlusCircle, Book, User, Calendar, FileText, Link as LinkIcon, Hash, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface AddBookFormProps {
  onSubmit: (bookDto: CreateBookDto) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CreateBookDto>;
}

export const AddBookForm: React.FC<AddBookFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [itemType, setItemType] = useState<ItemType>((initialData?.itemType as ItemType) || 'Book');
  const [pageCount, setPageCount] = useState<number>(initialData?.defaultPageCount || 300);
  const [publishYear, setPublishYear] = useState<string>(
    initialData?.publishYear ? initialData.publishYear.substring(0, 10) : new Date().toISOString().substring(0, 10)
  );
  const [authorName, setAuthorName] = useState(initialData?.author?.name || '');
  const [authorBio, setAuthorBio] = useState(initialData?.author?.bio || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || '');
  const [googleBooksId] = useState(initialData?.googleBooksId || '');
  const [isbn, setIsbn] = useState(initialData?.isbn || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Book title is required.');
      return;
    }
    if (!authorName.trim()) {
      setErrorMsg('Author name is required.');
      return;
    }
    if (pageCount <= 0) {
      setErrorMsg('Page count must be greater than 0.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const dto: CreateBookDto = {
      title,
      itemType,
      defaultPageCount: Number(pageCount),
      publishYear: new Date(publishYear).toISOString(),
      googleBooksId: googleBooksId || undefined,
      isbn: isbn || undefined,
      coverImageUrl: coverImageUrl || undefined,
      author: {
        name: authorName,
        bio: authorBio || undefined,
      },
    };

    try {
      await onSubmit(dto);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to archive manuscript. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
        <div>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-[#d4af37] font-label text-xs font-bold uppercase tracking-widest hover:text-[#ffb4ac] transition-colors mb-2 ink-bleed-hover"
          >
            <ArrowLeft size={16} />
            <span>Return to Archive</span>
          </button>
          <h1 className="font-display text-3xl font-black text-[#e4e2e1] uppercase tracking-wider italic">
            Inscribe New Folio
          </h1>
          <p className="font-label text-xs text-[#e4e2e1]/70 uppercase tracking-widest mt-1">
            Record title, scribe metadata, and medium into the master library catalog.
          </p>
        </div>
      </div>

      {/* Form Container (Parchment Folio) */}
      <div className="parchment-card p-6 sm:p-10 rounded-sm border-2 border-[#d4af37] shadow-2xl">
        {errorMsg && (
          <div className="bg-[#9e1b1b]/20 border-2 border-[#9e1b1b] text-[#9e1b1b] p-4 rounded-sm mb-6 font-body font-bold text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Title & Type */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-[#383014] border-b border-[#383014]/20 pb-2 italic">
              1. Folio Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-label text-xs font-bold uppercase tracking-wider text-[#383014] flex items-center gap-1.5">
                  <Book size={14} className="text-[#9e1b1b]" /> Title of Manuscript *
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Name of the Rose"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 p-3 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label text-xs font-bold uppercase tracking-wider text-[#383014]">
                  Medium Format (ItemType) *
                </label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as ItemType)}
                  className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 p-3 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
                >
                  <option value="Book">Book (Hardcover/Paperback)</option>
                  <option value="EBook">EBook</option>
                  <option value="AudioBook">AudioBook</option>
                  <option value="Magazine">Magazine</option>
                  <option value="Journal">Academic Journal</option>
                  <option value="Comic">Comic / Graphic Novel</option>
                  <option value="Other">Other Archives</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-label text-xs font-bold uppercase tracking-wider text-[#383014] flex items-center gap-1.5">
                  <FileText size={14} className="text-[#9e1b1b]" /> Total Page Count *
                </label>
                <input
                  type="number"
                  min="1"
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 p-3 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label text-xs font-bold uppercase tracking-wider text-[#383014] flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#9e1b1b]" /> Publication Date *
                </label>
                <input
                  type="date"
                  value={publishYear}
                  onChange={(e) => setPublishYear(e.target.value)}
                  className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 p-3 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label text-xs font-bold uppercase tracking-wider text-[#383014] flex items-center gap-1.5">
                  <Hash size={14} className="text-[#9e1b1b]" /> ISBN Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 978-0141187761"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 p-3 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Author Details */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-[#383014] border-b border-[#383014]/20 pb-2 italic">
              2. Scribe & Author Attribution
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-label text-xs font-bold uppercase tracking-wider text-[#383014] flex items-center gap-1.5">
                  <User size={14} className="text-[#9e1b1b]" /> Author Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Umberto Eco"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 p-3 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label text-xs font-bold uppercase tracking-wider text-[#383014]">
                  Author Biography (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Historical details, biographical background, or notable achievements..."
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 p-3 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media Cover */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-[#383014] border-b border-[#383014]/20 pb-2 italic">
              3. Visual Illumination & Cover Art
            </h3>

            <div className="space-y-3">
              <label className="font-label text-xs font-bold uppercase tracking-wider text-[#383014] flex items-center gap-1.5">
                <LinkIcon size={14} className="text-[#9e1b1b]" /> Cover Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 p-3 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
              />

              {coverImageUrl && (
                <div className="mt-4 p-3 bg-[#1a1512] rounded-sm border border-[#d4af37]/40 flex items-center gap-4">
                  <div className="w-20 h-28 overflow-hidden rounded-sm border border-[#d4af37]">
                    <img
                      src={coverImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <span className="font-label text-xs text-[#d4af37] font-bold uppercase tracking-widest flex items-center gap-1">
                      <ImageIcon size={14} /> Illuminating Art Preview
                    </span>
                    <p className="font-body text-xs text-[#f4ecd8]/70 mt-1">
                      Visual asset loaded cleanly. Will display on folio card.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-[#383014]/20 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 font-label text-xs font-bold uppercase tracking-widest bg-[#1a1512] text-[#d4af37] border border-[#d4af37]/40 hover:border-[#d4af37] rounded-sm transition-colors"
            >
              Discard Entry
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="illuminated-btn"
            >
              <PlusCircle size={16} />
              <span>{isSubmitting ? 'Inscribing...' : 'Inscribe Title'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

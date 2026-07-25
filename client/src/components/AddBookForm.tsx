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
  const [authorName, setAuthorName] = useState(initialData?.authorDto?.name || '');
  const [authorBio, setAuthorBio] = useState(initialData?.authorDto?.bio || '');
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
      authorDto: {
        name: authorName,
        bio: authorBio || undefined,
      },
    };

    try {
      await onSubmit(dto);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add book. Check API connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-on-background pb-4">
        <div>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-primary font-label-md text-xs font-bold hover:underline mb-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Books</span>
          </button>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">
            Add New Book
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Fill in the details of the manuscript or volume to add to your library.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-surface border-2 border-on-background rounded-xl p-6 sm:p-10 shadow-brutal">
        {errorMsg && (
          <div className="bg-error-container border-2 border-on-background text-on-error-container p-4 rounded-lg mb-6 font-label-md font-bold text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Title & Type */}
          <div className="space-y-4">
            <h3 className="font-headline-md text-headline-md text-on-background border-b-2 border-on-background/20 pb-2">
              1. Book Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background flex items-center gap-1.5">
                  <Book size={14} className="text-primary" /> Book Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Lord of the Rings"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background">
                  Format *
                </label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as ItemType)}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
                >
                  <option value="Book">Print Book</option>
                  <option value="Comic">Comic / Manga</option>
                  <option value="AudioBook">Audiobook</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background flex items-center gap-1.5">
                  <FileText size={14} className="text-primary" /> Page Count *
                </label>
                <input
                  type="number"
                  min="1"
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" /> Publication Date *
                </label>
                <input
                  type="date"
                  value={publishYear}
                  onChange={(e) => setPublishYear(e.target.value)}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background flex items-center gap-1.5">
                  <Hash size={14} className="text-primary" /> ISBN Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="978-0141187761"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Author Details */}
          <div className="space-y-4">
            <h3 className="font-headline-md text-headline-md text-on-background border-b-2 border-on-background/20 pb-2">
              2. Author Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background flex items-center gap-1.5">
                  <User size={14} className="text-primary" /> Author Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. J.R.R. Tolkien"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background">
                  Author Bio (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Short author description..."
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media Cover */}
          <div className="space-y-4">
            <h3 className="font-headline-md text-headline-md text-on-background border-b-2 border-on-background/20 pb-2">
              3. Cover Image
            </h3>

            <div className="space-y-3">
              <label className="font-label-md text-xs font-bold text-on-background flex items-center gap-1.5">
                <LinkIcon size={14} className="text-primary" /> Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
              />

              {coverImageUrl && (
                <div className="mt-4 p-3 bg-surface-container-low rounded-lg border-2 border-on-background flex items-center gap-4">
                  <div className="w-16 h-24 overflow-hidden rounded border border-on-background">
                    <img
                      src={coverImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <span className="font-label-md text-xs text-secondary font-bold flex items-center gap-1">
                      <ImageIcon size={14} /> Cover Preview Loaded
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t-2 border-on-background/20 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 font-label-md text-xs font-bold bg-surface-container-highest text-on-background border-2 border-on-background rounded-lg shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-xs font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save Book'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

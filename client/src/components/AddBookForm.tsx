import React, { useState } from 'react';
import type { CreateBookDto, ItemType } from '../types/book';
import { PlusCircle, Book, User, Calendar, FileText, Link, Hash, ArrowLeft } from 'lucide-react';

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
      setErrorMsg(err.message || 'Failed to create book. Please check server connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="section-title-bar">
        <div>
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            style={{ marginBottom: '1rem', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Library</span>
          </button>
          <h1 className="section-title">Add New Book</h1>
          <p className="section-subtitle">
            Enter book details to save to your database collection.
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {errorMsg && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#fca5a5',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Main Book Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Book size={14} className="text-violet-400" />
                Book Title *
              </label>
              <input
                type="text"
                className="text-input"
                placeholder="e.g. The Lord of the Rings"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Format / Item Type *</label>
              <select
                className="select-input"
                value={itemType}
                onChange={(e) => setItemType(e.target.value as ItemType)}
              >
                <option value="Book" style={{ background: '#0f172a' }}>Book (Paperback/Hardcover)</option>
                <option value="EBook" style={{ background: '#0f172a' }}>EBook</option>
                <option value="AudioBook" style={{ background: '#0f172a' }}>AudioBook</option>
                <option value="Magazine" style={{ background: '#0f172a' }}>Magazine</option>
                <option value="Journal" style={{ background: '#0f172a' }}>Journal</option>
                <option value="Comic" style={{ background: '#0f172a' }}>Comic</option>
                <option value="Other" style={{ background: '#0f172a' }}>Other</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={14} />
                Default Page Count *
              </label>
              <input
                type="number"
                min="1"
                className="text-input"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} />
                Publication Date *
              </label>
              <input
                type="date"
                className="text-input"
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Hash size={14} />
                ISBN Number (Optional)
              </label>
              <input
                type="text"
                className="text-input"
                placeholder="e.g. 978-0547928227"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.5rem 0' }} />

          {/* Author Details */}
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Author Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} />
                Author Name *
              </label>
              <input
                type="text"
                className="text-input"
                placeholder="e.g. J.R.R. Tolkien"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Author Biography (Optional)</label>
              <textarea
                className="textarea-input"
                rows={3}
                placeholder="Short bio or background about the author..."
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.5rem 0' }} />

          {/* Image & External IDs */}
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-secondary)' }}>Media & Identifiers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Link size={14} />
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                className="text-input"
                placeholder="https://example.com/cover.jpg"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />
            </div>

            {coverImageUrl && (
              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                <span className="input-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Cover Image Preview:</span>
                <img
                  src={coverImageUrl}
                  alt="Preview"
                  style={{ height: '140px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <PlusCircle size={18} />
              <span>{isSubmitting ? 'Saving Book...' : 'Save Book to Library'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

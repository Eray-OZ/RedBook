import React, { useState } from 'react';
import type { ReadingLog, CreateLogDto, MarkLogDto, ReadingStatus, ItemType } from '../types/book';
import { ReadingLogService } from '../services/api';
import { PlusCircle, Star, Calendar, FileText, CheckCircle2, RotateCcw, Edit3, X, Link as LinkIcon, Hash } from 'lucide-react';

interface ReadingLogsProps {
  logs: ReadingLog[];
  onRefreshLogs: () => void;
  addToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ReadingLogs: React.FC<ReadingLogsProps> = ({ logs, onRefreshLogs, addToast }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLog, setEditingLog] = useState<ReadingLog | null>(null);

  // New Log Form State
  const [title, setTitle] = useState('');
  const [itemType, setItemType] = useState<ItemType>('Book');
  const [pageCount, setPageCount] = useState<number>(300);
  const [publishYear, setPublishYear] = useState<string>(new Date().toISOString().substring(0, 10));
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isbn, setIsbn] = useState('');
  const [googleBooksId, setGoogleBooksId] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('Reading');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [isReRead, setIsReRead] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);

  // Mark/Edit Log Form State
  const [markStatus, setMarkStatus] = useState<ReadingStatus>('Finished');
  const [finishDate, setFinishDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [readPages, setReadPages] = useState<number>(300);
  const [rating, setRating] = useState<number>(5);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredLogs = logs.filter(log => {
    if (filterStatus === 'ALL') return true;
    return log.status.toUpperCase() === filterStatus.toUpperCase();
  });

  const readingCount = logs.filter(l => l.status === 'Reading').length;
  const finishedCount = logs.filter(l => l.status === 'Finished').length;
  const totalPagesRead = logs.reduce((sum, l) => sum + (l.readPages || 0), 0);

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) {
      addToast('Kitap başlığı ve yazar adı zorunludur.', 'warning');
      return;
    }

    setIsCreating(true);
    const dto: CreateLogDto = {
      bookookDto: {
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
      },
      status,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      isReRead,
    };

    try {
      const { isMock } = await ReadingLogService.createLog(dto);
      if (isMock) {
        addToast(`[Demo Modu] Okuma günlüğü yerel hafızaya kaydedildi.`, 'info');
      } else {
        addToast(`"${title}" için okuma günlüğü veritabanına kaydedildi!`, 'success');
      }
      setShowCreateModal(false);
      resetCreateForm();
      onRefreshLogs();
    } catch (err: any) {
      addToast(err.message || 'Okuma günlüğü eklenemedi.', 'warning');
    } finally {
      setIsCreating(false);
    }
  };

  const resetCreateForm = () => {
    setTitle('');
    setItemType('Book');
    setPageCount(300);
    setPublishYear(new Date().toISOString().substring(0, 10));
    setAuthorName('');
    setAuthorBio('');
    setCoverImageUrl('');
    setIsbn('');
    setGoogleBooksId('');
    setStatus('Reading');
    setStartDate(new Date().toISOString().substring(0, 10));
    setIsReRead(false);
  };

  const openMarkModal = (log: ReadingLog) => {
    setEditingLog(log);
    setMarkStatus(log.status);
    setFinishDate(log.finishDate ? log.finishDate.substring(0, 10) : new Date().toISOString().substring(0, 10));
    setReadPages(log.readPages || 0);
    setRating(log.rating || 5);
    setReviewNotes(log.reviewNotes || '');
  };

  const handleMarkLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;

    setIsUpdating(true);
    const dto: MarkLogDto = {
      status: markStatus,
      finishDate: markStatus === 'Finished' ? new Date(finishDate).toISOString() : undefined,
      readPages: Number(readPages),
      rating: Number(rating),
      reviewNotes: reviewNotes || undefined,
    };

    try {
      const { isMock } = await ReadingLogService.markLog(editingLog.id, dto);
      if (isMock) {
        addToast(`[Demo Modu] Okuma durumu güncellendi.`, 'info');
      } else {
        addToast(`"${editingLog.bookName}" durumu veritabanında güncellendi!`, 'success');
      }
      setEditingLog(null);
      onRefreshLogs();
    } catch (err: any) {
      addToast(err.message || 'Güncelleme başarısız.', 'warning');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">
            Okuma İstatistiklerim
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Edebi serüveninin renkli özeti ve kişisel okuma günlüğün.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-4 py-2 bg-secondary-container border-2 border-on-background rounded-full font-label-md text-label-md shadow-[2px_2px_0px_0px_#1e1c10] transform -rotate-2">
            🌟 Süper Okuyucu
          </span>
          <button
            onClick={() => setShowCreateModal(true)}
            className="py-2.5 px-4 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-label-md shadow-brutal-sm hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#1e1c10] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Yeni Günlük Ekle</span>
          </button>
        </div>
      </div>

      {/* Bento Grid (Stats + Donut + Activity Wavy Graph) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Year in Review Stats (Spans 8 cols on desktop) */}
        <section className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {/* Stat Card 1 */}
          <div className="bg-primary-container border-2 border-on-background rounded-lg p-6 shadow-brutal flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-4 -top-4 opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform duration-500">
              <span className="material-symbols-outlined text-8xl">menu_book</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-primary-container mb-1 z-10">Okunan Kitap</h3>
            <div className="font-display-lg text-[56px] leading-none text-on-primary-container mt-4 z-10">{finishedCount}</div>
            <p className="font-label-md text-label-md text-on-primary-container mt-2 z-10">+12 geçen yıla göre</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-secondary-container border-2 border-on-background rounded-lg p-6 shadow-brutal flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-2 -bottom-4 opacity-20 transform -rotate-12 group-hover:-rotate-45 transition-transform duration-500">
              <span className="material-symbols-outlined text-8xl">auto_stories</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-secondary-container mb-1 z-10">Okunan Sayfa</h3>
            <div className="font-display-lg text-[48px] leading-tight text-on-secondary-container mt-4 z-10">
              {totalPagesRead.toLocaleString('tr-TR')}
            </div>
            <p className="font-label-md text-label-md text-on-secondary-container mt-2 z-10">Harika bir maraton!</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-tertiary-container border-2 border-on-background rounded-lg p-6 shadow-brutal flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 transform rotate-90 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-8xl">local_fire_department</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-tertiary-container mb-1 z-10">Devam Eden</h3>
            <div className="font-display-lg text-[56px] leading-none text-on-tertiary-container mt-4 z-10">{readingCount}</div>
            <p className="font-label-md text-label-md text-on-tertiary-container mt-2 z-10">Aktif okuma günlüğü</p>
          </div>
        </section>

        {/* Format Breakdown Donut (Spans 4 cols on desktop) */}
        <section className="col-span-1 md:col-span-4 bg-surface border-2 border-on-background rounded-lg p-6 shadow-brutal flex flex-col">
          <div className="flex justify-between items-center border-b-2 border-on-background pb-3 mb-4">
            <h3 className="font-headline-md text-headline-md text-on-background">Format Dağılımı</h3>
            <span className="material-symbols-outlined text-primary">pie_chart</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <svg className="w-36 h-36 transform -rotate-90 filter drop-shadow-[2px_2px_0px_#1e1c10]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="40" stroke="#e9e2d0" strokeWidth="16"></circle>
              <circle className="animate-draw" cx="50" cy="50" fill="none" r="40" stroke="#9a4600" strokeDasharray="251.2" strokeDashoffset="100.48" strokeLinecap="round" strokeWidth="16"></circle>
              <circle className="animate-draw" cx="50" cy="50" fill="none" r="40" stroke="#006970" strokeDasharray="251.2" strokeDashoffset="188.4" strokeLinecap="round" strokeWidth="16" style={{ animationDelay: '0.5s' }} transform="rotate(216 50 50)"></circle>
              <circle className="animate-draw" cx="50" cy="50" fill="none" r="40" stroke="#77574d" strokeDasharray="251.2" strokeDashoffset="213.52" strokeLinecap="round" strokeWidth="16" style={{ animationDelay: '1s' }} transform="rotate(306 50 50)"></circle>
              <circle cx="50" cy="50" fill="#fff9eb" r="26" stroke="#1e1c10" strokeWidth="2"></circle>
              <text fill="#1e1c10" fontFamily="Literata" fontSize="14" fontWeight="bold" textAnchor="middle" transform="rotate(90 50 50)" x="50" y="55">%100</text>
            </svg>

            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center justify-between font-label-md text-label-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary border border-on-background"></div>
                  <span>Basılı Kitap</span>
                </div>
                <span>%60</span>
              </div>
              <div className="flex items-center justify-between font-label-md text-label-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary border border-on-background"></div>
                  <span>E-Kitap</span>
                </div>
                <span>%25</span>
              </div>
              <div className="flex items-center justify-between font-label-md text-label-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-tertiary border border-on-background"></div>
                  <span>Sesli Kitap</span>
                </div>
                <span>%15</span>
              </div>
            </div>
          </div>
        </section>

        {/* Reading Activity Wavy Graph (Spans 12 cols) */}
        <section className="col-span-1 md:col-span-12 bg-surface-container-low border-2 border-on-background rounded-lg p-6 shadow-brutal">
          <div className="flex justify-between items-center border-b-2 border-on-background pb-3 mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-background">Okuma Aktivitesi</h3>
              <p className="font-caption text-caption text-on-surface-variant">Sayfa/Hafta Dağılımı</p>
            </div>
            <div className="bg-surface border-2 border-on-background rounded-full p-2 shadow-[2px_2px_0px_0px_#1e1c10]">
              <span className="material-symbols-outlined text-primary block">trending_up</span>
            </div>
          </div>
          <div className="w-full h-44 relative overflow-hidden rounded-lg border-2 border-on-background bg-surface-bright">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1e1c10 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <svg className="w-full h-full preserve-3d" preserveAspectRatio="none" viewBox="0 0 800 200">
              <path d="M 0 200 L 0 150 Q 100 120 200 160 T 400 90 T 600 140 T 800 50 L 800 200 Z" fill="#8df2fc" opacity="0.5"></path>
              <path className="filter drop-shadow-[2px_4px_0px_#1e1c10]" d="M 0 150 Q 100 120 200 160 T 400 90 T 600 140 T 800 50" fill="none" stroke="#006970" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
              <circle cx="100" cy="135" fill="#fff9eb" r="7" stroke="#1e1c10" strokeWidth="3"></circle>
              <circle cx="200" cy="160" fill="#fff9eb" r="7" stroke="#1e1c10" strokeWidth="3"></circle>
              <circle cx="300" cy="125" fill="#fff9eb" r="7" stroke="#1e1c10" strokeWidth="3"></circle>
              <circle cx="400" cy="90" fill="#fff9eb" r="7" stroke="#1e1c10" strokeWidth="3"></circle>
              <circle cx="500" cy="115" fill="#fff9eb" r="7" stroke="#1e1c10" strokeWidth="3"></circle>
              <circle cx="600" cy="140" fill="#fff9eb" r="7" stroke="#1e1c10" strokeWidth="3"></circle>
              <circle cx="700" cy="95" fill="#fff9eb" r="7" stroke="#1e1c10" strokeWidth="3"></circle>
              <circle cx="800" cy="50" fill="#fff9eb" r="7" stroke="#1e1c10" strokeWidth="3"></circle>
            </svg>
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 font-caption text-caption text-on-background bg-surface-bright/80 mx-2 rounded-full border border-on-background py-1">
              <span>Oca</span>
              <span>Mar</span>
              <span>May</span>
              <span>Tem</span>
              <span>Eyl</span>
              <span>Kas</span>
            </div>
          </div>
        </section>
      </div>

      {/* Filter and Logs Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-on-background pb-3">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history_edu</span>
            Okuma Günlükleri Listesi
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {['ALL', 'Reading', 'Finished', 'Dropped'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-1.5 font-label-md text-xs font-bold rounded-full border-2 border-on-background transition-all whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-primary text-on-primary shadow-[2px_2px_0px_0px_#1e1c10]'
                    : 'bg-surface text-on-background hover:bg-surface-variant'
                }`}
              >
                {st === 'ALL' ? 'Tümü' : st === 'Reading' ? 'Okunuyor' : st === 'Finished' ? 'Bitti' : 'Bırakıldı'}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Grid */}
        {filteredLogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-surface border-2 border-on-background rounded-lg p-5 shadow-brutal-sm shadow-brutal-hover flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-start gap-4 border-b-2 border-on-background/20 pb-4">
                    <div className="w-16 h-22 shrink-0 rounded border-2 border-on-background bg-surface-dim overflow-hidden shadow-[2px_2px_0px_0px_#1e1c10]">
                      <img
                        src={log.coverImage || log.coverImageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'}
                        alt={log.bookName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-secondary text-on-secondary border border-on-background rounded-full text-[11px] font-caption font-bold">
                          {log.itemType}
                        </span>
                        <span className={`px-2.5 py-0.5 border border-on-background rounded-full font-label-md text-xs font-bold ${
                          log.status === 'Reading' ? 'bg-secondary-container text-on-secondary-container' :
                          log.status === 'Finished' ? 'bg-primary-container text-on-primary-container' :
                          'bg-error-container text-on-error-container'
                        }`}>
                          {log.status === 'Reading' ? 'Okunuyor' : log.status === 'Finished' ? 'Tamamlandı' : 'Bırakıldı'}
                        </span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-on-background line-clamp-1">
                        {log.bookName}
                      </h4>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm font-label-md text-on-surface-variant">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-semibold text-on-background">
                        <Calendar size={15} className="text-primary" /> Başlangıç:
                      </span>
                      <span>{log.startDate ? new Date(log.startDate).toLocaleDateString('tr-TR') : 'N/A'}</span>
                    </div>

                    {log.finishDate && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-semibold text-on-background">
                          <CheckCircle2 size={15} className="text-secondary" /> Bitiş:
                        </span>
                        <span>{new Date(log.finishDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    )}

                    {log.readPages !== undefined && log.readPages !== null && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-semibold text-on-background">
                          <FileText size={15} className="text-primary" /> Okunan Sayfa:
                        </span>
                        <span className="font-bold text-on-background">{log.readPages}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-semibold text-on-background">Puan:</span>
                      <div className="flex items-center gap-1 text-primary">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={15}
                            className={star <= (log.rating || 0) ? 'fill-primary text-primary' : 'text-surface-dim'}
                          />
                        ))}
                        <span className="ml-1 text-xs font-bold text-on-background">({log.rating || 0})</span>
                      </div>
                    </div>

                    {log.isReRead && (
                      <div className="flex items-center gap-1 text-xs text-primary font-bold pt-1">
                        <RotateCcw size={13} /> Tekrar Okuma
                      </div>
                    )}

                    {log.reviewNotes && (
                      <div className="mt-3 p-3 bg-surface-container-low border-2 border-on-background rounded-lg font-body-md text-xs italic text-on-background">
                        "{log.reviewNotes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-on-background/20">
                  <button
                    onClick={() => openMarkModal(log)}
                    className="w-full py-2 bg-secondary text-on-secondary border-2 border-on-background rounded-lg font-label-md text-xs font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 size={14} />
                    <span>Güncelle / İncele</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border-2 border-on-background rounded-lg p-12 text-center max-w-md mx-auto shadow-brutal">
            <span className="material-symbols-outlined text-5xl text-primary mb-3">history_edu</span>
            <h3 className="font-headline-md text-headline-md text-on-background mb-2">Günlük Bulunamadı</h3>
            <p className="font-body-md text-on-surface-variant text-sm mb-6">
              Filtrenize uygun okuma günlüğü bulunamadı. Yeni bir günlük ekleyerek takibe başlayın.
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="py-2.5 px-6 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-sm font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
            >
              Yeni Günlük Oluştur
            </button>
          </div>
        )}
      </div>

      {/* CREATE LOG MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border-2 border-on-background rounded-xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-auto shadow-brutal relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-on-background hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="font-headline-md text-headline-md text-on-background border-b-2 border-on-background pb-3">
              Yeni Okuma Günlüğü Ekle
            </h2>

            <form onSubmit={handleCreateLog} className="mt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-label-md text-label-md text-primary font-bold">
                  Kitap Bilgileri
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Kitap Adı *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Örn. Suç ve Ceza"
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Format *</label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value as ItemType)}
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                    >
                      <option value="Book">Basılı Kitap</option>
                      <option value="Comic">Çizgi Roman / Manga</option>
                      <option value="AudioBook">Sesli Kitap</option>
                      <option value="Other">Diğer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Sayfa Sayısı *</label>
                    <input
                      type="number"
                      min="1"
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Yayın Tarihi *</label>
                    <input
                      type="date"
                      value={publishYear}
                      onChange={(e) => setPublishYear(e.target.value)}
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background flex items-center gap-1">
                      <Hash size={13} className="text-primary" /> ISBN Numarası
                    </label>
                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="978-0141187761"
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Yazar Adı *</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Örn. Fyodor Dostoyevski"
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Yazar Biyografisi</label>
                    <input
                      type="text"
                      value={authorBio}
                      onChange={(e) => setAuthorBio(e.target.value)}
                      placeholder="Kısa yazar bilgisi..."
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background flex items-center gap-1.5">
                      <LinkIcon size={14} className="text-primary" /> Kapak Görseli URL
                    </label>
                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t-2 border-on-background/20">
                <h3 className="font-label-md text-label-md text-primary font-bold">
                  Günlük Detayları
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Okuma Durumu *</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                    >
                      <option value="Reading">Okunuyor</option>
                      <option value="Finished">Tamamlandı</option>
                      <option value="Dropped">Bırakıldı</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Başlangıç Tarihi *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isReRead"
                      checked={isReRead}
                      onChange={(e) => setIsReRead(e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <label htmlFor="isReRead" className="font-label-md text-xs font-bold text-on-background cursor-pointer">
                      Bu tekrar okuduğum bir kitap
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-on-background/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-label-md text-xs font-bold bg-surface-container-highest text-on-background border-2 border-on-background rounded-lg shadow-brutal-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-xs font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
                >
                  {isCreating ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MARK / UPDATE LOG MODAL */}
      {editingLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border-2 border-on-background rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-brutal relative">
            <button
              onClick={() => setEditingLog(null)}
              className="absolute top-4 right-4 text-on-background hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="font-headline-md text-headline-md text-on-background border-b-2 border-on-background pb-3">
              Okuma İlerlemesini Güncelle
            </h2>
            <p className="font-label-md text-xs font-bold text-primary mt-2">
              Kitap: {editingLog.bookName}
            </p>

            <form onSubmit={handleMarkLog} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background">Durum *</label>
                <select
                  value={markStatus}
                  onChange={(e) => setMarkStatus(e.target.value as ReadingStatus)}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                >
                  <option value="Reading">Okunuyor</option>
                  <option value="Finished">Tamamlandı</option>
                  <option value="Dropped">Bırakıldı</option>
                </select>
              </div>

              {markStatus === 'Finished' && (
                <div className="space-y-1">
                  <label className="font-label-md text-xs font-bold text-on-background">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={finishDate}
                    onChange={(e) => setFinishDate(e.target.value)}
                    className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background">Okunan Sayfa</label>
                <input
                  type="number"
                  value={readPages}
                  onChange={(e) => setReadPages(Number(e.target.value))}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background">Puan (0.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background">İnceleme Notları</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Düşüncelerini ve notlarını buraya yaz..."
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                />
              </div>

              <div className="pt-4 border-t-2 border-on-background/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="px-4 py-2 font-label-md text-xs font-bold bg-surface-container-highest text-on-background border-2 border-on-background rounded-lg shadow-brutal-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-xs font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
                >
                  {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

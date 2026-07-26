import React, { useState, useEffect } from 'react';
import type { ReadingLog, CreateLogDto, MarkLogDto, ReadingStatus, ItemType, StatsByYear, StatsType, StatsStatus } from '../types/book';
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

  // Statistics API State
  const [statsByYear, setStatsByYear] = useState<StatsByYear[]>([]);
  const [statsType, setStatsType] = useState<StatsType[]>([]);
  const [statsStatus, setStatsStatus] = useState<StatsStatus[]>([]);

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

  // Fetch Statistics APIs
  const fetchStatistics = async () => {
    const [yearRes, typeRes, statusRes] = await Promise.all([
      ReadingLogService.getStatsByYear(),
      ReadingLogService.getStatsType(),
      ReadingLogService.getStatsStatus(),
    ]);
    setStatsByYear(yearRes.stats);
    setStatsType(typeRes.stats);
    setStatsStatus(statusRes.stats);
  };

  useEffect(() => {
    fetchStatistics();
  }, [logs]);

  const filteredLogs = logs.filter(log => {
    if (filterStatus === 'ALL') return true;
    return log.status.toUpperCase() === filterStatus.toUpperCase();
  });

  const readingCount = logs.filter(l => l.status === 'Reading').length;
  const finishedLogsCount = logs.filter(l => l.status === 'Finished').length;
  const logsPagesCount = logs.reduce((sum, l) => sum + (l.readPages || 0), 0);

  // Derive total read books, pages, and in-progress count from stats APIs (or fallback)
  const totalReadBooksFromApi = statsByYear.reduce((sum, s) => sum + s.readBooks, 0);
  const totalReadPagesFromApi = statsByYear.reduce((sum, s) => sum + s.readPages, 0);

  const displayReadBooks = totalReadBooksFromApi > 0 ? totalReadBooksFromApi : finishedLogsCount;
  const displayReadPages = totalReadPagesFromApi > 0 ? totalReadPagesFromApi : logsPagesCount;

  const readingStatusItem = statsStatus.find(s => s.status === 'Reading');
  const displayReadingCount = readingStatusItem !== undefined ? readingStatusItem.count : readingCount;

  // Format Distribution (Stats Type) Calculations
  const formatTotalCount = statsType.reduce((sum, s) => sum + s.count, 0) || 1;
  const bookCount = statsType.find(s => s.itemType === 'Book')?.count || 0;
  const comicCount = statsType.find(s => s.itemType === 'Comic')?.count || 0;
  const audioCount = statsType.find(s => s.itemType === 'AudioBook')?.count || 0;
  const otherCount = statsType.find(s => s.itemType === 'Other')?.count || 0;

  const bookPct = Math.round((bookCount / formatTotalCount) * 100);
  const comicPct = Math.round((comicCount / formatTotalCount) * 100);
  const audioPct = Math.round((audioCount / formatTotalCount) * 100);
  const otherPct = Math.max(0, 100 - bookPct - comicPct - audioPct);

  // Donut SVG Stroke Offsets
  const CIRCUMFERENCE = 251.2;
  const bookDashOffset = CIRCUMFERENCE * (1 - bookPct / 100);
  const comicDashOffset = CIRCUMFERENCE * (1 - comicPct / 100);
  const audioDashOffset = CIRCUMFERENCE * (1 - audioPct / 100);
  const otherDashOffset = CIRCUMFERENCE * (1 - otherPct / 100);

  const comicRotation = -90 + (bookPct / 100) * 360;
  const audioRotation = -90 + ((bookPct + comicPct) / 100) * 360;
  const otherRotation = -90 + ((bookPct + comicPct + audioPct) / 100) * 360;

  // Yearly Activity Chart Math (Extremely spacious vertical view)
  const activeYearStats = statsByYear.length > 0 ? statsByYear : [
    { year: 2023, readPages: 4200, readBooks: 12 },
    { year: 2024, readPages: 7800, readBooks: 20 },
    { year: 2025, readPages: 11200, readBooks: 32 },
    { year: 2026, readPages: 14205, readBooks: 42 },
  ];

  const maxPagesValue = Math.max(...activeYearStats.map(s => s.readPages), 100);
  const chartPoints = activeYearStats.map((item, idx) => {
    const totalCount = activeYearStats.length;
    const x = totalCount === 1 ? 500 : (idx / (totalCount - 1)) * 840 + 80;
    const y = 350 - (item.readPages / maxPagesValue) * 270;
    return { x, y, year: item.year, pages: item.readPages, books: item.readBooks };
  });

  const linePathD = chartPoints.length === 1
    ? `M 500 ${chartPoints[0].y}`
    : `M ${chartPoints[0].x} ${chartPoints[0].y} ` + chartPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  const areaPathD = chartPoints.length === 1
    ? `M 500 ${chartPoints[0].y} L 500 370 Z`
    : `${linePathD} L ${chartPoints[chartPoints.length - 1].x} 370 L ${chartPoints[0].x} 370 Z`;

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) {
      addToast('Book title and author name are required.', 'warning');
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
        addToast(`[Demo Mode] Reading log saved to local memory.`, 'info');
      } else {
        addToast(`Reading log for "${title}" saved to database!`, 'success');
      }
      setShowCreateModal(false);
      resetCreateForm();
      onRefreshLogs();
    } catch (err: any) {
      addToast(err.message || 'Failed to add reading log.', 'warning');
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
        addToast(`[Demo Mode] Reading status updated.`, 'info');
      } else {
        addToast(`Status for "${editingLog.bookName}" updated in database!`, 'success');
      }
      setEditingLog(null);
      onRefreshLogs();
    } catch (err: any) {
      addToast(err.message || 'Update failed.', 'warning');
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
            Reading Statistics
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            A colorful summary of your literary journey and personal reading log.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="py-2.5 px-4 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-label-md shadow-brutal-sm hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Add New Log</span>
          </button>
        </div>
      </div>

      {/* Bento Grid (Stats + Donut + Activity Wavy Graph) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Year in Review Stats (Spans 8 cols on desktop) */}
        <section className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {/* Stat Card 1: Books Read */}
          <div className="bg-primary-container border-2 border-on-background rounded-lg p-6 shadow-brutal flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-4 -top-4 opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform duration-500">
              <span className="material-symbols-outlined text-8xl">menu_book</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-primary-container mb-1 z-10">Books Read</h3>
            <div className="font-display-lg text-[56px] leading-none text-on-primary-container mt-4 z-10">
              {displayReadBooks}
            </div>
            <p className="font-label-md text-label-md text-on-primary-container mt-2 z-10">Total finished works</p>
          </div>

          {/* Stat Card 2: Pages Read */}
          <div className="bg-secondary-container border-2 border-on-background rounded-lg p-6 shadow-brutal flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-2 -bottom-4 opacity-20 transform -rotate-12 group-hover:-rotate-45 transition-transform duration-500">
              <span className="material-symbols-outlined text-8xl">auto_stories</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-secondary-container mb-1 z-10">Pages Read</h3>
            <div className="font-display-lg text-[48px] leading-tight text-on-secondary-container mt-4 z-10">
              {displayReadPages.toLocaleString('en-US')}
            </div>
            <p className="font-label-md text-label-md text-on-secondary-container mt-2 z-10">A great marathon!</p>
          </div>

          {/* Stat Card 3: In Progress */}
          <div className="bg-tertiary-container border-2 border-on-background rounded-lg p-6 shadow-brutal flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 transform rotate-90 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-8xl">local_fire_department</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-tertiary-container mb-1 z-10">In Progress</h3>
            <div className="font-display-lg text-[56px] leading-none text-on-tertiary-container mt-4 z-10">{displayReadingCount}</div>
            <p className="font-label-md text-label-md text-on-tertiary-container mt-2 z-10">Active reading logs</p>
          </div>
        </section>

        {/* Format Breakdown Donut (Spans 4 cols on desktop) */}
        <section className="col-span-1 md:col-span-4 bg-surface border-2 border-on-background rounded-lg p-6 shadow-brutal flex flex-col">
          <div className="flex justify-between items-center border-b-2 border-on-background pb-3 mb-4">
            <h3 className="font-headline-md text-headline-md text-on-background">Format Breakdown</h3>
            <span className="material-symbols-outlined text-primary">pie_chart</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <svg className="w-36 h-36 transform -rotate-90 filter drop-shadow-[2px_2px_0px_var(--shadow-color)]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="40" stroke="var(--color-surface-container-highest)" strokeWidth="16"></circle>

              {/* Book Slice */}
              {bookPct > 0 && (
                <circle
                  className="animate-draw"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="var(--color-primary)"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={`${bookDashOffset}`}
                  strokeLinecap="round"
                  strokeWidth="16"
                ></circle>
              )}

              {/* Comic Slice */}
              {comicPct > 0 && (
                <circle
                  className="animate-draw"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="var(--color-secondary)"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={`${comicDashOffset}`}
                  strokeLinecap="round"
                  strokeWidth="16"
                  style={{ animationDelay: '0.3s' }}
                  transform={`rotate(${comicRotation} 50 50)`}
                ></circle>
              )}

              {/* AudioBook Slice */}
              {audioPct > 0 && (
                <circle
                  className="animate-draw"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="var(--color-tertiary)"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={`${audioDashOffset}`}
                  strokeLinecap="round"
                  strokeWidth="16"
                  style={{ animationDelay: '0.6s' }}
                  transform={`rotate(${audioRotation} 50 50)`}
                ></circle>
              )}

              {/* Other Slice */}
              {otherPct > 0 && (
                <circle
                  className="animate-draw"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="var(--color-tertiary-container)"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={`${otherDashOffset}`}
                  strokeLinecap="round"
                  strokeWidth="16"
                  style={{ animationDelay: '0.9s' }}
                  transform={`rotate(${otherRotation} 50 50)`}
                ></circle>
              )}

              <circle cx="50" cy="50" fill="var(--color-surface)" r="26" stroke="var(--color-on-background)" strokeWidth="2"></circle>
              <text fill="var(--color-on-background)" fontFamily="Literata" fontSize="13" fontWeight="bold" textAnchor="middle" transform="rotate(90 50 50)" x="50" y="55">100%</text>
            </svg>

            {/* Legend */}
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center justify-between font-label-md text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary border border-on-background"></div>
                  <span>Print Book ({bookCount})</span>
                </div>
                <span className="font-bold">{bookPct}%</span>
              </div>
              <div className="flex items-center justify-between font-label-md text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary border border-on-background"></div>
                  <span>Comic / Manga ({comicCount})</span>
                </div>
                <span className="font-bold">{comicPct}%</span>
              </div>
              <div className="flex items-center justify-between font-label-md text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-tertiary border border-on-background"></div>
                  <span>Audiobook ({audioCount})</span>
                </div>
                <span className="font-bold">{audioPct}%</span>
              </div>
              {otherCount > 0 && (
                <div className="flex items-center justify-between font-label-md text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-tertiary-container border border-on-background"></div>
                    <span>Other ({otherCount})</span>
                  </div>
                  <span className="font-bold">{otherPct}%</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reading Activity Wavy Graph (Spans 12 cols) */}
        <section className="col-span-1 md:col-span-12 bg-surface-container-low border-2 border-on-background rounded-lg p-6 shadow-brutal">
          <div className="flex justify-between items-center border-b-2 border-on-background pb-3 mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-background">Reading Activity (By Year)</h3>
              <p className="font-caption text-caption text-on-surface-variant">Yearly Page Distribution (`GET /api/logs/stats-by-year`)</p>
            </div>
            <div className="bg-surface border-2 border-on-background rounded-full p-2 shadow-[2px_2px_0px_0px_var(--shadow-color)]">
              <span className="material-symbols-outlined text-primary block">trending_up</span>
            </div>
          </div>

          <div className="w-full h-[500px] relative overflow-hidden rounded-lg border-2 border-on-background bg-surface-bright p-4">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-on-background) 1px, transparent 1px)', backgroundSize: '28px 28px' }}></div>
            
            <svg className="w-full h-full preserve-3d" preserveAspectRatio="none" viewBox="0 0 1000 440">
              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const yVal = 350 - ratio * 270;
                const pageVal = Math.round(maxPagesValue * ratio);
                return (
                  <g key={i}>
                    <line x1="60" y1={yVal} x2="940" y2={yVal} stroke="var(--color-on-background)" strokeDasharray="6 6" strokeOpacity="0.15" strokeWidth="1.5" />
                    <text x="50" y={yVal + 4} fill="var(--color-on-background)" opacity="0.5" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="bold" textAnchor="end">
                      {pageVal.toLocaleString('en-US')}
                    </text>
                  </g>
                );
              })}

              {/* Filled Area */}
              <path d={areaPathD} fill="var(--color-secondary-container)" opacity="0.45"></path>
              
              {/* Line */}
              <path className="filter drop-shadow-[2px_4px_0px_var(--shadow-color)]" d={linePathD} fill="none" stroke="var(--color-secondary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>

              {/* Interactive Points & Page Labels */}
              {chartPoints.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    fill="var(--color-surface)"
                    r="10"
                    stroke="var(--color-on-background)"
                    strokeWidth="3.5"
                  />
                  {/* Text Badge background */}
                  <rect
                    x={pt.x - 50}
                    y={pt.y - 34}
                    width="100"
                    height="24"
                    rx="12"
                    fill="var(--color-on-background)"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 18}
                    fill="var(--color-background)"
                    fontFamily="Plus Jakarta Sans"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {pt.pages.toLocaleString('en-US')} pgs
                  </text>
                </g>
              ))}
            </svg>

            {/* Dynamic Year Labels on X-axis */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-10 font-caption text-caption text-on-background bg-surface-bright/95 mx-4 rounded-full border-2 border-on-background py-3 shadow-brutal-sm">
              {chartPoints.map((pt, i) => (
                <div key={i} className="font-bold flex items-center gap-2 text-sm">
                  <span>📅</span>
                  <span className="text-primary font-extrabold text-base">{pt.year}</span>
                  <span className="text-xs font-medium text-on-surface-variant">
                    {pt.books} books
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Filter and Logs Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-on-background pb-3">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history_edu</span>
            Reading Logs List
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {['ALL', 'Reading', 'Finished', 'Dropped'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-1.5 font-label-md text-xs font-bold rounded-full border-2 border-on-background transition-all whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-primary text-on-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]'
                    : 'bg-surface text-on-background hover:bg-surface-variant'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'Reading' ? 'Reading' : st === 'Finished' ? 'Finished' : 'Dropped'}
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
                    <div className="w-16 h-22 shrink-0 rounded border-2 border-on-background bg-surface-dim overflow-hidden shadow-[2px_2px_0px_0px_var(--shadow-color)]">
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
                          {log.status === 'Reading' ? 'Reading' : log.status === 'Finished' ? 'Finished' : 'Dropped'}
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
                        <Calendar size={15} className="text-primary" /> Start Date:
                      </span>
                      <span>{log.startDate ? new Date(log.startDate).toLocaleDateString('en-US') : 'N/A'}</span>
                    </div>

                    {log.finishDate && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-semibold text-on-background">
                          <CheckCircle2 size={15} className="text-secondary" /> Finish Date:
                        </span>
                        <span>{new Date(log.finishDate).toLocaleDateString('en-US')}</span>
                      </div>
                    )}

                    {log.readPages !== undefined && log.readPages !== null && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-semibold text-on-background">
                          <FileText size={15} className="text-primary" /> Pages Read:
                        </span>
                        <span className="font-bold text-on-background">{log.readPages}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-semibold text-on-background">Rating:</span>
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
                        <RotateCcw size={13} /> Re-read
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
                    <span>Update / Review</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border-2 border-on-background rounded-lg p-12 text-center max-w-md mx-auto shadow-brutal">
            <span className="material-symbols-outlined text-5xl text-primary mb-3">history_edu</span>
            <h3 className="font-headline-md text-headline-md text-on-background mb-2">No Logs Found</h3>
            <p className="font-body-md text-on-surface-variant text-sm mb-6">
              No reading log matches your filter. Start tracking by adding a new log.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="py-2.5 px-6 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-sm font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
            >
              Create New Log
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
              Add New Reading Log
            </h2>

            <form onSubmit={handleCreateLog} className="mt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-label-md text-label-md text-primary font-bold">
                  Book Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Book Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Crime and Punishment"
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
                      <option value="Book">Print Book</option>
                      <option value="Comic">Comic / Manga</option>
                      <option value="AudioBook">Audiobook</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Page Count *</label>
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
                    <label className="font-label-md text-xs font-bold text-on-background">Publish Date *</label>
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
                      <Hash size={13} className="text-primary" /> ISBN Number
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
                    <label className="font-label-md text-xs font-bold text-on-background">Author Name *</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Fyodor Dostoevsky"
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Author Bio</label>
                    <input
                      type="text"
                      value={authorBio}
                      onChange={(e) => setAuthorBio(e.target.value)}
                      placeholder="Short author description..."
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background flex items-center gap-1.5">
                      <LinkIcon size={14} className="text-primary" /> Cover Image URL
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
                  Log Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Reading Status *</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                      className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                    >
                      <option value="Reading">Reading</option>
                      <option value="Finished">Finished</option>
                      <option value="Dropped">Dropped</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-on-background">Start Date *</label>
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
                      This is a re-read book
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-xs font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
                >
                  {isCreating ? 'Saving...' : 'Save'}
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
              Update Reading Progress
            </h2>
            <p className="font-label-md text-xs font-bold text-primary mt-2">
              Book: {editingLog.bookName}
            </p>

            <form onSubmit={handleMarkLog} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background">Status *</label>
                <select
                  value={markStatus}
                  onChange={(e) => setMarkStatus(e.target.value as ReadingStatus)}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                >
                  <option value="Reading">Reading</option>
                  <option value="Finished">Finished</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>

              {markStatus === 'Finished' && (
                <div className="space-y-1">
                  <label className="font-label-md text-xs font-bold text-on-background">Finish Date</label>
                  <input
                    type="date"
                    value={finishDate}
                    onChange={(e) => setFinishDate(e.target.value)}
                    className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background">Pages Read</label>
                <input
                  type="number"
                  value={readPages}
                  onChange={(e) => setReadPages(Number(e.target.value))}
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-xs font-bold text-on-background">Rating (0.0 - 5.0)</label>
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
                <label className="font-label-md text-xs font-bold text-on-background">Review Notes</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Write your thoughts and notes here..."
                  className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg text-sm focus:border-secondary outline-none"
                />
              </div>

              <div className="pt-4 border-t-2 border-on-background/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="px-4 py-2 font-label-md text-xs font-bold bg-surface-container-highest text-on-background border-2 border-on-background rounded-lg shadow-brutal-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-primary text-on-primary border-2 border-on-background rounded-lg font-label-md text-xs font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

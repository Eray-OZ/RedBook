import { useState, useEffect } from 'react';
import { Navbar, type TabType } from './components/Navbar';
import { BookList } from './components/BookList';
import { AddBookForm } from './components/AddBookForm';
import { GoogleBooksSearch } from './components/GoogleBooksSearch';
import { ReadingLogs } from './components/ReadingLogs';
import { ApiTester } from './components/ApiTester';
import { BookService, ReadingLogService } from './services/api';
import type { Book, CreateBookDto, ReadingLog } from './types/book';
import { CheckCircle2, Info, AlertTriangle, Plus } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  text: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('logs');
  const [books, setBooks] = useState<Book[]>([]);
  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = String(Date.now());
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const loadBooks = async () => {
    const { books: fetchedBooks, isMock } = await BookService.getBooks();
    setBooks(fetchedBooks);
    setIsBackendOnline(!isMock);
  };

  const loadLogs = async () => {
    const { logs: fetchedLogs } = await ReadingLogService.getLogs();
    setLogs(fetchedLogs);
  };

  const refreshAll = async () => {
    await Promise.all([loadBooks(), loadLogs()]);
  };

  const checkHealth = async () => {
    const { online, message } = await BookService.checkHealth();
    setIsBackendOnline(online);
    addToast(message, online ? 'success' : 'info');
  };

  useEffect(() => {
    refreshAll();
    checkHealth();
  }, []);

  const handleCreateBook = async (dto: CreateBookDto) => {
    const { book, isMock } = await BookService.createBook(dto);
    await refreshAll();
    addToast(`"${book.title}" ${isMock ? 'demo belleğe' : 'veritabanına'} kaydedildi!`, 'success');
    setActiveTab('library');
  };

  return (
    <div className="bg-background text-on-background font-body-md text-body-md min-h-screen flex flex-col md:flex-row antialiased relative">
      {/* Navigation SideBar & Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendOnline={isBackendOnline}
        bookCount={books.length}
        logCount={logs.length}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto space-y-8">
          {activeTab === 'logs' && (
            <ReadingLogs
              logs={logs}
              onRefreshLogs={refreshAll}
              addToast={addToast}
            />
          )}

          {activeTab === 'library' && (
            <BookList
              books={books}
              onNavigateToAdd={() => setActiveTab('add')}
              onNavigateToSearch={() => setActiveTab('search')}
            />
          )}

          {activeTab === 'add' && (
            <AddBookForm
              onSubmit={handleCreateBook}
              onCancel={() => setActiveTab('library')}
            />
          )}

          {activeTab === 'search' && (
            <GoogleBooksSearch
              onImportBook={handleCreateBook}
              onNavigateToLibrary={() => setActiveTab('library')}
            />
          )}

          {activeTab === 'tester' && (
            <ApiTester
              isOnline={isBackendOnline}
              onRefreshHealth={checkHealth}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="w-full border-t-2 border-on-background flex flex-col md:flex-row justify-between items-center px-margin-desktop py-8 gap-gutter max-w-container-max mx-auto bg-surface-container-highest mt-12">
          <div className="font-headline-md text-headline-md text-primary">
            The Ledger
          </div>
          <div className="font-caption text-caption text-on-surface text-center md:text-left">
            © 2026 The Ledger. Tüm hakları saklıdır.
          </div>
          <div className="flex gap-4">
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Kütüphane</a>
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Gizlilik</a>
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Lonca</a>
          </div>
        </footer>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setActiveTab('add')}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-primary text-on-primary border-2 border-on-background rounded-full shadow-brutal flex items-center justify-center hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
        title="Yeni Kitap Ekle"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast border-2 border-on-background shadow-brutal-sm">
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-600" />}
            {toast.type === 'info' && <Info size={18} className="text-secondary" />}
            {toast.type === 'warning' && <AlertTriangle size={18} className="text-primary" />}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

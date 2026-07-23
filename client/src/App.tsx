import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BookList } from './components/BookList';
import { AddBookForm } from './components/AddBookForm';
import { GoogleBooksSearch } from './components/GoogleBooksSearch';
import { ApiTester } from './components/ApiTester';
import { BookService } from './services/api';
import type { Book, CreateBookDto } from './types/book';
import { CheckCircle2, Info, AlertTriangle, Plus } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  text: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<'library' | 'add' | 'search' | 'tester'>('library');
  const [books, setBooks] = useState<Book[]>([]);
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

  const checkHealth = async () => {
    const { online, message } = await BookService.checkHealth();
    setIsBackendOnline(online);
    addToast(message, online ? 'success' : 'info');
  };

  useEffect(() => {
    loadBooks();
    checkHealth();
  }, []);

  const handleCreateBook = async (dto: CreateBookDto) => {
    const { book, isMock } = await BookService.createBook(dto);
    setBooks((prev) => [book, ...prev]);
    addToast(`"${book.title}" inscribe into ${isMock ? 'demo storage' : 'database'}!`, 'success');
    setActiveTab('library');
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1] flex flex-col relative font-body">
      {/* Candlelight Flicker Vignette Overlay */}
      <div className="flicker-overlay"></div>

      {/* Navigation Sidebar & Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendOnline={isBackendOnline}
        bookCount={books.length}
      />

      {/* Main Content View Container */}
      <main className="flex-1 md:ml-64 px-4 sm:px-8 lg:px-12 pt-8 pb-20 max-w-7xl">
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

        {/* Archival Footer */}
        <footer className="mt-20 pt-8 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-label text-xs text-[#d4af37]/60">
          <p className="uppercase tracking-[0.3em]">
            © 2026 RedBook v2.1.0 • Built in Darkness
          </p>
          <p className="uppercase tracking-widest text-[10px]">
            Powered by React, Vite & .NET Core Web API
          </p>
        </footer>
      </main>

      {/* Floating Wax Seal Action Button (FAB) */}
      <button
        onClick={() => setActiveTab('add')}
        className="wax-seal-btn fixed bottom-8 right-8 z-50 group"
        title="Inscribe New Folio"
      >
        <Plus className="w-6 h-6 text-[#f4ecd8] group-hover:scale-125 transition-transform" />
      </button>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-[#9e1b1b]" />}
            {toast.type === 'info' && <Info size={18} className="text-[#d4af37]" />}
            {toast.type === 'warning' && <AlertTriangle size={18} className="text-amber-600" />}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

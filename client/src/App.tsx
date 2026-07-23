import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BookList } from './components/BookList';
import { AddBookForm } from './components/AddBookForm';
import { GoogleBooksSearch } from './components/GoogleBooksSearch';
import { ApiTester } from './components/ApiTester';
import { BookService } from './services/api';
import type { Book, CreateBookDto } from './types/book';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

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
    addToast(`"${book.title}" saved successfully to ${isMock ? 'demo storage' : 'database'}!`, 'success');
    setActiveTab('library');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendOnline={isBackendOnline}
        bookCount={books.length}
      />

      <main className="main-content" style={{ flex: 1 }}>
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

      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.85rem',
          marginTop: '4rem',
        }}
      >
        <p>ReadRate V2 — Powered by React 18, Vite & .NET Core Web API</p>
      </footer>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            {toast.type === 'warning' && <AlertTriangle size={18} />}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

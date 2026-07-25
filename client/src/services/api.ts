import axios from 'axios';
import type { Book, CreateBookDto, GoogleBookSearchResult, ReadingLog, CreateLogDto, MarkLogDto } from '../types/book';

// Base client for API requests
const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Fallback mock data when backend API is unavailable
const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Dune',
    itemType: 'Book',
    defaultPageCount: 688,
    publishYear: '1965-08-01T00:00:00Z',
    authorName: 'Frank Herbert',
    author: { name: 'Frank Herbert', bio: 'American science fiction author best known for the novel Dune.' },
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    isbn: '9780441172719',
  },
  {
    id: '2',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    itemType: 'Book',
    defaultPageCount: 464,
    publishYear: '2008-08-01T00:00:00Z',
    authorName: 'Robert C. Martin',
    author: { name: 'Robert C. Martin', bio: 'Software engineer and author, founder of Clean Code concepts.' },
    coverImageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
    isbn: '9780132350884',
  },
  {
    id: '3',
    title: 'The Hobbit',
    itemType: 'AudioBook',
    defaultPageCount: 310,
    publishYear: '1937-09-21T00:00:00Z',
    authorName: 'J.R.R. Tolkien',
    author: { name: 'J.R.R. Tolkien', bio: 'English writer, poet, philologist, and academic.' },
    coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    isbn: '9780547928227',
  }
];

const MOCK_LOGS: ReadingLog[] = [
  {
    id: '101',
    bookName: 'Dune',
    itemType: 'Book',
    status: 'Reading',
    startDate: '2026-01-10T00:00:00Z',
    readPages: 250,
    rating: 4.5,
    reviewNotes: 'Captivating world building and intricate political depth.',
    isReRead: false,
  },
  {
    id: '102',
    bookName: 'The Hobbit',
    itemType: 'AudioBook',
    status: 'Finished',
    startDate: '2025-12-01T00:00:00Z',
    finishDate: '2025-12-25T00:00:00Z',
    readPages: 310,
    rating: 5.0,
    reviewNotes: 'Masterpiece of fantasy story telling.',
    isReRead: true,
  }
];

let localMockBooks = [...MOCK_BOOKS];
let localMockLogs = [...MOCK_LOGS];

export const BookService = {
  // GET /api/book
  async getBooks(): Promise<{ books: Book[]; isMock: boolean }> {
    try {
      const response = await apiClient.get<any[]>('/book');
      const books: Book[] = (response.data || []).map((b: any) => {
        const cover = b.coverImage || b.coverImageUrl || b.coverUrl;
        return {
          ...b,
          coverImage: cover,
          coverImageUrl: cover,
        };
      });
      return { books, isMock: false };
    } catch (error) {
      console.warn('Backend API unavailable, using local mock data:', error);
      return { books: localMockBooks, isMock: true };
    }
  },

  // POST /api/book
  async createBook(bookDto: CreateBookDto): Promise<{ book: Book; isMock: boolean }> {
    try {
      const response = await apiClient.post<Book>('/book', bookDto);
      return { book: response.data, isMock: false };
    } catch (error: any) {
      if (error.response) {
        console.error('Backend returned error during createBook:', error.response.status, error.response.data);
        throw new Error(
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data) || `Backend HTTP Error ${error.response.status}`
        );
      }
      console.warn('Backend API unavailable, saving to local mock state:', error);
      const newBook: Book = {
        id: String(Date.now()),
        title: bookDto.title,
        itemType: bookDto.itemType,
        defaultPageCount: bookDto.defaultPageCount,
        publishYear: bookDto.publishYear,
        authorName: bookDto.authorDto?.name || 'Unknown Author',
        author: bookDto.authorDto,
        googleBooksId: bookDto.googleBooksId,
        isbn: bookDto.isbn,
        coverImage: bookDto.coverImageUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: bookDto.coverImageUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
      };
      localMockBooks = [newBook, ...localMockBooks];
      return { book: newBook, isMock: true };
    }
  },

  // GET /api/book/search-google-books?query=...
  async searchGoogleBooks(query: string): Promise<{ results: GoogleBookSearchResult[]; isMock: boolean }> {
    if (!query.trim()) return { results: [], isMock: false };
    try {
      const response = await apiClient.get<any[]>('/book/search-google-books', {
        params: { query },
      });
      
      const formattedResults: GoogleBookSearchResult[] = (response.data || []).map((item: any) => {
        const googleId = item.googleBooksId || item.id || String(Math.random());
        const title = item.title || item.volumeInfo?.title || 'Untitled Book';
        const authorName = item.authorName || item.volumeInfo?.authors?.[0] || 'Unknown Author';
        const pageCount = item.pageCount || item.volumeInfo?.pageCount || 200;
        const publishYear = item.publishYear || item.volumeInfo?.publishedDate || '2024';
        const coverImageUrl = item.coverImage || item.coverImageUrl || item.volumeInfo?.imageLinks?.thumbnail || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

        return {
          id: googleId,
          title,
          authorName,
          authors: [authorName],
          pageCount,
          publishedDate: publishYear,
          publishYear,
          description: item.description || 'Google Books search result',
          coverUrl: coverImageUrl,
          coverImageUrl,
        };
      });

      return { results: formattedResults, isMock: false };
    } catch (error) {
      console.warn('Backend Google Books search API error, querying Google Books directly for demo:', error);
      try {
        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
        const items = res.data.items || [];
        const formatted: GoogleBookSearchResult[] = items.map((item: any) => {
          const info = item.volumeInfo || {};
          const author = info.authors?.[0] || 'Unknown Author';
          const cover = info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';
          return {
            id: item.id,
            title: info.title || 'Untitled',
            authorName: author,
            authors: info.authors || [author],
            pageCount: info.pageCount || 150,
            publishedDate: info.publishedDate || '2023',
            publishYear: info.publishedDate || '2023',
            description: info.description || 'No description provided.',
            coverUrl: cover,
            coverImageUrl: cover,
            isbn: info.industryIdentifiers?.[0]?.identifier || '',
          };
        });
        return { results: formatted, isMock: true };
      } catch {
        return { results: [], isMock: true };
      }
    }
  },

  // Health check helper
  async checkHealth(): Promise<{ online: boolean; message: string }> {
    try {
      await apiClient.get('/book');
      return { online: true, message: 'Backend connected successfully (http://localhost:5233).' };
    } catch {
      return { online: false, message: 'Backend disconnected. Operating in Fallback/Demo mode.' };
    }
  }
};

export const ReadingLogService = {
  // GET /api/logs
  async getLogs(): Promise<{ logs: ReadingLog[]; isMock: boolean }> {
    try {
      const response = await apiClient.get<any[]>('/logs');
      const logs: ReadingLog[] = (response.data || []).map((l: any) => {
        const cover = l.coverImage || l.coverImageUrl || l.book?.coverImageUrl || l.book?.coverImage;
        return {
          ...l,
          coverImage: cover,
          coverImageUrl: cover,
        };
      });
      return { logs, isMock: false };
    } catch (error) {
      console.warn('Backend Log API unavailable, using local mock data:', error);
      return { logs: localMockLogs, isMock: true };
    }
  },

  // POST /api/logs
  async createLog(logDto: CreateLogDto): Promise<{ log: ReadingLog; isMock: boolean }> {
    try {
      const response = await apiClient.post<any>('/logs', logDto);
      const serverData = response.data;
      const cover = serverData.coverImage || serverData.coverImageUrl || serverData.book?.coverImageUrl || serverData.book?.coverImage;
      const formattedLog: ReadingLog = {
        id: serverData.id || String(Date.now()),
        bookName: serverData.bookName || serverData.book?.title || logDto.bookookDto.title,
        itemType: serverData.itemType || serverData.book?.itemType || logDto.bookookDto.itemType,
        status: serverData.status || logDto.status,
        startDate: serverData.startDate || logDto.startDate,
        finishDate: serverData.finishDate,
        readPages: serverData.readPages,
        rating: serverData.rating || 0,
        reviewNotes: serverData.reviewNotes,
        isReRead: serverData.isReRead ?? logDto.isReRead,
        coverImage: cover,
        coverImageUrl: cover,
      };
      return { log: formattedLog, isMock: false };
    } catch (error: any) {
      if (error.response) {
        console.error('Backend returned error during createLog:', error.response.status, error.response.data);
        throw new Error(
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data) || `Backend HTTP Error ${error.response.status}`
        );
      }
      console.warn('Backend Log API unavailable, saving to local mock state:', error);
      const newLog: ReadingLog = {
        id: String(Date.now()),
        bookName: logDto.bookookDto.title,
        itemType: logDto.bookookDto.itemType,
        status: logDto.status,
        startDate: logDto.startDate,
        rating: 0,
        isReRead: logDto.isReRead,
        coverImage: logDto.bookookDto.coverImageUrl,
        coverImageUrl: logDto.bookookDto.coverImageUrl,
      };
      localMockLogs = [newLog, ...localMockLogs];
      return { log: newLog, isMock: true };
    }
  },

  // PUT /api/logs/{id}
  async markLog(id: string, markDto: MarkLogDto): Promise<{ log: ReadingLog; isMock: boolean }> {
    try {
      const response = await apiClient.put<any>(`/logs/${id}`, markDto);
      const serverData = response.data;
      const cover = serverData.coverImage || serverData.coverImageUrl || serverData.book?.coverImageUrl || serverData.book?.coverImage;
      const formattedLog: ReadingLog = {
        id: serverData.id || id,
        bookName: serverData.bookName || serverData.book?.title || 'Manuscript',
        itemType: serverData.itemType || serverData.book?.itemType || 'Book',
        status: serverData.status || markDto.status,
        startDate: serverData.startDate,
        finishDate: serverData.finishDate || markDto.finishDate,
        readPages: serverData.readPages ?? markDto.readPages,
        rating: serverData.rating ?? markDto.rating,
        reviewNotes: serverData.reviewNotes ?? markDto.reviewNotes,
        isReRead: serverData.isReRead ?? false,
        coverImage: cover,
        coverImageUrl: cover,
      };
      return { log: formattedLog, isMock: false };
    } catch (error: any) {
      if (error.response) {
        console.error('Backend returned error during markLog:', error.response.status, error.response.data);
        throw new Error(
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data) || `Backend HTTP Error ${error.response.status}`
        );
      }
      console.warn('Backend Log API unavailable, updating local mock state:', error);
      const index = localMockLogs.findIndex(l => l.id === id);
      if (index !== -1) {
        localMockLogs[index] = {
          ...localMockLogs[index],
          status: markDto.status,
          finishDate: markDto.finishDate || localMockLogs[index].finishDate,
          readPages: markDto.readPages ?? localMockLogs[index].readPages,
          rating: markDto.rating ?? localMockLogs[index].rating,
          reviewNotes: markDto.reviewNotes ?? localMockLogs[index].reviewNotes,
        };
        return { log: localMockLogs[index], isMock: true };
      }
      throw error;
    }
  }
};

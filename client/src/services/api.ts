import axios from 'axios';
import type { Book, CreateBookDto, GoogleBookSearchResult } from '../types/book';

// Base client for API requests
const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Demo fallback mock data when backend is not running
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
    itemType: 'EBook',
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

let localMockBooks = [...MOCK_BOOKS];

export const BookService = {
  // GET /api/book
  async getBooks(): Promise<{ books: Book[]; isMock: boolean }> {
    try {
      const response = await apiClient.get<Book[]>('/book');
      return { books: response.data, isMock: false };
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
    } catch (error) {
      console.warn('Backend API unavailable, saving to local mock state:', error);
      const newBook: Book = {
        id: String(Date.now()),
        title: bookDto.title,
        itemType: bookDto.itemType,
        defaultPageCount: bookDto.defaultPageCount,
        publishYear: bookDto.publishYear,
        authorName: bookDto.author.name,
        author: bookDto.author,
        googleBooksId: bookDto.googleBooksId,
        isbn: bookDto.isbn,
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
        const volumeInfo = item.volumeInfo || item;
        const imageLinks = volumeInfo.imageLinks || {};
        return {
          id: item.id || volumeInfo.id || String(Math.random()),
          title: volumeInfo.title || 'Untitled Book',
          authors: volumeInfo.authors || (volumeInfo.author ? [volumeInfo.author] : ['Unknown Author']),
          pageCount: volumeInfo.pageCount || volumeInfo.defaultPageCount || 200,
          publishedDate: volumeInfo.publishedDate || volumeInfo.publishYear || '2024',
          description: volumeInfo.description || 'No description available.',
          coverUrl: imageLinks.thumbnail || imageLinks.smallThumbnail || volumeInfo.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
          isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || volumeInfo.isbn || '',
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
          return {
            id: item.id,
            title: info.title || 'Untitled',
            authors: info.authors || ['Unknown Author'],
            pageCount: info.pageCount || 150,
            publishedDate: info.publishedDate || '2023',
            description: info.description || 'No description provided.',
            coverUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
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

export type ItemType = 'Book' | 'AudioBook' | 'EBook' | 'Magazine' | 'Journal' | 'Comic' | 'Other';

export interface Author {
  id?: string;
  name: string;
  bio?: string;
}

export interface Book {
  id?: string;
  title: string;
  itemType: ItemType | string;
  defaultPageCount: number;
  publishYear: string;
  authorName?: string;
  author?: Author;
  googleBooksId?: string;
  isbn?: string;
  coverImageUrl?: string;
}

export interface CreateBookDto {
  title: string;
  itemType: ItemType;
  defaultPageCount: number;
  publishYear: string; // ISO date string e.g. "2024-01-01T00:00:00Z"
  googleBooksId?: string;
  isbn?: string;
  coverImageUrl?: string;
  author: {
    name: string;
    bio?: string;
  };
}

export interface GoogleBookSearchResult {
  id: string;
  title: string;
  authors?: string[];
  pageCount?: number;
  publishedDate?: string;
  description?: string;
  coverUrl?: string;
  isbn?: string;
}

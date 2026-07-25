export type ItemType = 'Book' | 'Comic' | 'AudioBook' | 'Other';

export type ReadingStatus = 'Reading' | 'Finished' | 'Dropped';

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
  coverImage?: string;
  coverImageUrl?: string;
}

export interface CreateAuthorDto {
  name: string;
  bio?: string;
}

export interface CreateBookDto {
  title: string;
  itemType: ItemType;
  defaultPageCount: number;
  publishYear: string; // ISO date string e.g. "2024-01-01T00:00:00Z"
  googleBooksId?: string;
  isbn?: string;
  coverImageUrl?: string;
  authorDto: CreateAuthorDto;
}

export interface GoogleBookSearchResult {
  id: string;
  title: string;
  authors?: string[];
  authorName?: string;
  pageCount?: number;
  publishedDate?: string;
  publishYear?: string;
  description?: string;
  coverUrl?: string;
  coverImageUrl?: string;
  isbn?: string;
}

export interface ReadingLog {
  id: string;
  bookName: string;
  itemType: ItemType;
  status: ReadingStatus;
  startDate?: string;
  finishDate?: string;
  readPages?: number;
  rating: number;
  reviewNotes?: string;
  isReRead: boolean;
  coverImage?: string;
  coverImageUrl?: string;
}

export interface CreateLogDto {
  bookookDto: CreateBookDto;
  status: ReadingStatus;
  startDate?: string;
  isReRead: boolean;
}

export interface MarkLogDto {
  status: ReadingStatus;
  finishDate?: string;
  readPages?: number;
  rating: number;
  reviewNotes?: string;
}

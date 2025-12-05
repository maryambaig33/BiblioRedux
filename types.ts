export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  price: number;
  condition: 'Fine' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  image: string;
  description: string;
  tags: string[];
  seller: string;
  isSigned?: boolean;
  isFirstEdition?: boolean;
}

export interface SearchState {
  query: string;
  isAI: boolean;
  loading: boolean;
  results: Book[];
  aiResponseText?: string;
}

export enum ViewState {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  DETAILS = 'DETAILS',
  AI_LIBRARIAN = 'AI_LIBRARIAN',
  VISUAL_SEARCH = 'VISUAL_SEARCH'
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  relatedBooks?: Book[];
}
import { Book } from './types';

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: '1925',
    price: 3500,
    condition: 'Very Good',
    image: 'https://picsum.photos/400/600?random=1',
    description: 'First edition, first printing. Original dark blue cloth with gilt lettering. A classic of the Jazz Age.',
    tags: ['Classic', 'Fiction', 'Jazz Age', 'Romance'],
    seller: 'Rare Finds NY',
    isFirstEdition: true
  },
  {
    id: '2',
    title: 'Dune',
    author: 'Frank Herbert',
    year: '1965',
    price: 1200,
    condition: 'Fine',
    image: 'https://picsum.photos/400/600?random=2',
    description: 'Signed by the author on the title page. A pristine copy of this science fiction masterpiece.',
    tags: ['Sci-Fi', 'Space', 'Adventure', 'Philosophy'],
    seller: 'SciFi World',
    isSigned: true,
    isFirstEdition: true
  },
  {
    id: '3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: '1813',
    price: 15000,
    condition: 'Good',
    image: 'https://picsum.photos/400/600?random=3',
    description: 'Third edition. Three volumes bound in contemporary calf. Some foxing throughout.',
    tags: ['Classic', 'Romance', '19th Century'],
    seller: 'London Antiquarian',
    isFirstEdition: false
  },
  {
    id: '4',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: '1937',
    price: 4500,
    condition: 'Very Good',
    image: 'https://picsum.photos/400/600?random=4',
    description: 'First edition, second impression. Includes original map. Light wear to spine.',
    tags: ['Fantasy', 'Adventure', 'Classic'],
    seller: 'Dragon Books',
    isFirstEdition: true
  },
  {
    id: '5',
    title: '1984',
    author: 'George Orwell',
    year: '1949',
    price: 2200,
    condition: 'Fine',
    image: 'https://picsum.photos/400/600?random=5',
    description: 'First edition in original dust jacket (unclipped). Red wrapper with "Searchlight books" logo.',
    tags: ['Dystopian', 'Classic', 'Political'],
    seller: 'Modern Firsts',
    isFirstEdition: true
  },
  {
    id: '6',
    title: 'Ulysses',
    author: 'James Joyce',
    year: '1922',
    price: 25000,
    condition: 'Fair',
    image: 'https://picsum.photos/400/600?random=6',
    description: 'One of 1000 copies on handmade paper. Rebound in blue morocco.',
    tags: ['Modernism', 'Classic', 'Experimental'],
    seller: 'Shakespeare & Co Archives',
    isFirstEdition: true
  },
  {
    id: '7',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    year: '1997',
    price: 8500,
    condition: 'Fine',
    image: 'https://picsum.photos/400/600?random=7',
    description: 'First edition, first printing with the "1 wand" error. Hardcover.',
    tags: ['Fantasy', 'Children', 'Modern Classic'],
    seller: 'Hogwarts Library Sales',
    isFirstEdition: true
  },
  {
    id: '8',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    year: '1951',
    price: 1800,
    condition: 'Very Good',
    image: 'https://picsum.photos/400/600?random=8',
    description: 'First edition with first issue dust jacket. Minor chipping at edges.',
    tags: ['Fiction', 'Classic', 'Coming of Age'],
    seller: 'NYC Books',
    isFirstEdition: true
  },
];

export const CATEGORIES = [
  "Modern First Editions",
  "Signed Books",
  "Fine Bindings",
  "Children's Classics",
  "Science Fiction",
  "Incunabula",
  "Maps & Atlases",
  "Manuscripts"
];
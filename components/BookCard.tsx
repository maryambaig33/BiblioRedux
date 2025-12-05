import React from 'react';
import { Book } from '../types';
import { ShoppingBag } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      onClick={() => onClick(book)}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-stone-100">
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {(book.isFirstEdition || book.isSigned) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {book.isFirstEdition && (
              <span className="bg-biblio-gold/90 text-white text-xs px-2 py-1 rounded-sm uppercase tracking-wider font-semibold shadow-sm backdrop-blur-sm">
                1st Edition
              </span>
            )}
            {book.isSigned && (
              <span className="bg-biblio-dark/90 text-white text-xs px-2 py-1 rounded-sm uppercase tracking-wider font-semibold shadow-sm backdrop-blur-sm">
                Signed
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-serif text-lg text-gray-900 leading-tight mb-1 group-hover:text-biblio-green transition-colors">
          {book.title}
        </h3>
        <p className="text-stone-500 text-sm mb-3 italic">{book.author}</p>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow font-light">
          {book.description}
        </p>

        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="text-biblio-dark font-bold font-serif">
            ${book.price.toLocaleString()}
          </div>
          <div className="text-xs text-stone-400 font-medium uppercase tracking-wide">
            {book.year}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
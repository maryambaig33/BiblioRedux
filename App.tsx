import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  BookOpen, 
  Camera, 
  Sparkles, 
  User,
  Heart,
  ChevronRight,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { MOCK_BOOKS, CATEGORIES } from './constants';
import { Book, ViewState } from './types';
import BookCard from './components/BookCard';
import VisualSearch from './components/VisualSearch';
import { askLibrarian } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>(MOCK_BOOKS);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  // Filter books based on simple text search (non-AI)
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(MOCK_BOOKS);
      return;
    }
    const lowerQ = searchQuery.toLowerCase();
    const filtered = MOCK_BOOKS.filter(b => 
      b.title.toLowerCase().includes(lowerQ) || 
      b.author.toLowerCase().includes(lowerQ) ||
      b.tags.some(t => t.toLowerCase().includes(lowerQ))
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  const handleAiSearch = async (overrideQuery?: string) => {
    const queryToUse = overrideQuery || searchQuery;
    if (!queryToUse) return;

    if (overrideQuery) {
      setSearchQuery(overrideQuery);
    }
    
    setIsAiLoading(true);
    setShowAiChat(true);
    setView(ViewState.AI_LIBRARIAN);
    
    try {
      const { text, recommendations } = await askLibrarian(queryToUse);
      setAiResponse(text);
      if (recommendations.length > 0) {
        setSearchResults(recommendations);
      } else {
        // If AI recommends nothing specific from inventory, keep previous results or clear
        // Here we'll just show all books to keep the UI populated but specific to the "Answer"
        setSearchResults([]); 
      }
    } catch (e) {
      setAiResponse("I apologize, I'm having trouble connecting to the archives.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const navigateToBook = (book: Book) => {
    setSelectedBook(book);
    setView(ViewState.DETAILS);
  };

  const goHome = () => {
    setView(ViewState.HOME);
    setSearchQuery('');
    setShowAiChat(false);
    setAiResponse(null);
    setSearchResults(MOCK_BOOKS);
  };

  return (
    <div className="min-h-screen font-sans text-stone-800 bg-biblio-paper flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
            <div className="bg-biblio-dark text-white p-2 rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-biblio-dark tracking-tight">BIBLIO<span className="text-biblio-gold">REDUX</span></h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-stone-600">
            <a href="#" className="hover:text-biblio-green transition-colors">Collections</a>
            <a href="#" className="hover:text-biblio-green transition-colors">Sellers</a>
            <a href="#" className="hover:text-biblio-green transition-colors">Rare Book Room</a>
            <a href="#" className="hover:text-biblio-green transition-colors">Sell</a>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <button className="p-2 hover:bg-stone-100 rounded-full transition-colors relative">
               <Heart size={20} />
            </button>
            <button className="p-2 hover:bg-stone-100 rounded-full transition-colors relative">
               <ShoppingBag size={20} />
               <span className="absolute top-1 right-1 w-2 h-2 bg-biblio-burgundy rounded-full"></span>
            </button>
            <button className="hidden sm:flex items-center gap-2 border border-stone-300 rounded-full px-4 py-1.5 hover:border-biblio-dark hover:text-biblio-dark transition-colors">
              <User size={18} />
              <span className="text-sm font-medium">Sign In</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* HERO SECTION - Only on Home */}
        {view === ViewState.HOME && (
          <div className="relative bg-biblio-dark text-biblio-cream overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1507842217121-9e9628376272?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-biblio-dark via-transparent to-transparent"></div>
            
            <div className="relative max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
              <span className="inline-block py-1 px-3 rounded-full bg-biblio-gold/20 text-biblio-gold text-xs font-bold tracking-widest uppercase mb-6 border border-biblio-gold/30">
                The World's Largest Rare Book Marketplace
              </span>
              <h2 className="font-display text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                Discover the <span className="text-biblio-gold italic">extraordinary</span> in print.
              </h2>
              <p className="text-lg sm:text-xl text-stone-300 mb-10 max-w-2xl mx-auto font-light">
                Explore millions of old, rare, and out-of-print books from independent booksellers worldwide.
              </p>

              {/* Enhanced Search Bar */}
              <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
                 <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Title, author, keyword, or describe a book..."
                      className="w-full py-4 pl-12 pr-4 bg-transparent outline-none text-gray-800 placeholder-stone-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                    />
                 </div>
                 <div className="flex items-center gap-2 w-full sm:w-auto px-2 sm:px-0 pb-2 sm:pb-0">
                    <button 
                      onClick={() => setIsVisualSearchOpen(true)}
                      className="p-3 text-stone-500 hover:bg-stone-100 rounded-xl transition-colors tooltip"
                      title="Visual Search"
                    >
                      <Camera size={20} />
                    </button>
                    <button 
                      onClick={() => handleAiSearch()}
                      className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-biblio-green hover:bg-biblio-dark text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg"
                    >
                      <Sparkles size={18} />
                      <span>Ask Librarian</span>
                    </button>
                 </div>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-stone-400">
                <span>Trending:</span>
                {['First Editions', 'Signed Copies', 'Sci-Fi 1960s', 'Leather Bound'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => handleAiSearch(tag)}
                    className="hover:text-biblio-gold underline decoration-biblio-gold/30 underline-offset-4 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI LIBRARIAN VIEW */}
        {view === ViewState.AI_LIBRARIAN && (
          <div className="max-w-7xl mx-auto px-4 py-8">
             <div className="mb-8">
                <button onClick={goHome} className="text-stone-500 hover:text-biblio-dark flex items-center gap-1 text-sm font-medium mb-4">
                  <ArrowRight className="rotate-180" size={16}/> Back to Home
                </button>
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                  <div className="bg-biblio-green/5 p-6 border-b border-biblio-green/10">
                    <div className="flex items-start gap-4">
                       <div className="bg-biblio-green text-white p-3 rounded-full shadow-md">
                          <Sparkles size={24} />
                       </div>
                       <div className="flex-grow">
                          <h3 className="font-serif text-xl font-bold text-biblio-dark mb-1">AI Librarian</h3>
                          <p className="text-stone-600 italic">"{searchQuery}"</p>
                       </div>
                    </div>
                  </div>
                  <div className="p-6">
                    {isAiLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="animate-spin text-biblio-gold mb-4" size={32} />
                        <p className="text-stone-500 font-serif animate-pulse">Consulting the archives...</p>
                      </div>
                    ) : (
                      <div className="prose prose-stone max-w-none">
                         <p className="text-lg text-gray-700 leading-relaxed font-serif">
                           {aiResponse}
                         </p>
                      </div>
                    )}
                  </div>
                </div>
             </div>

             {/* Results specific to AI Search */}
             {!isAiLoading && searchResults.length > 0 && (
                <div>
                   <h3 className="font-display text-2xl text-biblio-dark mb-6 border-b border-stone-200 pb-2">Recommended Volumes</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {searchResults.map(book => (
                        <BookCard key={book.id} book={book} onClick={navigateToBook} />
                      ))}
                   </div>
                </div>
             )}
             {!isAiLoading && searchResults.length === 0 && aiResponse && (
               <div className="text-center py-12 bg-stone-50 rounded-lg border border-stone-200 border-dashed">
                  <p className="text-stone-500">We couldn't find exact matches in our immediate catalog, but our partner sellers likely have stock.</p>
                  <button onClick={goHome} className="mt-4 text-biblio-green font-medium hover:underline">Browse all categories</button>
               </div>
             )}
          </div>
        )}

        {/* DETAILS VIEW */}
        {view === ViewState.DETAILS && selectedBook && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            <button onClick={goHome} className="mb-6 text-stone-500 hover:text-biblio-dark flex items-center gap-2 transition-colors">
              <ArrowRight className="rotate-180" size={16}/> Back to Search
            </button>
            
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="w-full md:w-1/3 bg-stone-100 p-8 flex items-center justify-center relative group">
                 <div className="relative shadow-2xl transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src={selectedBook.image} 
                      alt={selectedBook.title} 
                      className="max-w-full rounded-sm"
                    />
                    <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/20 to-transparent"></div>
                 </div>
              </div>

              {/* Info Section */}
              <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col">
                <div className="mb-auto">
                   <div className="flex items-center gap-2 mb-4">
                      {selectedBook.isFirstEdition && (
                        <span className="bg-biblio-gold text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-bold">First Edition</span>
                      )}
                      {selectedBook.isSigned && (
                        <span className="bg-biblio-dark text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-bold">Signed</span>
                      )}
                   </div>
                   
                   <h1 className="font-display text-4xl md:text-5xl text-biblio-dark mb-2">{selectedBook.title}</h1>
                   <p className="text-xl text-stone-500 italic font-serif mb-6">{selectedBook.author}, {selectedBook.year}</p>
                   
                   <div className="bg-biblio-paper p-6 rounded-lg mb-8 border border-stone-200">
                      <p className="text-stone-700 leading-relaxed font-light text-lg">
                        {selectedBook.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedBook.tags.map(tag => (
                          <span key={tag} className="text-xs font-semibold text-stone-500 bg-white border border-stone-200 px-3 py-1 rounded-full uppercase tracking-wide">{tag}</span>
                        ))}
                      </div>
                   </div>

                   <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 font-bold">
                        {selectedBook.seller.substring(0,2).toUpperCase()}
                     </div>
                     <div>
                       <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Sold By</p>
                       <p className="text-stone-800 font-medium">{selectedBook.seller}</p>
                     </div>
                     <div className="ml-auto text-yellow-500 text-sm flex gap-1">
                        {'★'.repeat(5)} <span className="text-stone-400">(124)</span>
                     </div>
                   </div>
                </div>

                <div className="border-t border-stone-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                   <div>
                     <p className="text-3xl font-serif text-biblio-dark font-bold">${selectedBook.price.toLocaleString()}</p>
                     <p className="text-sm text-stone-400">+ $5.00 Shipping</p>
                   </div>
                   <div className="flex gap-3 w-full sm:w-auto">
                     <button className="flex-1 sm:flex-none px-6 py-3 border border-stone-300 rounded-lg font-medium text-stone-600 hover:border-biblio-dark hover:text-biblio-dark transition-colors">
                       Add to Wishlist
                     </button>
                     <button className="flex-1 sm:flex-none px-8 py-3 bg-biblio-burgundy text-white rounded-lg font-medium shadow-lg hover:bg-red-900 transition-colors flex items-center justify-center gap-2">
                       <ShoppingBag size={18} /> Add to Cart
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT HOME LISTING (Featured) */}
        {view === ViewState.HOME && (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h2 className="font-display text-3xl text-biblio-dark">Featured Collections</h2>
                  <p className="text-stone-500 mt-2">Curated selections from our finest booksellers.</p>
               </div>
               <a href="#" className="hidden sm:flex items-center gap-1 text-biblio-gold font-medium hover:text-biblio-dark transition-colors">
                 View all collections <ChevronRight size={16} />
               </a>
            </div>

            {/* Categories */}
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mb-12">
              {CATEGORIES.map((cat, idx) => (
                <button 
                  key={idx}
                  className="whitespace-nowrap px-6 py-2 bg-white border border-stone-200 rounded-full text-stone-600 hover:bg-biblio-dark hover:text-white hover:border-biblio-dark transition-all duration-300 shadow-sm"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
               {MOCK_BOOKS.map(book => (
                 <BookCard key={book.id} book={book} onClick={navigateToBook} />
               ))}
            </div>
            
            {/* Newsletter */}
            <div className="mt-24 bg-white border border-stone-200 rounded-2xl p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-biblio-gold/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-biblio-green/10 rounded-full blur-3xl"></div>
               
               <h3 className="relative font-serif text-2xl text-biblio-dark mb-4">Join the Inner Circle</h3>
               <p className="relative text-stone-500 mb-8 max-w-lg mx-auto">Get notified about new arrivals, exclusive sales, and articles from the world of rare book collecting.</p>
               <div className="relative flex max-w-md mx-auto">
                 <input type="email" placeholder="Enter your email address" className="flex-grow px-4 py-3 bg-stone-50 border border-stone-200 rounded-l-lg outline-none focus:border-biblio-dark transition-colors" />
                 <button className="bg-biblio-dark text-white px-6 py-3 rounded-r-lg font-medium hover:bg-biblio-green transition-colors">Subscribe</button>
               </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-biblio-dark text-stone-400 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-6 text-white">
                <BookOpen size={24} />
                <span className="font-display text-xl font-bold">BIBLIOREDUX</span>
             </div>
             <p className="text-sm leading-relaxed mb-6">
               The premier independent marketplace for the world's most beautiful books. Connecting collectors with sellers since 2024.
             </p>
             <div className="flex gap-4">
                {/* Social icons placeholder */}
                <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"></div>
                <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"></div>
                <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"></div>
             </div>
           </div>
           
           <div>
             <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Shop</h4>
             <ul className="space-y-3 text-sm">
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Advanced Search</a></li>
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Textbook Buyback</a></li>
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Browse Collections</a></li>
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Gift Certificates</a></li>
             </ul>
           </div>
           
           <div>
             <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Support</h4>
             <ul className="space-y-3 text-sm">
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Order Status</a></li>
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Return Policy</a></li>
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Help & FAQ</a></li>
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Accessibility</a></li>
             </ul>
           </div>
           
           <div>
             <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">About</h4>
             <ul className="space-y-3 text-sm">
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Our Story</a></li>
               <li><a href="#" className="hover:text-biblio-gold transition-colors">BiblioRedux Green</a></li>
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Affiliate Program</a></li>
               <li><a href="#" className="hover:text-biblio-gold transition-colors">Careers</a></li>
             </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-xs text-center md:text-left flex flex-col md:flex-row justify-between">
           <p>&copy; 2025 BiblioRedux Inc. All rights reserved.</p>
           <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white">Privacy Policy</a>
             <a href="#" className="hover:text-white">Terms of Use</a>
           </div>
        </div>
      </footer>

      {/* Visual Search Modal */}
      {isVisualSearchOpen && (
        <VisualSearch onClose={() => setIsVisualSearchOpen(false)} />
      )}
      
    </div>
  );
};

export default App;
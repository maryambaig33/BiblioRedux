import React, { useState, useRef } from 'react';
import { Camera, X, Upload, ScanLine } from 'lucide-react';
import { identifyBookFromImage } from '../services/geminiService';

interface VisualSearchProps {
  onClose: () => void;
}

const VisualSearch: React.FC<VisualSearchProps> = ({ onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ title: string; analysis: string; tags: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Strip prefix for API
        const base64Data = base64.split(',')[1];
        setImage(base64);
        analyze(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async (base64Data: string) => {
    setAnalyzing(true);
    setError(null);
    try {
      const data = await identifyBookFromImage(base64Data);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl text-biblio-dark mb-2">Visual Antiquarian</h2>
            <p className="text-stone-500">Upload a photo of a book cover or spine to identify edition and value.</p>
          </div>

          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-biblio-gold hover:bg-biblio-cream transition-all group"
            >
              <div className="bg-stone-100 p-4 rounded-full mb-4 group-hover:bg-white group-hover:text-biblio-gold transition-colors">
                <Camera size={48} className="text-stone-400 group-hover:text-biblio-gold" />
              </div>
              <p className="font-medium text-stone-600">Click to upload or capture photo</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 relative rounded-lg overflow-hidden bg-black aspect-[3/4]">
                <img src={image} alt="Uploaded" className="w-full h-full object-contain" />
                {analyzing && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                    <ScanLine className="animate-pulse mb-2" size={48} />
                    <p className="font-mono text-sm tracking-widest uppercase">Analyzing...</p>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                {analyzing ? (
                  <div className="space-y-4">
                    <div className="h-8 bg-stone-100 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-stone-100 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-stone-100 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-stone-100 rounded animate-pulse w-5/6"></div>
                  </div>
                ) : result ? (
                  <div className="animate-fade-in-up">
                    <h3 className="font-serif text-2xl text-biblio-dark mb-4">{result.title}</h3>
                    <div className="prose prose-stone prose-sm mb-6">
                      <p>{result.analysis}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-biblio-paper border border-stone-200 text-stone-600 rounded-full text-xs font-medium uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => { setImage(null); setResult(null); }}
                      className="mt-8 text-biblio-gold hover:text-biblio-dark font-medium text-sm flex items-center gap-2"
                    >
                      <Upload size={16} /> Scan another book
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualSearch;
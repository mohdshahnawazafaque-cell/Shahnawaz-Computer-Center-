import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, ExternalLink } from 'lucide-react';
import { Promotion } from '../types';

interface PromotionsCarouselProps {
  promotions: Promotion[];
}

export const PromotionsCarousel: React.FC<PromotionsCarouselProps> = ({ promotions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  const activePromotions = promotions
    .filter(p => {
      if (!p.isActive) return false;
      if (p.startDate && p.startDate > today) return false;
      if (p.endDate && p.endDate < today) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (activePromotions.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePromotions.length);
    }, 5000); // Auto slide every 5 seconds
    return () => clearInterval(interval);
  }, [activePromotions.length]);

  if (activePromotions.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activePromotions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activePromotions.length) % activePromotions.length);
  };

  const currentPromo = activePromotions[currentIndex];

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 mt-4 relative group">
      <div className="absolute top-2 left-2 z-10 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
        प्रचार एवं विज्ञापन
      </div>

      {activePromotions.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div className="relative w-full overflow-hidden" style={{ minHeight: '200px' }}>
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {activePromotions.map((promo) => (
            <div key={promo.id} className="w-full shrink-0 relative flex flex-col md:flex-row bg-slate-50 dark:bg-slate-700">
              
              {/* Media Section */}
              <div className="w-full md:w-1/2 lg:w-3/5 h-48 md:h-64 lg:h-80 bg-slate-200 relative">
                {promo.videoUrl ? (
                  <iframe 
                    src={promo.videoUrl.includes('watch?v=') ? promo.videoUrl.replace('watch?v=', 'embed/') : promo.videoUrl} 
                    className="w-full h-full object-cover"
                    allowFullScreen 
                    allow="autoplay; encrypted-media"
                  />
                ) : promo.imageUrl ? (
                  <img 
                    src={promo.imageUrl} 
                    alt={promo.title}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
                    No Media Available
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 lg:w-2/5 p-4 md:p-6 flex flex-col justify-center bg-white dark:bg-slate-800 border-l border-slate-100 dark:border-slate-700">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight line-clamp-2">
                  {promo.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mb-4 line-clamp-3">
                  {promo.description}
                </p>
                
                <div className="mt-auto flex flex-wrap gap-2">
                  {promo.whatsAppNumber && (
                    <a 
                      href={`https://wa.me/${promo.whatsAppNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4 brightness-0 invert" />
                      WhatsApp
                    </a>
                  )}
                  {promo.contactNumber && (
                    <a 
                      href={`tel:${promo.contactNumber.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      <Phone size={16} />
                      कॉल करें
                    </a>
                  )}
                  {promo.promotionalLink && (
                    <a 
                      href={promo.promotionalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg transition-colors border border-indigo-200"
                    >
                      <ExternalLink size={16} />
                      अधिक जानकारी
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {activePromotions.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {activePromotions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-indigo-600 w-4' : 'bg-slate-300 hover:bg-slate-400'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

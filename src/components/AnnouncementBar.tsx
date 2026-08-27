import React, { useState, useEffect } from 'react';
import { Bell, ChevronLeft, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface AnnouncementBarProps {
  onNavigate: (path: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  const { announcements } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  const handleLinkClick = () => {
    if (!current.link) return;
    if (current.link.startsWith('http')) {
      window.open(current.link, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate(current.link);
    }
  };

  return (
    <div
      id="announcement-breaking-bar"
      className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white py-2 px-3 sm:px-4 shadow-sm border-b border-red-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex items-center gap-1 bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[11px] uppercase tracking-wider shadow-sm animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>{current.badge || 'BREAKING'}</span>
          </span>
          <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-800/60"></span>
        </div>

        {/* Announcement Text with animated transition */}
        <div
          onClick={handleLinkClick}
          className={`flex-1 overflow-hidden cursor-pointer hover:underline flex items-center gap-2 font-medium tracking-wide line-clamp-1 transition-all ${
            current.link ? 'cursor-pointer' : ''
          }`}
          title={current.text}
        >
          <span className="truncate">{current.text}</span>
          {current.link && <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-80" />}
        </div>

        {/* Controls for Multiple Announcements */}
        {announcements.length > 1 && (
          <div className="flex items-center gap-1 flex-shrink-0 bg-red-900/50 rounded-lg p-0.5 border border-red-500/30">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}
              className="p-1 hover:bg-red-700 rounded text-slate-200 hover:text-white"
              title="Previous Announcement"
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold px-1 text-amber-300">
              {currentIndex + 1}/{announcements.length}
            </span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
              className="p-1 hover:bg-red-700 rounded text-slate-200 hover:text-white"
              title="Next Announcement"
              aria-label="Next announcement"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

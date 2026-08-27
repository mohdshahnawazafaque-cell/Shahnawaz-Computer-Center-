import React, { useState, useEffect } from 'react';
import {
  ArrowUp,
  Share2,
  Calendar,
  DollarSign,
  Users,
  Link2,
  MessageSquare,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { Post } from '../types';

interface ReadingProgressBarProps {
  post: Post;
  onNavigate?: (path: string) => void;
  onShare?: () => void;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  post,
  onNavigate,
  onShare,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [estimatedMinutes, setEstimatedMinutes] = useState(3);
  const [activeSection, setActiveSection] = useState<string>('');

  // Calculate estimated reading time based on total content
  useEffect(() => {
    let wordCount = 0;
    wordCount += (post.title || '').split(/\s+/).length;
    wordCount += (post.shortDescription || '').split(/\s+/).length;
    wordCount += (post.department || '').split(/\s+/).length;
    wordCount += (post.state || '').split(/\s+/).length;
    (post.vacancies || []).forEach((v) => {
      wordCount += (v.postName || '').split(/\s+/).length;
      wordCount += (v.qualification || '').split(/\s+/).length;
    });
    (post.importantInstructions || []).forEach((ins) => {
      wordCount += ins.split(/\s+/).length;
    });
    (post.selectionProcess || []).forEach((sp) => {
      wordCount += sp.split(/\s+/).length;
    });
    (post.requiredDocuments || []).forEach((rd) => {
      wordCount += rd.split(/\s+/).length;
    });

    // Average reading speed: 180 words per minute for dense technical / notification tables
    const minutes = Math.max(2, Math.ceil(wordCount / 180));
    setEstimatedMinutes(minutes);
  }, [post]);

  // Scroll listener for progress calculation & active section spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable <= 0) {
        setScrollProgress(0);
        setIsHeaderVisible(false);
        return;
      }

      const rawProgress = (scrollY / totalScrollable) * 100;
      const boundedProgress = Math.min(100, Math.max(0, rawProgress));
      setScrollProgress(Math.round(boundedProgress));

      // Show floating sticky bar after scrolling past top banner (180px)
      setIsHeaderVisible(scrollY > 180);

      // Active Section Spy
      const sections = [
        { id: 'important-dates-section', label: 'dates' },
        { id: 'application-fee-section', label: 'fee' },
        { id: 'vacancy-details-section', label: 'vacancies' },
        { id: 'important-links-section', label: 'links' },
        { id: 'candidate-discussion-section', label: 'comments' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            setActiveSection(sections[i].label);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCompleted = scrollProgress >= 98;

  return (
    <div
      id="post-reading-progress-container"
      className="no-print"
      aria-label="Reading progress tracking bar"
    >
      {/* 1. ULTRA-SMOOTH FIXED TOP PROGRESS BAR */}
      <div
        className="fixed top-0 left-0 right-0 h-[4px] bg-slate-900/30 z-50 pointer-events-none"
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          id="reading-progress-fill-bar"
          className="h-full transition-all duration-150 ease-out relative"
          style={{
            width: `${scrollProgress}%`,
            background: isCompleted
              ? 'linear-gradient(90deg, #990000 0%, #EA580C 40%, #16A34A 80%, #00C853 100%)'
              : 'linear-gradient(90deg, #990000 0%, #DC2626 35%, #F59E0B 75%, #FBBF24 100%)',
            boxShadow: isCompleted
              ? '0 0 10px rgba(0, 200, 83, 0.7), 0 0 4px rgba(22, 163, 74, 0.9)'
              : '0 0 10px rgba(245, 158, 11, 0.7), 0 0 4px rgba(220, 38, 38, 0.9)',
          }}
        >
          {/* Shimmering Leading Edge Dot */}
          {scrollProgress > 0 && scrollProgress < 100 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white dark:bg-slate-800 shadow-md animate-pulse" />
          )}
        </div>
      </div>

      {/* 2. STICKY FLOATING POST READING BAR (Appears on Scroll) */}
      <div
        id="sticky-reading-header"
        className={`fixed top-0 left-0 right-0 z-40 bg-[#0B2545]/95 backdrop-blur-md text-white border-b border-slate-700/70 shadow-lg transition-all duration-300 transform ${
          isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-12 sm:h-13 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Home / Category & Post Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white dark:bg-slate-800/10 transition-colors flex-shrink-0 cursor-pointer hidden xs:flex items-center"
                title="Back to Home"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-red-600 text-white flex-shrink-0">
                  {post.category || 'Naukri'}
                </span>
                <span className="text-[10px] text-slate-300 font-medium flex-shrink-0 hidden sm:inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  ~{estimatedMinutes} min read
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate tracking-tight font-sans">
                {post.title}
              </h2>
            </div>
          </div>

          {/* Center: Quick Section Jump Anchors (Visible on desktop/tablets) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => scrollToSection('important-dates-section')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeSection === 'dates'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white dark:bg-slate-800/10'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Dates</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('application-fee-section')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeSection === 'fee'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white dark:bg-slate-800/10'
              }`}
            >
              <DollarSign className="w-3 h-3" />
              <span>Fee</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('vacancy-details-section')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeSection === 'vacancies'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white dark:bg-slate-800/10'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Vacancies</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('important-links-section')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeSection === 'links'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white dark:bg-slate-800/10'
              }`}
            >
              <Link2 className="w-3 h-3" />
              <span>Links</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('candidate-discussion-section')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeSection === 'comments'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white dark:bg-slate-800/10'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Q&A</span>
            </button>
          </div>

          {/* Right: Progress Pill & Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Live Progress Percentage Pill */}
            <div
              id="reading-progress-counter-badge"
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 border transition-all ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-white dark:bg-slate-800/10 text-amber-300 border-white/15'
              }`}
              title={`${scrollProgress}% of the notification viewed`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden xs:inline">Completed</span>
                  <span className="xs:hidden">100%</span>
                </>
              ) : (
                <>
                  {/* Mini Circular Progress Indicator */}
                  <svg className="w-3.5 h-3.5 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="opacity-20"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#F59E0B"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={56.54}
                      strokeDashoffset={56.54 - (56.54 * scrollProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{scrollProgress}%</span>
                </>
              )}
            </div>

            {/* Quick Direct Jump to Apply Links */}
            <button
              type="button"
              onClick={() => scrollToSection('important-links-section')}
              className="px-2.5 sm:px-3 py-1 bg-[#990000] hover:bg-red-700 text-amber-300 hover:text-white font-black text-xs rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
              title="Jump directly to official apply and notification links"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Apply / Links</span>
              <span className="sm:hidden">Apply</span>
            </button>

            {/* Share Trigger */}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer hidden md:flex items-center justify-center"
                title="Share this recruitment"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Scroll Back to Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer flex items-center justify-center"
              title="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

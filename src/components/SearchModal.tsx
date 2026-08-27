import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, ArrowRight, Tag, Building2, MapPin, Sparkles, Filter } from 'lucide-react';
import { Post, PostType } from '../types';
import { calculatePostStatus, getStatusBadgeConfig } from '../utils/statusCalculator';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (slug: string, type: PostType) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectPost }) => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.append('search', query.trim());
        if (selectedType !== 'all') params.append('type', selectedType);
        if (selectedState !== 'All') params.append('state', selectedState);
        params.append('limit', '25');

        const res = await fetch(`/api/posts?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.posts || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, selectedType, selectedState, isOpen]);

  if (!isOpen) return null;

  const typeTabs = [
    { label: 'All Updates', value: 'all' },
    { label: 'Sarkari Jobs', value: 'job' },
    { label: 'Admit Card', value: 'admit_card' },
    { label: 'Results', value: 'result' },
    { label: 'Answer Key', value: 'answer_key' },
    { label: 'Sarkari Yojana', value: 'sarkari_yojana' },
    { label: 'Scholarship', value: 'scholarship' },
    { label: 'Admission', value: 'admission' },
    { label: 'Syllabus', value: 'syllabus' },
    { label: 'Notices', value: 'notice' },
  ];

  const stateOptions = ['All', 'All India', 'Uttar Pradesh', 'Bihar', 'Delhi', 'Rajasthan', 'Madhya Pradesh', 'Haryana'];

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mt-4 sm:mt-12 flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 bg-[#0B2545] text-white flex items-center gap-3 border-b border-[#183d6a]">
          <Search className="w-5 h-5 text-red-400 flex-shrink-0" />
          <input
            id="global-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type Job Name, Board (SSC, UPSC, Railway), Result, Admit Card, Yojana..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-white dark:bg-slate-800/10 rounded text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            id="search-modal-close-btn"
            onClick={onClose}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Filters bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700 space-y-2">
          {/* Type filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 pl-1 pr-1 flex-shrink-0">
              <Filter className="w-3 h-3 text-red-600" /> Type:
            </span>
            {typeTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap text-xs font-semibold transition-all ${
                  selectedType === tab.value
                    ? 'bg-[#0B2545] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* State filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 pl-1 pr-1 flex-shrink-0">
              <MapPin className="w-3 h-3 text-blue-600" /> State:
            </span>
            {stateOptions.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  selectedState === st
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-slate-200/70 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              <div className="inline-block w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p>Searching database records...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">No matching updates found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching with different keywords like &quot;SSC&quot;, &quot;Police&quot;, &quot;Railway&quot;, &quot;Scholarship&quot;, &quot;Yojana&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase flex justify-between items-center px-1">
                <span>Found {results.length} results</span>
                <span>Click any item to view complete details</span>
              </div>
              {results.map((post) => {
                const status = calculatePostStatus(post);
                const badge = getStatusBadgeConfig(status);
                return (
                  <div
                    key={post.id}
                    id={`search-item-${post.id}`}
                    onClick={() => {
                      onSelectPost(post.slug, post.type);
                      onClose();
                    }}
                    className="p-3 sm:p-4 rounded-xl hover:bg-blue-50/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all cursor-pointer group bg-white dark:bg-slate-800 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${badge.bgClass} ${badge.borderClass}`}>
                        {badge.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {post.category}
                      </span>
                      {post.state && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" /> {post.state}
                        </span>
                      )}
                      {post.lastDate && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 ml-auto">
                          <Calendar className="w-3 h-3 text-red-500" />
                          <span>Last Date: <strong>{post.lastDate}</strong></span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-900 leading-snug">
                      {post.title}
                    </h4>

                    {post.shortDescription && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {post.shortDescription}
                      </p>
                    )}

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                        {post.department && (
                          <span className="flex items-center gap-1 truncate max-w-xs">
                            <Building2 className="w-3 h-3" /> {post.department}
                          </span>
                        )}
                        {post.totalVacancy && (
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {post.totalVacancy}
                          </span>
                        )}
                      </div>
                      <span className="text-blue-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
          <span>Search Shahnawaz Computer Center Portal</span>
          <span className="font-medium text-slate-600 dark:text-slate-300">Updated Daily</span>
        </div>
      </div>
    </div>
  );
};

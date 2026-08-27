import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  Calendar,
  Building2,
  Users,
  ChevronRight,
  ArrowRight,
  Clock,
  MapPin,
  Filter,
  GraduationCap,
  Bell,
  RefreshCw,
  ExternalLink,
  Briefcase,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Post, PostType } from '../types';
import { calculatePostStatus, getStatusBadgeConfig } from '../utils/statusCalculator';

interface RecentPostsWidgetProps {
  initialPosts?: Post[];
  title?: string;
  subtitle?: string;
  limit?: number;
  variant?: 'section' | 'sidebar' | 'compact';
  filterType?: PostType | 'all' | 'jobs';
  onSelectPost: (slug: string, type: PostType) => void;
  onNavigate?: (path: string) => void;
  className?: string;
}

export const RecentPostsWidget: React.FC<RecentPostsWidgetProps> = ({
  initialPosts,
  title = 'Recent Job Listings & Sarkari Updates',
  subtitle = 'Fresh government recruitment notifications, exam notices & online forms',
  limit = 8,
  variant = 'section',
  filterType = 'jobs',
  onSelectPost,
  onNavigate,
  className = '',
}) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [isLoading, setIsLoading] = useState(!initialPosts || initialPosts.length === 0);
  const [activeTab, setActiveTab] = useState<'all' | 'central' | 'state' | 'closing_soon' | 'admit_cards'>('all');
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const fetchRecentPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/posts?limit=40');
        if (res.ok && isMounted) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.warn('Failed to load recent posts for widget', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRecentPosts();
    return () => {
      isMounted = false;
    };
  }, [initialPosts]);

  // Filter posts based on active tab and search query
  const filteredPosts = useMemo(() => {
    let list = [...posts];

    // Filter by type preference if specified
    if (filterType === 'jobs') {
      list = list.filter((p) => p.type === 'job' || p.type === 'online_form' || p.type === 'admit_card' || p.type === 'result');
    } else if (filterType !== 'all') {
      list = list.filter((p) => p.type === filterType);
    }

    // Apply active tab logic
    if (activeTab === 'central') {
      list = list.filter(
        (p) =>
          p.category?.toLowerCase().includes('central') ||
          p.category?.toLowerCase().includes('ssc') ||
          p.category?.toLowerCase().includes('upsc') ||
          p.category?.toLowerCase().includes('railway') ||
          p.category?.toLowerCase().includes('bank') ||
          p.department?.toLowerCase().includes('ssc') ||
          p.department?.toLowerCase().includes('upsc') ||
          p.state === 'All India' ||
          !p.state
      );
    } else if (activeTab === 'state') {
      list = list.filter(
        (p) =>
          p.state &&
          p.state !== 'All India' &&
          (p.state.includes('Uttar Pradesh') || p.state.includes('Bihar') || p.state.includes('Delhi') || p.state.includes('Rajasthan'))
      );
    } else if (activeTab === 'closing_soon') {
      list = list.filter((p) => {
        const status = calculatePostStatus(p);
        return status === 'CLOSING SOON' || (p.lastDate && p.lastDate.toLowerCase().includes('2026'));
      });
    } else if (activeTab === 'admit_cards') {
      list = list.filter((p) => p.type === 'admit_card' || p.type === 'exam_date' || p.type === 'result');
    }

    // Search query within widget
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.department && p.department.toLowerCase().includes(q))
      );
    }

    return list.slice(0, limit);
  }, [posts, filterType, activeTab, filterSearch, limit]);

  // Compact Sidebar Variant
  if (variant === 'sidebar') {
    return (
      <aside
        id="recent-posts-sidebar-widget"
        className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col ${className}`}
      >
        {/* Widget Header */}
        <div className="bg-gradient-to-r from-[#0B2545] to-[#133A6B] p-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-red-600 text-white animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-white" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                {title || 'Latest Job Openings'}
              </h3>
              <p className="text-[10px] text-slate-300">Fresh Sarkari Naukri updates</p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('/category/latest-jobs')}
              className="text-[10px] font-extrabold text-amber-300 hover:text-white uppercase tracking-wider flex items-center gap-0.5"
            >
              <span>All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick Mini Tabs */}
        <div className="p-2 bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-700 flex items-center gap-1 overflow-x-auto text-[11px] scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors ${
              activeTab === 'all' ? 'bg-[#0B2545] text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Recent
          </button>
          <button
            onClick={() => setActiveTab('closing_soon')}
            className={`px-2 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors ${
              activeTab === 'closing_soon' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            ⏳ Closing Soon
          </button>
          <button
            onClick={() => setActiveTab('central')}
            className={`px-2 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors ${
              activeTab === 'central' ? 'bg-blue-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Central / SSC
          </button>
        </div>

        {/* Post Items List */}
        <div className="p-2.5 space-y-2 flex-1 divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-8 text-center text-slate-400 text-xs space-y-2">
              <div className="inline-block w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p>Loading latest jobs...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs">
              No recent posts matching tab.
            </div>
          ) : (
            filteredPosts.map((post, idx) => {
              const status = calculatePostStatus(post);
              const badge = getStatusBadgeConfig(status);

              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post.slug, post.type)}
                  className={`pt-2 first:pt-0 cursor-pointer group transition-all`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200">
                        {post.category}
                      </span>
                      {post.totalVacancy && (
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-1.5 py-0.2 rounded">
                          {post.totalVacancy} Posts
                        </span>
                      )}
                    </div>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded border ${badge.bgClass} ${badge.borderClass}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-700 transition-colors line-clamp-2 mt-1 leading-snug">
                    {post.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    {post.lastDate ? (
                      <span className="flex items-center gap-1 font-medium text-amber-900 bg-amber-50/80 px-1.5 py-0.2 rounded">
                        <Clock className="w-2.5 h-2.5 text-amber-600" />
                        <span>Last Date: {post.lastDate}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">{post.department || 'Govt Recruitment'}</span>
                    )}

                    <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform font-bold text-[10px] flex items-center">
                      View →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer View All CTA */}
        {onNavigate && (
          <div className="p-2.5 bg-slate-50 dark:bg-slate-700 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => onNavigate('/category/latest-jobs')}
              className="w-full py-1.5 bg-[#0B2545] hover:bg-[#133A6B] text-white text-xs font-extrabold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </aside>
    );
  }

  // Full-featured Section Variant (for HomePage and Main Layouts)
  return (
    <section
      id="recent-posts-showcase-widget"
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-6 overflow-hidden space-y-4 ${className}`}
    >
      {/* Top Header with title and controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {title}
              </h2>
              <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse hidden sm:inline-block">
                LIVE ALERTS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Action button */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('/category/latest-jobs')}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 hover:bg-red-50 hover:text-red-700 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-bold transition-colors shrink-0 self-start md:self-auto"
          >
            <span>View All ({posts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap text-xs ${
              activeTab === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            🌟 All Recent ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('central')}
            className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap text-xs ${
              activeTab === 'central'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            🏛️ Central / SSC / Railway
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap text-xs ${
              activeTab === 'state'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            🏢 State Jobs (UP/Bihar)
          </button>
          <button
            onClick={() => setActiveTab('closing_soon')}
            className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap text-xs ${
              activeTab === 'closing_soon'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            ⏳ Closing Soon
          </button>
          <button
            onClick={() => setActiveTab('admit_cards')}
            className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap text-xs ${
              activeTab === 'admit_cards'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            🪪 Admit Cards & Results
          </button>
        </div>
      </div>

      {/* Posts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-8 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredPosts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-700 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <Sparkles className="w-6 h-6 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No recruitment notices match this filter.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="text-xs text-blue-700 font-bold hover:underline"
            >
              Reset to All Recent Posts
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const status = calculatePostStatus(post);
            const badge = getStatusBadgeConfig(status);

            return (
              <div
                key={post.id}
                id={`recent-widget-post-${post.id}`}
                onClick={() => onSelectPost(post.slug, post.type)}
                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:bg-slate-700/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                <div>
                  {/* Category & Status Badges */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 truncate max-w-[120px]">
                      {post.category}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${badge.bgClass} ${badge.borderClass} shrink-0`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Meta Details: Department & Vacancy */}
                  <div className="mt-2.5 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    {post.department && (
                      <div className="flex items-center gap-1 truncate text-slate-500 dark:text-slate-400 font-medium">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{post.department}</span>
                      </div>
                    )}
                    {post.totalVacancy && (
                      <div className="flex items-center gap-1 font-bold text-emerald-800">
                        <Users className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{post.totalVacancy} Vacancies</span>
                      </div>
                    )}
                    {post.educationalQualification && (
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate text-[10px]">
                        <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{post.educationalQualification}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Dates & Apply Arrow */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                  {post.lastDate ? (
                    <div className="text-amber-900 font-semibold flex items-center gap-1 text-[10px]">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Last: {post.lastDate}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">Apply Online</span>
                  )}

                  <span className="font-bold text-xs text-blue-700 group-hover:text-red-600 flex items-center gap-0.5 transition-colors">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

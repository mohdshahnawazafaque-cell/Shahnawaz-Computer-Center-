import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Filter,
  Search,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Award,
  CreditCard,
  Key,
  BookOpen,
  HelpCircle,
  GraduationCap,
  Bell,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { Post, PostType } from '../types';
import { JobCard } from '../components/JobCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdPlacement } from '../components/AdPlacement';
import { RecentPostsWidget } from '../components/RecentPostsWidget';
import { SarkariYojanaSection } from '../components/SarkariYojanaSection';
import { SEOHead } from '../components/SEOHead';
import { useSettings } from '../context/SettingsContext';
import { getClientPosts } from '../utils/clientStorage';

interface CategoryPageProps {
  categorySlug: string;
  onNavigate: (path: string) => void;
  onSelectPost: (slug: string, type: PostType) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  onNavigate,
  onSelectPost,
}) => {
  const { categories } = useSettings();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Convert slug to readable title or determine type with rich alias mapping
  const getCategoryMeta = useCallback(
    (slug: string) => {
      const normalizedSlug = (slug || '').toLowerCase().trim();

      switch (normalizedSlug) {
        case 'vacancy':
        case 'vacancies':
        case 'sarkari-naukri':
        case 'latest-jobs':
        case 'jobs':
        case 'job':
        case 'new-recruitment':
        case 'career-education':
          return {
            title: 'Sarkari Naukri & Latest Vacancies',
            type: 'job' as PostType,
            desc: 'Find all Central & State Government Recruitment Online Forms, Official Notifications, and Verified Vacancies.',
            icon: Briefcase,
          };
        case 'admit-card':
        case 'admit_card':
        case 'admit-cards':
        case 'admitcard':
        case 'hall-ticket':
        case 'call-letter':
          return {
            title: 'Admit Cards & Hall Tickets',
            type: 'admit_card' as PostType,
            desc: 'Download Official Admit Cards, Call Letters, and Exam City Information Slips for all Government Exams.',
            icon: CreditCard,
          };
        case 'result':
        case 'results':
        case 'sarkari-result':
        case 'sarkari-results':
        case 'merit-list':
          return {
            title: 'Sarkari Results & Merit Lists',
            type: 'result' as PostType,
            desc: 'Check latest Sarkari Exam Results, Scorecards, Cut-off Marks, and Final Selection Lists directly from official boards.',
            icon: Award,
          };
        case 'answer-key':
        case 'answer_key':
        case 'answer-keys':
        case 'objection-tracker':
          return {
            title: 'Official Answer Key & Challenges',
            type: 'answer_key' as PostType,
            desc: 'Download CBT & Written Exam Answer Keys with Direct Objection Submission Links.',
            icon: Key,
          };
        case 'syllabus':
        case 'exam-pattern':
        case 'previous-papers':
          return {
            title: 'Exam Syllabus & Pattern',
            type: 'syllabus' as PostType,
            desc: 'Download Detailed Examination Syllabus PDFs, Scheme of Exam, and Selection Patterns.',
            icon: BookOpen,
          };
        case 'sarkari-yojana':
        case 'sarkari_yojana':
        case 'government-schemes':
        case 'yojana':
          return {
            title: 'Sarkari Yojana & PM Schemes',
            type: 'sarkari_yojana' as PostType,
            desc: 'Official Government Schemes, Welfare Programs, Subsidies & Direct Benefit Transfers (DBT).',
            icon: HelpCircle,
          };
        case 'scholarship':
        case 'scholarships':
        case 'nsp-scholarship':
          return {
            title: 'Scholarship Forms & Status',
            type: 'scholarship' as PostType,
            desc: 'UP Pre & Post Matric Scholarship, NSP National Scholarship Portal Updates & Renewal Links.',
            icon: GraduationCap,
          };
        case 'admission':
        case 'admissions':
        case 'entrance-exam':
          return {
            title: 'Admissions & Entrance Exams',
            type: 'admission' as PostType,
            desc: 'University Admissions, NEET, CUET, ITI, Polytechnic, B.Ed & Board Admission Application Forms.',
            icon: GraduationCap,
          };
        case 'online-forms':
        case 'online_form':
          return {
            title: 'Online Application Forms',
            type: 'online_form' as PostType,
            desc: 'Apply online for certificates, pan card, passport, driving licence, and public utility services.',
            icon: Sparkles,
          };
        case 'important-notices':
        case 'notice':
        case 'notices':
          return {
            title: 'Important Exam Notices',
            type: 'notice' as PostType,
            desc: 'Urgent announcements, date extensions, cancellation notices, and public employment press releases.',
            icon: Bell,
          };
        case 'exam-date-city':
        case 'exam_date':
          return {
            title: 'Exam Date & City Intimation',
            type: 'exam_date' as PostType,
            desc: 'Check examination schedule, shift timings, and advance city intimation slips.',
            icon: MapPin,
          };
        default: {
          const found = categories.find(
            (c) =>
              c.slug?.toLowerCase() === normalizedSlug ||
              c.id?.toLowerCase() === normalizedSlug ||
              c.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug
          );
          return {
            title: found?.name || slug.replace(/[-_]/g, ' ').toUpperCase(),
            type: found?.type,
            desc:
              found?.description ||
              `Government examination, recruitment notifications, and public welfare updates for ${slug.replace(/[-_]/g, ' ')}.`,
            icon: Briefcase,
          };
        }
      }
    },
    [categories]
  );

  const meta = getCategoryMeta(categorySlug);

  const fetchCategoryPosts = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setCurrentPage(1);
    try {
      const params = new URLSearchParams();
      if (meta.type) {
        params.append('type', meta.type);
      } else {
        params.append('category', categorySlug);
      }
      params.append('limit', '250');

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } else {
        // Fallback fetch all posts if category filter was strictly unmatched or offline
        const allList = getClientPosts();
        const matched = allList.filter((p: Post) => {
          const cLower = (categorySlug || '').toLowerCase().replace(/[-_]/g, ' ');
          return (
            p.type === meta.type ||
            p.category.toLowerCase().includes(cLower) ||
            (p.department && p.department.toLowerCase().includes(cLower))
          );
        });
        setPosts(matched.length > 0 ? matched : allList);
      }
    } catch (err) {
      const allList = getClientPosts();
      const matched = allList.filter((p: Post) => {
        const cLower = (categorySlug || '').toLowerCase().replace(/[-_]/g, ' ');
        return (
          p.type === meta.type ||
          p.category.toLowerCase().includes(cLower) ||
          (p.department && p.department.toLowerCase().includes(cLower))
        );
      });
      setPosts(matched.length > 0 ? matched : allList);
      setHasError(false);
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug, meta.type]);

  useEffect(() => {
    fetchCategoryPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchCategoryPosts]);

  const stateList = ['All', 'All India', 'Uttar Pradesh', 'Bihar', 'Delhi', 'Rajasthan', 'Madhya Pradesh'];

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.department && p.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.organization && p.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesState =
        selectedState === 'All' ||
        !p.state ||
        p.state === 'All India' ||
        p.state.toLowerCase().includes(selectedState.toLowerCase());

      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Active' && p.status === 'published') ||
        (selectedStatus === 'Released' && (p.admitCardDate || p.resultDate || p.status === 'published'));

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [posts, searchQuery, selectedState, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 280, behavior: 'smooth' });
    }
  };

  const CategoryIcon = meta.icon || Briefcase;

  return (
    <div id="category-page-container" className="pb-16">
      <SEOHead 
        title={`${meta.title} | Shahnawaz Computer Center`}
        description={meta.desc}
        keywords={`${meta.title}, Sarkari Naukri, Sarkari Result, Latest Jobs`}
        canonicalUrl={window.location.origin + `/category/${categorySlug}`}
      />
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: 'Categories', path: '/' }, { label: meta.title }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Category Header Banner */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#133A6B] to-[#0B2545] text-white rounded-2xl p-5 sm:p-7 shadow-md border-b-4 border-red-600 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-amber-300 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800">
                <CategoryIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Government Database</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight mt-2.5">
                {meta.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed max-w-2xl">
                {meta.desc}
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-white dark:bg-slate-800/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-right shrink-0 hidden md:block">
              <div className="text-2xl font-black text-amber-300">
                {isLoading ? '...' : filteredPosts.length}
              </div>
              <div className="text-[11px] text-slate-200 font-semibold uppercase tracking-wider">
                Total Records Found
              </div>
            </div>
          </div>
        </div>

        {/* Ad Placement */}
        <AdPlacement placement="header" onActionClick={() => onNavigate('/services')} />

        {/* SPECIAL SARKARI YOJANA & DIRECT ONLINE SERVICES DIRECTORY */}
        {(categorySlug === 'sarkari-yojana' ||
          categorySlug === 'yojana' ||
          categorySlug === 'government-schemes' ||
          meta.type === 'sarkari_yojana') && (
          <SarkariYojanaSection isStandalonePage={true} />
        )}

        {/* Filters & Search Controls */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search bar inside category */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search in ${meta.title} (e.g. SSC, UPSC, Railway, Police)...`}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-2 justify-end">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold hidden sm:block">
                Showing {filteredPosts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                {Math.min(currentPage * itemsPerPage, filteredPosts.length)} of {filteredPosts.length}
              </div>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${
                    viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-xs text-blue-900' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${
                    viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-xs text-blue-900' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                  }`}
                  title="Compact List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* State & Region Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-red-600" /> Filter by State:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1 scrollbar-none">
              {stateList.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setSelectedState(st);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                    selectedState === st
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Main Category Content + Recent Posts Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Category Content Column */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400 text-xs bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="inline-block w-7 h-7 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="font-semibold text-slate-600 dark:text-slate-300">Fetching verified government database records...</p>
              </div>
            ) : hasError ? (
              <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 text-center rounded-2xl border border-red-200 shadow-xs space-y-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">Unable to Load Category Notices</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    A temporary connection issue occurred while fetching posts for this section. Click below to refresh.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchCategoryPosts}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B2545] hover:bg-[#133A6B] text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Connection</span>
                </button>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-10 text-center rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base">No Matching Updates Found</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    {searchQuery || selectedState !== 'All'
                      ? 'No posts matched your current search filters. Try clearing the search query or state selection.'
                      : 'Currently there are no active recruitments published in this category.'}
                  </p>
                </div>

                {(searchQuery || selectedState !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedState('All');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-bold transition-colors"
                  >
                    <span>Reset Filters</span>
                  </button>
                )}

                {/* Other Popular Categories */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 max-w-lg mx-auto">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Browse Other Government Categories
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {[
                      { label: 'Latest Vacancies / Jobs', slug: 'vacancy' },
                      { label: 'Admit Cards & Hall Tickets', slug: 'admit-card' },
                      { label: 'Results & Scorecards', slug: 'results' },
                      { label: 'Answer Keys', slug: 'answer-key' },
                      { label: 'Sarkari Yojana', slug: 'sarkari-yojana' },
                    ].map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => onNavigate(`/category/${cat.slug}`)}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 hover:text-red-700 border border-slate-200 dark:border-slate-700 rounded-md text-[11px] font-semibold transition-colors"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                    {paginatedPosts.map((post) => (
                      <JobCard
                        key={post.id}
                        post={post}
                        onClick={() => onSelectPost(post.slug, post.type)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {paginatedPosts.map((post) => (
                      <JobCard
                        key={post.id}
                        post={post}
                        layout="compact"
                        onClick={() => onSelectPost(post.slug, post.type)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      Showing Page <span className="font-black text-slate-900 dark:text-white">{currentPage}</span> of{' '}
                      <span className="font-black text-slate-900 dark:text-white">{totalPages}</span> ({filteredPosts.length} total records)
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="First Page"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>

                      {/* Numeric page pills */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((pageNum) => {
                            // Show first, last, and window around current page
                            return (
                              pageNum === 1 ||
                              pageNum === totalPages ||
                              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            );
                          })
                          .map((pageNum, idx, arr) => {
                            const prev = arr[idx - 1];
                            const showEllipsis = prev && pageNum - prev > 1;

                            return (
                              <React.Fragment key={pageNum}>
                                {showEllipsis && (
                                  <span className="px-1 text-slate-400 text-xs font-bold">...</span>
                                )}
                                <button
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                                    currentPage === pageNum
                                      ? 'bg-red-600 text-white shadow-xs'
                                      : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              </React.Fragment>
                            );
                          })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Last Page"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar Column: Recent Job Openings & Discovery Widget */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-24">
            <RecentPostsWidget
              variant="sidebar"
              title="🔥 Latest Jobs"
              limit={7}
              filterType="jobs"
              onSelectPost={onSelectPost}
              onNavigate={onNavigate}
            />

            {/* Quick Cyber Cafe Services Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-4 shadow-sm border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-400 text-slate-950 font-black text-[10px]">CSC</span>
                <h4 className="text-xs font-black uppercase tracking-wide text-amber-300">
                  Form Filling Assistance
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Visit Shahnawaz Computer Center or chat with us for error-free online applications, photo compression & admit card printing.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/services')}
                className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <span>View Center Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


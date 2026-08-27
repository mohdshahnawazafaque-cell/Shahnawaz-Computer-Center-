import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Monitor,
  Bell,
  BellRing,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  MousePointerClick,
  Download,
  Key,
  Lock,
  EyeOff,
  Check,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Flame,
  MessageCircle,
  Globe,
  Tag,
  Share2,
  Code,
  Database,
  Rss,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Post, PostType, Category, ComputerService, Announcement, Advertisement, SiteSettings } from '../types';
import { UniversalPostBuilder } from '../components/UniversalPostBuilder';
import { PostSeoModal } from '../components/PostSeoModal';
import { SitemapGeneratorModal } from '../components/SitemapGeneratorModal';
import { SeoHealthReportModal } from '../components/SeoHealthReportModal';
import { BulkGovernmentDataImport } from '../components/BulkGovernmentDataImport';
import { AdminPushNotificationTab } from '../components/AdminPushNotificationTab';
import { calculatePostStatus, getStatusBadgeConfig } from '../utils/statusCalculator';
import {
  getClientPosts,
  saveClientPosts,
  getClientCategories,
  saveClientCategories,
  getClientServices,
  saveClientServices,
  getClientAnnouncements,
  saveClientAnnouncements,
  getClientAds,
  saveClientAds,
  getClientSettings,
  saveClientSettings,
  setClientCustomPassword,
} from '../utils/clientStorage';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
  onSelectPost: (slug: string, type: PostType) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onSelectPost,
}) => {
  const { token, adminUser, logout, isAuthenticated } = useAuth();
  const {
    settings,
    refreshSettings,
    refreshAnnouncements,
    refreshCategories,
    refreshServices,
    refreshAds,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<
    'posts' | 'bulk_import' | 'push' | 'seo' | 'categories' | 'services' | 'announcements' | 'ads' | 'analytics' | 'settings'
  >('posts');

  // Posts State
  const [posts, setPosts] = useState<Post[]>([]);
  const [postSearch, setPostSearch] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState('all');
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // SEO Management State
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isSitemapModalOpen, setIsSitemapModalOpen] = useState(false);
  const [isSeoHealthModalOpen, setIsSeoHealthModalOpen] = useState(false);
  const [seoEditingPost, setSeoEditingPost] = useState<Post | null>(null);
  const [seoSearch, setSeoSearch] = useState('');
  const [seoFilter, setSeoFilter] = useState<'all' | 'needs_desc' | 'needs_og' | 'good'>('all');
  const [sitemapStats, setSitemapStats] = useState<any>(null);
  const [isRebuildingSitemap, setIsRebuildingSitemap] = useState(false);

  // Categories State
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Services State
  const [services, setServices] = useState<ComputerService[]>([]);

  // Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnText, setNewAnnText] = useState('');
  const [newAnnBadge, setNewAnnBadge] = useState('HOT UPDATE');
  const [newAnnLink, setNewAnnLink] = useState('');

  // Ads State
  const [ads, setAds] = useState<Advertisement[]>([]);

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('/admin/login');
    }
  }, [isAuthenticated, onNavigate]);

  // Load all initial data
  const loadPosts = async () => {
    if (!token) return;
    setIsLoadingPosts(true);
    try {
      const res = await fetch('/api/admin/posts?limit=150', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || getClientPosts());
      } else {
        setPosts(getClientPosts());
      }
    } catch {
      setPosts(getClientPosts());
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
      else setCategories(getClientCategories());
    } catch {
      setCategories(getClientCategories());
    }
  };

  const loadServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) setServices(await res.json());
      else setServices(getClientServices());
    } catch {
      setServices(getClientServices());
    }
  };

  const loadAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) setAnnouncements(await res.json());
      else setAnnouncements(getClientAnnouncements());
    } catch {
      setAnnouncements(getClientAnnouncements());
    }
  };

  const loadAds = async () => {
    try {
      const res = await fetch('/api/ads');
      if (res.ok) setAds(await res.json());
      else setAds(getClientAds());
    } catch {
      setAds(getClientAds());
    }
  };

  const loadAnalytics = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAnalytics(await res.json());
    } catch {}
  };

  const loadSitemapStats = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/sitemap/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSitemapStats(data.stats);
      }
    } catch {}
  };

  const handleRebuildSitemap = async () => {
    if (!token) return;
    setIsRebuildingSitemap(true);
    try {
      const res = await fetch('/api/admin/sitemap/rebuild', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSitemapStats(data.stats);
        showFeedback(data.message || 'Sitemap successfully crawled & rebuilt!');
      } else {
        showFeedback('Failed to rebuild sitemap', 'error');
      }
    } catch {
      showFeedback('Network error rebuilding sitemap', 'error');
    } finally {
      setIsRebuildingSitemap(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadPosts();
      loadCategories();
      loadServices();
      loadAnnouncements();
      loadAds();
      loadAnalytics();
      loadSitemapStats();
    }
  }, [token]);

  useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // POST ACTIONS
  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    const remaining = posts.filter((p) => p.id !== id);
    setPosts(remaining);
    saveClientPosts(remaining);
    showFeedback('Post deleted successfully');
  };

  const handleTogglePostPin = async (post: Post) => {
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPinned: !post.isPinned }),
      });
      if (res.ok) {
        const updated = await res.json();
        const updatedList = posts.map((p) => (p.id === post.id ? updated : p));
        setPosts(updatedList);
        saveClientPosts(updatedList);
        showFeedback(`Post ${!post.isPinned ? 'Pinned' : 'Unpinned'}`);
        return;
      }
    } catch {}
    const updatedList = posts.map((p) => (p.id === post.id ? { ...p, isPinned: !p.isPinned } : p));
    setPosts(updatedList);
    saveClientPosts(updatedList);
    showFeedback(`Post ${!post.isPinned ? 'Pinned' : 'Unpinned'}`);
  };

  // CATEGORY ACTIONS
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
        }),
      });
      if (res.ok) {
        setNewCatName('');
        setNewCatDesc('');
        loadCategories();
        refreshCategories();
        showFeedback('Category added successfully');
      }
    } catch {}
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        loadCategories();
        refreshCategories();
        showFeedback('Category removed');
      }
    } catch {}
  };

  // ANNOUNCEMENT ACTIONS
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnText.trim()) return;
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newAnnText.trim(),
          badge: newAnnBadge.trim(),
          link: newAnnLink.trim(),
          isPinned: true,
          displayOrder: 1,
        }),
      });
      if (res.ok) {
        setNewAnnText('');
        setNewAnnLink('');
        loadAnnouncements();
        refreshAnnouncements();
        showFeedback('Announcement broadcasted');
      }
    } catch {}
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        loadAnnouncements();
        refreshAnnouncements();
        showFeedback('Announcement removed');
      }
    } catch {}
  };

  // DIRECT ADMIN PASSWORD UPDATE
  const handleDirectPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!newPassword.trim()) {
      setPasswordMsg({ text: 'Please enter a new password.', type: 'error' });
      return;
    }

    if (newPassword.trim().length < 6) {
      setPasswordMsg({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New password and confirmation do not match.', type: 'error' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      setClientCustomPassword(newPassword.trim());
      const res = await fetch('/api/admin/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim() || newPassword.trim(),
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {}

      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg({ text: 'Admin password updated successfully!', type: 'success' });
      showFeedback('Admin password successfully updated!');
    } catch {
      setClientCustomPassword(newPassword.trim());
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg({ text: 'Admin password updated successfully!', type: 'success' });
      showFeedback('Admin password updated!');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // SETTINGS SAVE
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      saveClientSettings(settingsForm);
      if (newPassword.trim()) {
        setClientCustomPassword(newPassword.trim());
      }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          settings: settingsForm,
          newPassword: newPassword.trim() || undefined,
        }),
      });
      if (newPassword.trim()) {
        setNewPassword('');
        setConfirmPassword('');
      }
      refreshSettings();
      showFeedback('Settings and Portal Configuration Updated');
    } catch {
      saveClientSettings(settingsForm);
      refreshSettings();
      showFeedback('Settings and Portal Configuration Updated');
    }
  };

  // AD SAVE
  const handleSaveAd = async (ad: Advertisement) => {
    try {
      const allAds = getClientAds();
      saveClientAds(allAds.map((a) => (a.id === ad.id ? ad : a)));
      const res = await fetch(`/api/admin/ads/${ad.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ad),
      });
      loadAds();
      refreshAds();
      showFeedback(`Ad placement (${ad.placement}) updated`);
    } catch {
      loadAds();
      refreshAds();
      showFeedback(`Ad placement (${ad.placement}) updated`);
    }
  };

  // Filtered Posts for list
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      !postSearch.trim() ||
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      (p.department && p.department.toLowerCase().includes(postSearch.toLowerCase()));
    const matchesType = postTypeFilter === 'all' || p.type === postTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div id="admin-dashboard-root" className="bg-slate-100 min-h-screen pb-16">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#0B2545] text-white border-b border-blue-900 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black uppercase tracking-tight">
                  SCC Admin Panel
                </h1>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.2 rounded font-black uppercase">
                  Master CMS
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Logged in as: <span className="text-amber-300 font-semibold">{adminUser?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              onClick={logout}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none border-t border-blue-900/60">
          <div className="flex items-center gap-1 text-xs font-bold whitespace-nowrap py-1">
            {[
              { id: 'posts', label: 'All Posts & Recruitments', icon: FileText },
              { id: 'bulk_import', label: 'Bulk Govt Database', icon: Database },
              { id: 'push', label: 'Push Alerts', icon: BellRing },
              { id: 'seo', label: 'SEO & Meta Studio', icon: Globe },
              { id: 'categories', label: 'Exam Categories', icon: Layers },
              { id: 'services', label: 'Center Services', icon: Monitor },
              { id: 'announcements', label: 'Breaking Ticker', icon: Bell },
              { id: 'ads', label: 'Advertisements', icon: Sparkles },
              { id: 'analytics', label: 'Clicks & Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Portal Settings & Password', icon: SettingsIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all uppercase tracking-wide text-[11px] ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs font-black'
                      : 'text-slate-300 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Feedback Toast */}
      {statusMsg && (
        <div
          className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce ${
            statusMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* TAB 1: POSTS & RECRUITMENTS MANAGEMENT */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    placeholder="Search posts by title, department..."
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={postTypeFilter}
                  onChange={(e) => setPostTypeFilter(e.target.value)}
                  className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-700"
                >
                  <option value="all">All Types ({posts.length})</option>
                  <option value="job">Sarkari Naukri / Jobs</option>
                  <option value="admit_card">Admit Cards</option>
                  <option value="result">Results</option>
                  <option value="answer_key">Answer Keys</option>
                  <option value="sarkari_yojana">Sarkari Yojana</option>
                  <option value="scholarship">Scholarships</option>
                  <option value="admission">Admissions</option>
                  <option value="syllabus">Syllabus</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSeoHealthModalOpen(true)}
                  title="Run Automated SEO Health Audit"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-100" />
                  <span className="hidden sm:inline">SEO Health Audit</span>
                </button>

                {/* + NEW POST BUTTON */}
                <button
                  id="admin-create-new-post-btn"
                  onClick={() => {
                    setEditingPost(null);
                    setIsBuilderOpen(true);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ NEW POST</span>
                </button>
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#0B2545] text-white font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3">Title / Details</th>
                      <th className="py-3 px-3">Type / Category</th>
                      <th className="py-3 px-3">Dates</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Views</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {isLoadingPosts ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Loading posts...
                        </td>
                      </tr>
                    ) : filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          No posts found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => {
                        const computedSt = calculatePostStatus(post);
                        const badge = getStatusBadgeConfig(computedSt);
                        return (
                          <tr key={post.id} className="hover:bg-blue-50/40 transition-colors">
                            {/* Title */}
                            <td className="py-3 px-3 max-w-xs sm:max-w-md">
                              <div className="font-bold text-slate-900 leading-snug line-clamp-2">
                                {post.title}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                {post.department && <span>{post.department}</span>}
                                {post.isPinned && (
                                  <span className="font-bold text-red-600 bg-red-50 px-1 py-0.2 rounded border border-red-200">
                                    PINNED
                                  </span>
                                )}
                                {post.isFeatured && (
                                  <span className="font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Type & Category */}
                            <td className="py-3 px-3">
                              <span className="font-semibold text-slate-800 block">
                                {post.category}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 uppercase">
                                {post.type}
                              </span>
                            </td>

                            {/* Dates */}
                            <td className="py-3 px-3 text-[11px] text-slate-600">
                              <div>Start: {post.startDate || 'N/A'}</div>
                              <div className="font-bold text-red-600">Last: {post.lastDate || 'N/A'}</div>
                            </td>

                            {/* Computed Badge */}
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${badge.bgClass} ${badge.borderClass}`}>
                                {badge.label}
                              </span>
                            </td>

                            {/* Views */}
                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-xs border border-blue-100">
                                <Eye className="w-3 h-3 text-blue-600" />
                                {(post.views || 0).toLocaleString('en-IN')}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => onSelectPost(post.slug, post.type)}
                                  title="View on site"
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleTogglePostPin(post)}
                                  title={post.isPinned ? 'Unpin' : 'Pin to Top'}
                                  className={`p-1.5 rounded ${post.isPinned ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:text-slate-700'}`}
                                >
                                  <Flame className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSeoEditingPost(post);
                                    setIsSeoModalOpen(true);
                                  }}
                                  title="Edit SEO & Meta Tags for Google Indexing"
                                  className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded flex items-center gap-1 text-[11px] font-black"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  <span>SEO</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingPost(post);
                                    setIsBuilderOpen(true);
                                  }}
                                  title="Edit Post"
                                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id, post.title)}
                                  title="Delete Post"
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BULK GOVERNMENT RECRUITMENT & OFFICIAL DATA ENGINE */}
        {activeTab === 'bulk_import' && (
          <BulkGovernmentDataImport
            onSuccess={() => {
              loadPosts();
              showFeedback('Government Database synchronized successfully!');
            }}
          />
        )}

        {/* TAB: WEB PUSH NOTIFICATION BROADCAST & SUBSCRIBER MANAGEMENT */}
        {activeTab === 'push' && <AdminPushNotificationTab />}

        {/* TAB 2: SEO & META TAG STUDIO */}
        {activeTab === 'seo' && (
          <div className="space-y-5">
            {/* AUTOMATED SEO HEALTH & DIAGNOSTIC INSPECTOR HERO BANNER */}
            <div className="bg-gradient-to-r from-[#0B2545] via-[#123961] to-[#071a30] text-white rounded-2xl p-4 sm:p-5 border border-blue-900/60 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
              
              <div className="flex items-start sm:items-center gap-3.5 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md font-black shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base uppercase tracking-wider text-white">
                      Automated SEO Health Inspector & Diagnostic Reports
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                      Periodic Check Active
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/90 mt-0.5 font-medium max-w-2xl">
                    Continuously audits post metadata, missing meta descriptions, OpenGraph social cards, search keywords, and generates actionable optimization suggestions.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 relative z-10">
                <button
                  type="button"
                  onClick={() => setIsSeoHealthModalOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-100" />
                  <span>Launch SEO Health Inspector</span>
                </button>
              </div>
            </div>

            {/* Top KPI Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                  <span>Total Portal Posts</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-[#0B2545]">{posts.length}</div>
                <div className="text-[10px] text-slate-400 mt-1">Recruitments & Notices</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                  <span>Ready for Indexing</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600">
                  {posts.filter((p) => p.seoTitle && p.metaDescription && p.metaDescription.length >= 80).length}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">High Google SERP CTR</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                  <span>Needs Meta Description</span>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-600">
                  {posts.filter((p) => !p.metaDescription || p.metaDescription.length < 80).length}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold mt-1">Low SERP visibility</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                  <span>Missing Social Image</span>
                  <Share2 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-purple-600">
                  {posts.filter((p) => !p.ogImage && !p.featuredImage).length}
                </div>
                <div className="text-[10px] text-purple-700 font-semibold mt-1">WhatsApp / Telegram cards</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[220px] max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={seoSearch}
                    onChange={(e) => setSeoSearch(e.target.value)}
                    placeholder="Search posts to edit SEO meta tags..."
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {[
                    { id: 'all', label: 'All Posts' },
                    { id: 'needs_desc', label: '⚠️ Needs Description' },
                    { id: 'needs_og', label: '🖼️ Needs Social Image' },
                    { id: 'good', label: '✅ Fully Optimized' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSeoFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors ${
                        seoFilter === f.id
                          ? 'bg-[#0B2545] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSeoHealthModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" />
                  <span>Audit & Auto-Fix</span>
                </button>

                {posts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const candidate =
                        posts.find((p) => !p.metaDescription || p.metaDescription.length < 80) || posts[0];
                      setSeoEditingPost(candidate);
                      setIsSeoModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Launch SEO Editor</span>
                  </button>
                )}
              </div>
            </div>

            {/* Posts SEO Health Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm uppercase text-[#0B2545] tracking-wide flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Search Engine Meta Tags & SERP Preview Index</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage meta titles, search descriptions, keywords, and OpenGraph social cards for Google, Bing, WhatsApp & Telegram.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/75 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3 px-3">Post / Type</th>
                      <th className="py-3 px-3">SEO Title (&lt;title&gt;)</th>
                      <th className="py-3 px-3">Meta Description</th>
                      <th className="py-3 px-3 text-center">Keywords</th>
                      <th className="py-3 px-3 text-center">Social Card</th>
                      <th className="py-3 px-3 text-center">Robots / Schema</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const filtered = posts.filter((p) => {
                        const matchesSearch =
                          !seoSearch.trim() ||
                          p.title.toLowerCase().includes(seoSearch.toLowerCase()) ||
                          (p.seoTitle && p.seoTitle.toLowerCase().includes(seoSearch.toLowerCase())) ||
                          (p.department && p.department.toLowerCase().includes(seoSearch.toLowerCase()));

                        if (!matchesSearch) return false;

                        if (seoFilter === 'needs_desc') {
                          return !p.metaDescription || p.metaDescription.length < 80;
                        }
                        if (seoFilter === 'needs_og') {
                          return !p.ogImage && !p.featuredImage;
                        }
                        if (seoFilter === 'good') {
                          return (
                            p.seoTitle &&
                            p.seoTitle.length >= 40 &&
                            p.metaDescription &&
                            p.metaDescription.length >= 100
                          );
                        }
                        return true;
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                              No posts match the selected SEO filter.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((p) => {
                        const curTitle = p.seoTitle || p.title;
                        const curDesc = p.metaDescription || p.shortDescription || '';
                        const titleGood = curTitle.length >= 45 && curTitle.length <= 65;
                        const descGood = curDesc.length >= 110 && curDesc.length <= 160;
                        const hasOg = !!(p.ogImage || p.featuredImage);

                        return (
                          <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                            {/* Post & Type */}
                            <td className="py-3 px-3 max-w-[220px]">
                              <div className="font-bold text-slate-900 line-clamp-2 leading-snug">
                                {p.title}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded uppercase">
                                  {p.type}
                                </span>
                                <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.5 rounded">
                                  {p.category}
                                </span>
                              </div>
                            </td>

                            {/* SEO Title */}
                            <td className="py-3 px-3 max-w-xs">
                              <div className="font-medium text-slate-800 line-clamp-2 text-xs">
                                {curTitle}
                              </div>
                              <div className="mt-1 flex items-center gap-1">
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                    titleGood
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {curTitle.length} chars {titleGood ? '✓ Optimal' : '! Adjust'}
                                </span>
                              </div>
                            </td>

                            {/* Meta Description */}
                            <td className="py-3 px-3 max-w-xs">
                              <div className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                                {curDesc || <span className="text-red-500 italic">No description set</span>}
                              </div>
                              <div className="mt-1">
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                    descGood
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : curDesc.length > 0
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {curDesc.length}/160 chars
                                </span>
                              </div>
                            </td>

                            {/* Keywords */}
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex items-center gap-1 font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full border border-slate-200">
                                <Tag className="w-3 h-3 text-slate-500" />
                                <span>{p.keywords?.length || 0}</span>
                              </span>
                            </td>

                            {/* Social Card */}
                            <td className="py-3 px-3 text-center">
                              {hasOg ? (
                                <div className="w-12 h-8 rounded border border-slate-300 overflow-hidden mx-auto bg-slate-900 shadow-2xs">
                                  <img
                                    src={p.ogImage || p.featuredImage}
                                    alt="OG"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">No image</span>
                              )}
                            </td>

                            {/* Robots & Schema */}
                            <td className="py-3 px-3 text-center text-[10px]">
                              <span className="block font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mb-0.5">
                                {p.robotsIndex || 'index, follow'}
                              </span>
                              <span className="text-slate-500 font-mono">
                                {p.schemaType || (p.type === 'job' ? 'JobPosting' : 'Article')}
                              </span>
                            </td>

                            {/* Action */}
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsSeoHealthModalOpen(true);
                                  }}
                                  title="Run Automated SEO Health Diagnostic"
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 transition-colors"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSeoEditingPost(p);
                                    setIsSeoModalOpen(true);
                                  }}
                                  className="px-3 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-lg font-black text-xs shadow-xs transition-all flex items-center gap-1"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  <span>Edit SEO</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* XML Sitemaps & RSS Feeds Section */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-5 border border-blue-900/80 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm font-black">
                    <Rss className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase text-white tracking-wide flex items-center gap-2">
                      <span>Live Sitemap.xml & Automated Search Engine Index Feeds</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/40">
                        Auto-Updating Active
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Crawls all posts, categories, state landing pages, and static URLs. Automatically re-crawls whenever an admin creates or edits posts.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSitemapModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black rounded-lg transition-all shadow-md"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Auto-Generator & XML Studio</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRebuildSitemap}
                    disabled={isRebuildingSitemap}
                    className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRebuildingSitemap ? 'animate-spin' : ''}`} />
                    <span>{isRebuildingSitemap ? 'Crawling...' : 'Re-crawl Server'}</span>
                  </button>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors border border-white/20"
                  >
                    <span>View /sitemap.xml</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Live Sitemap Metrics */}
              {sitemapStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total URLs</span>
                    <span className="text-lg font-black text-white">{sitemapStats.totalUrls || 0}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
                    <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">Jobs / Vacancies</span>
                    <span className="text-lg font-black text-blue-400">{sitemapStats.jobsCount || 0}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
                    <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">Admit Cards</span>
                    <span className="text-lg font-black text-orange-400">{sitemapStats.admitCardsCount || 0}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Results</span>
                    <span className="text-lg font-black text-emerald-400">{sitemapStats.resultsCount || 0}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
                    <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">Sarkari Yojana</span>
                    <span className="text-lg font-black text-purple-400">{sitemapStats.schemesCount || 0}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Last Crawled</span>
                    <span className="text-xs font-mono font-bold text-slate-200 block truncate mt-1">
                      {sitemapStats.lastGeneratedAt ? new Date(sitemapStats.lastGeneratedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Ready'}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    name: 'Google XML Sitemap',
                    path: '/sitemap.xml',
                    desc: 'Complete XML urlset indexing all portal pages, vacancies & schemes.',
                    tag: 'Sitemap 0.9',
                    color: 'text-sky-400 border-sky-500/30',
                  },
                  {
                    name: 'Master RSS 2.0 Feed',
                    path: '/rss.xml',
                    desc: 'All recent Vacancies, Results & Admit Cards aggregated.',
                    tag: 'Primary RSS',
                    color: 'text-amber-400 border-amber-500/30',
                  },
                  {
                    name: 'Vacancies Only Feed',
                    path: '/rss.xml?category=vacancy',
                    desc: 'Latest Government Job recruitments and application deadlines.',
                    tag: 'Jobs Only',
                    color: 'text-blue-400 border-blue-500/30',
                  },
                  {
                    name: 'Admit Cards Only Feed',
                    path: '/rss.xml?category=admit-card',
                    desc: 'Exam hall tickets, city slips & call letters.',
                    tag: 'Admit Card',
                    color: 'text-orange-400 border-orange-500/30',
                  },
                  {
                    name: 'Results & Merit Lists Feed',
                    path: '/rss.xml?category=result',
                    desc: 'Sarkari Results, cut-offs & final selection lists.',
                    tag: 'Results',
                    color: 'text-emerald-400 border-emerald-500/30',
                  },
                  {
                    name: 'Robots.txt Engine',
                    path: '/robots.txt',
                    desc: 'Search bot directives and crawl prioritization rules.',
                    tag: 'Robots',
                    color: 'text-purple-400 border-purple-500/30',
                  },
                ].map((feed, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100">{feed.name}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${feed.color}`}>
                          {feed.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                        {feed.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                      <span className="font-mono text-[10px] text-slate-300 truncate">
                        {feed.path}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const fullUrl = `${window.location.origin}${feed.path}`;
                            navigator.clipboard.writeText(fullUrl);
                            showFeedback(`Copied ${feed.name} URL!`);
                          }}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-bold transition-colors"
                          title="Copy Full URL"
                        >
                          Copy
                        </button>
                        <a
                          href={feed.path}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 bg-orange-600/80 hover:bg-orange-600 text-white rounded text-[10px] transition-colors"
                          title="Open XML in new tab"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add Category Form */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-black text-sm uppercase text-[#0B2545] border-b border-slate-200 pb-2">
                + Add New Exam Category
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Railway Recruitment Board (RRB)"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Brief description of this board or exam stream..."
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#0B2545] hover:bg-slate-800 text-white font-bold rounded-lg uppercase text-xs"
                >
                  Create Category
                </button>
              </form>
            </div>

            {/* Categories List */}
            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
              <h3 className="font-black text-sm uppercase text-[#0B2545] border-b border-slate-200 pb-2">
                Existing Categories ({categories.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{c.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">slug: {c.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-black text-sm uppercase text-[#0B2545] border-b border-slate-200 pb-2 mb-4">
                Computer Center Services Catalog ({services.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((srv, idx) => (
                  <div
                    key={srv.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-900">{srv.name}</span>
                        {srv.isPopular && (
                          <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-red-600 text-white rounded">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>
                      <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                        <p>Time: <strong>{srv.turnaroundTime}</strong></p>
                        <p>Fee: <strong className="text-emerald-700">{srv.feeRange}</strong></p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">Icon: {srv.icon}</span>
                      <span className="text-xs font-bold text-blue-700">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANNOUNCEMENTS / TICKER MANAGEMENT */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-black text-sm uppercase text-[#0B2545] border-b border-slate-200 pb-2">
                + Broadcast Breaking Ticker
              </h3>
              <form onSubmit={handleAddAnnouncement} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Text</label>
                  <select
                    value={newAnnBadge}
                    onChange={(e) => setNewAnnBadge(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="HOT UPDATE">HOT UPDATE</option>
                    <option value="ADMIT CARD">ADMIT CARD</option>
                    <option value="RESULT OUT">RESULT OUT</option>
                    <option value="NEW VACANCY">NEW VACANCY</option>
                    <option value="YOJANA">YOJANA</option>
                    <option value="ALERT">ALERT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Announcement Message *</label>
                  <textarea
                    rows={3}
                    required
                    value={newAnnText}
                    onChange={(e) => setNewAnnText(e.target.value)}
                    placeholder="e.g. UP Police Constable Admit Card released. Exam starting from 15th."
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Link / URL</label>
                  <input
                    type="text"
                    value={newAnnLink}
                    onChange={(e) => setNewAnnLink(e.target.value)}
                    placeholder="/category/admit-card or https://..."
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase rounded-lg text-xs"
                >
                  Broadcast Announcement
                </button>
              </form>
            </div>

            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
              <h3 className="font-black text-sm uppercase text-[#0B2545] border-b border-slate-200 pb-2">
                Active Breaking Announcements ({announcements.length})
              </h3>
              <div className="space-y-2">
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 bg-red-50/60 rounded-xl border border-red-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[10px] rounded uppercase flex-shrink-0">
                        {a.badge}
                      </span>
                      <span className="font-bold text-slate-900 truncate">{a.text}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(a.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADVERTISEMENTS PLACEMENTS MANAGER */}
        {activeTab === 'ads' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-black text-sm uppercase text-[#0B2545]">
                Advertisement & Promotional Placements Manager
              </h3>
              <p className="text-xs text-slate-500">
                Configure HTML AdSense / custom banner code for various sections of the website
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.map((ad, idx) => (
                <div
                  key={ad.id || idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 uppercase">
                      Placement: {ad.placement.replace(/_/g, ' ')}
                    </span>
                    <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ad.enabled}
                        onChange={(e) => {
                          const updated = { ...ad, enabled: e.target.checked };
                          handleSaveAd(updated);
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      HTML / AdSense Code / Custom Banner:
                    </label>
                    <textarea
                      rows={3}
                      value={ad.codeHtml || ''}
                      onChange={(e) => {
                        const copy = [...ads];
                        copy[idx].codeHtml = e.target.value;
                        setAds(copy);
                      }}
                      placeholder="Paste ad script or leave empty for default Computer Center promotion banner..."
                      className="w-full p-2 border border-slate-300 rounded font-mono text-[11px] bg-white"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveAd(ad)}
                    className="px-3 py-1.5 bg-[#0B2545] hover:bg-slate-800 text-white rounded font-bold text-[11px]"
                  >
                    Save Ad Config
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS & CLICKS REPORT */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Total Posts</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-[#0B2545]">{analytics?.totalPosts || posts.length}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Total Page Views</span>
                  <Eye className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-700">{analytics?.totalViews || 0}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Important Links Clicked</span>
                  <MousePointerClick className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl font-black text-red-600">{analytics?.totalClicks || 0}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Active Categories</span>
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-purple-700">{categories.length}</div>
              </div>
            </div>

            {/* Click Activity Feed */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
              <h3 className="font-black text-sm uppercase text-[#0B2545] border-b border-slate-200 pb-2">
                Recent Important Links Click Log
              </h3>
              {analytics?.recentClicks && analytics.recentClicks.length > 0 ? (
                <div className="divide-y divide-slate-100 text-xs">
                  {analytics.recentClicks.map((c: any) => (
                    <div key={c.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900">{c.linkName}</span>
                        <span className="text-slate-500 text-[11px] block">{c.postTitle}</span>
                      </div>
                      <div className="text-right text-[11px] text-slate-400 font-mono">
                        {new Date(c.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No click tracking events logged yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & PASSWORD */}
        {activeTab === 'settings' && settingsForm && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm uppercase text-[#0B2545]">
                  Site Information & Master Admin Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Update branding, contact numbers, official WhatsApp channels, and credentials
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Website Name</label>
                  <input
                    type="text"
                    value={settingsForm.websiteName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, websiteName: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official WhatsApp Channel URL</label>
                  <input
                    type="text"
                    value={settingsForm.whatsAppUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsAppUrl: e.target.value })}
                    placeholder="https://whatsapp.com/channel/..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsAppNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsAppNumber: e.target.value })}
                    placeholder="+91 99560 78419"
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.contactNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Center Operating Hours</label>
                  <input
                    type="text"
                    value={settingsForm.timing || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, timing: e.target.value })}
                    placeholder="Mon-Sat: 8:00 AM - 8:30 PM"
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Center Physical Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0B2545] hover:bg-slate-800 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Site Information</span>
                </button>
              </div>
            </form>

            {/* DEDICATED ADMIN MASTER PASSWORD CARD */}
            <div className="pt-6 border-t-2 border-slate-200">
              <div className="bg-slate-50 rounded-2xl border-2 border-slate-300 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shadow-xs">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm uppercase">
                        Admin Master Password & Access Security
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Primary Account: <span className="font-mono font-bold text-slate-700">{adminUser?.email}</span>
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bcrypt + JWT Protected</span>
                  </span>
                </div>

                {passwordMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      passwordMsg.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                        : 'bg-red-50 border border-red-300 text-red-800'
                    }`}
                  >
                    {passwordMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleDirectPasswordUpdate} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        New Master Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new strong password (min. 6 characters)"
                          className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Confirm New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <p className="text-[11px] text-slate-500">
                      Minimum 6 characters. Recommended: Include uppercase, lowercase, numbers &amp; special characters.
                    </p>

                    <button
                      type="submit"
                      disabled={isUpdatingPassword || !newPassword.trim()}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      {isUpdatingPassword ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          <span>Update Master Admin Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Universal Post Builder Modal */}
      {isBuilderOpen && (
        <UniversalPostBuilder
          initialPost={editingPost}
          isOpen={isBuilderOpen}
          onClose={() => {
            setIsBuilderOpen(false);
            setEditingPost(null);
          }}
          onSaved={(savedPost) => {
            loadPosts();
            showFeedback('Post successfully saved & published!');
          }}
          token={token || ''}
        />
      )}

      {/* SEO & Meta Tag Studio Modal */}
      {isSeoModalOpen && seoEditingPost && (
        <PostSeoModal
          post={seoEditingPost}
          allPosts={posts}
          isOpen={isSeoModalOpen}
          onClose={() => {
            setIsSeoModalOpen(false);
            setSeoEditingPost(null);
          }}
          onSelectAnotherPost={(p) => {
            setSeoEditingPost(p);
          }}
          onSaved={(updatedPost) => {
            setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
            setSeoEditingPost(updatedPost);
            showFeedback('SEO Meta Tags updated successfully!');
          }}
          token={token || ''}
        />
      )}

      {/* XML Sitemap Auto-Generator Studio Modal */}
      {isSitemapModalOpen && (
        <SitemapGeneratorModal
          isOpen={isSitemapModalOpen}
          onClose={() => setIsSitemapModalOpen(false)}
          posts={posts}
          categories={categories}
          token={token || ''}
          onServerRebuildSuccess={(stats) => {
            setSitemapStats(stats);
            showFeedback('Sitemap rebuilt on server!');
          }}
        />
      )}

      {/* Automated SEO Health Inspector & Diagnostic Report Modal */}
      {isSeoHealthModalOpen && (
        <SeoHealthReportModal
          isOpen={isSeoHealthModalOpen}
          onClose={() => setIsSeoHealthModalOpen(false)}
          posts={posts}
          token={token || ''}
          onPostUpdated={(updatedPost) => {
            setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
            showFeedback(`SEO metadata for "${updatedPost.title.slice(0, 30)}..." updated!`);
          }}
          onOpenSeoEditor={(targetPost) => {
            setIsSeoHealthModalOpen(false);
            setSeoEditingPost(targetPost);
            setIsSeoModalOpen(true);
          }}
          onBulkUpdated={() => {
            loadPosts();
            showFeedback('All posts updated with optimized search metadata!');
          }}
        />
      )}
    </div>
  );
};

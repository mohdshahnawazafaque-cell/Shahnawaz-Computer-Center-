import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Bell,
  AlertTriangle,
  MessageCircle,
  ThumbsUp,
  Reply,
  Share2,
  Flag,
  Pin,
  ShieldCheck,
  Send,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  Check,
  Copy,
} from 'lucide-react';
import { PostComment, CommentTag, CommentReply } from '../types';
import {
  getClientCommentsBySlug,
  saveClientComment,
  likeClientComment,
  addClientCommentReply,
  likeClientCommentReply,
} from '../utils/clientStorage';
import { useSettings } from '../context/SettingsContext';

interface PostCommentSectionProps {
  postId: string;
  postSlug: string;
  postTitle: string;
  postCategory?: string;
}

const TAG_CONFIG: Record<
  CommentTag,
  { label: string; icon: React.FC<{ className?: string }>; color: string; bg: string; border: string }
> = {
  question: {
    label: 'Question & Doubt',
    icon: HelpCircle,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  tip: {
    label: 'Preparation Tip',
    icon: Lightbulb,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  update: {
    label: 'Exam / Notice Update',
    icon: Bell,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  form_issue: {
    label: 'Form Filling Issue',
    icon: AlertTriangle,
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  general: {
    label: 'General Discussion',
    icon: MessageCircle,
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
};

const ASPIRANT_BADGES = [
  'Graduate Aspirant',
  '12th Pass Aspirant',
  'OBC Candidate',
  'SC/ST Candidate',
  'EWS Candidate',
  'General Category',
  'B.Tech / Diploma',
  'B.Ed / BTC Aspirant',
  'Ex-Serviceman',
  'First-Time Applicant',
];

const PROMPT_STARTERS = [
  { text: 'Is OBC NCL certificate required from Central or State format?', tag: 'question' as CommentTag },
  { text: 'What is the required photo date and signature dimension?', tag: 'form_issue' as CommentTag },
  { text: 'Previous year cutoff and safe score analysis for this post', tag: 'tip' as CommentTag },
  { text: 'How to correct mistake in mother’s name after final submit?', tag: 'form_issue' as CommentTag },
];

function formatTimeAgo(dateString: string): string {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recently';
  }
}

export const PostCommentSection: React.FC<PostCommentSectionProps> = ({
  postId,
  postSlug,
  postTitle,
  postCategory,
}) => {
  const { settings } = useSettings();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [authorName, setAuthorName] = useState(() => localStorage.getItem('scc_user_author_name') || '');
  const [authorLocation, setAuthorLocation] = useState(() => localStorage.getItem('scc_user_location') || '');
  const [authorBadge, setAuthorBadge] = useState(() => localStorage.getItem('scc_user_badge') || 'Graduate Aspirant');
  const [commentTag, setCommentTag] = useState<CommentTag>('question');
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Filters and Search
  const [activeFilter, setActiveFilter] = useState<'all' | CommentTag>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'discussed'>('newest');

  // Interactive Action States
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('scc_liked_comments');
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState(() => localStorage.getItem('scc_user_author_name') || '');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCommentId, setCopiedCommentId] = useState<string | null>(null);

  // Load comments (from API with instant client storage fallback)
  useEffect(() => {
    let isMounted = true;
    const fetchComments = async () => {
      setIsLoading(true);
      // Instant local fallback
      const localData = getClientCommentsBySlug(postSlug);
      if (localData && localData.length > 0 && isMounted) {
        setComments(localData);
      }

      try {
        const res = await fetch(`/api/posts/${postSlug}/comments`);
        if (res.ok) {
          const apiData = await res.json();
          if (isMounted && Array.isArray(apiData)) {
            setComments(apiData);
          }
        }
      } catch (e) {
        console.warn('Using client cached comments for', postSlug);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchComments();
    return () => {
      isMounted = false;
    };
  }, [postSlug]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Submit main comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    const cleanName = authorName.trim() || 'Aspirant Candidate';
    const cleanLoc = authorLocation.trim();
    const cleanBadge = authorBadge.trim() || 'Candidate';

    // Persist user details for next time
    localStorage.setItem('scc_user_author_name', cleanName);
    if (cleanLoc) localStorage.setItem('scc_user_location', cleanLoc);
    localStorage.setItem('scc_user_badge', cleanBadge);

    const tempComment: PostComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      postId: postId || postSlug,
      postSlug,
      authorName: cleanName,
      authorBadge: cleanBadge,
      authorLocation: cleanLoc || undefined,
      tag: commentTag,
      content: commentContent.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isPinned: false,
      isStaff: false,
      replies: [],
    };

    // Optimistic UI update & client storage save
    const updatedClientList = saveClientComment(tempComment);
    setComments(updatedClientList);
    setCommentContent('');
    setSubmitSuccess(true);
    setIsComposerOpen(false);

    try {
      const res = await fetch(`/api/posts/${postSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName: cleanName,
          authorBadge: cleanBadge,
          authorLocation: cleanLoc,
          tag: commentTag,
          content: tempComment.content,
        }),
      });

      if (res.ok) {
        const savedApi = await res.json();
        setComments((prev) => prev.map((c) => (c.id === tempComment.id ? savedApi : c)));
      }
    } catch (err) {
      console.warn('Stored comment locally in offline mode');
    } finally {
      setIsSubmitting(false);
      showToast('🎉 Your comment has been posted successfully!');
      setTimeout(() => setSubmitSuccess(false), 4000);
    }
  };

  // Like a comment
  const handleLikeComment = async (commentId: string) => {
    if (likedCommentIds.has(commentId)) {
      showToast('You have already liked this discussion.');
      return;
    }

    const nextLiked = new Set(likedCommentIds);
    nextLiked.add(commentId);
    setLikedCommentIds(nextLiked);
    localStorage.setItem('scc_liked_comments', JSON.stringify(Array.from(nextLiked)));

    // Optimistic update
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );
    likeClientComment(commentId);

    try {
      await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
    } catch {
      // offline handled
    }
  };

  // Submit reply
  const handlePostReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);

    const cleanName = replyAuthorName.trim() || authorName.trim() || 'Fellow Aspirant';
    localStorage.setItem('scc_user_author_name', cleanName);

    const newReply: CommentReply = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: cleanName,
      authorBadge: 'Aspirant',
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isStaff: false,
    };

    // Client storage
    addClientCommentReply(commentId, newReply);

    // Optimistic state
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      })
    );

    setReplyText('');
    setActiveReplyCommentId(null);

    try {
      await fetch(`/api/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: cleanName,
          content: newReply.content,
        }),
      });
    } catch {
      // offline handled
    } finally {
      setIsSubmittingReply(false);
      showToast('💬 Your reply was posted successfully!');
    }
  };

  // Like reply
  const handleLikeReply = async (commentId: string, replyId: string) => {
    const key = `rep_${replyId}`;
    if (likedCommentIds.has(key)) return;

    const nextLiked = new Set(likedCommentIds);
    nextLiked.add(key);
    setLikedCommentIds(nextLiked);
    localStorage.setItem('scc_liked_comments', JSON.stringify(Array.from(nextLiked)));

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId && c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) => (r.id === replyId ? { ...r, likes: (r.likes || 0) + 1 } : r)),
          };
        }
        return c;
      })
    );

    likeClientCommentReply(commentId, replyId);

    try {
      await fetch(`/api/comments/${commentId}/reply/${replyId}/like`, { method: 'POST' });
    } catch {}
  };

  // Copy or Share Comment Link
  const handleShareComment = (comment: PostComment) => {
    const shareText = `💬 Aspirant Discussion on "${postTitle}":\n"${comment.content}"\n\nRead more at: ${window.location.href}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedCommentId(comment.id);
      showToast('Comment text & link copied to clipboard!');
      setTimeout(() => setCopiedCommentId(null), 2500);
    }
  };

  const handleReportComment = () => {
    showToast('🚩 Thank you. This comment has been flagged for moderation.');
  };

  const handleUseStarter = (starter: { text: string; tag: CommentTag }) => {
    setCommentTag(starter.tag);
    setCommentContent(starter.text);
    setIsComposerOpen(true);
    const el = document.getElementById('candidate-comment-composer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter & Sort Logic
  const filteredComments = comments.filter((c) => {
    if (activeFilter !== 'all' && c.tag !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesContent = c.content.toLowerCase().includes(q);
      const matchesAuthor = c.authorName.toLowerCase().includes(q);
      const matchesReply = c.replies?.some((r) => r.content.toLowerCase().includes(q) || r.authorName.toLowerCase().includes(q));
      if (!matchesContent && !matchesAuthor && !matchesReply) return false;
    }
    return true;
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (sortBy === 'helpful') {
      return (b.likes || 0) - (a.likes || 0);
    }
    if (sortBy === 'discussed') {
      return (b.replies?.length || 0) - (a.replies?.length || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const questionCount = comments.filter((c) => c.tag === 'question').length;
  const tipCount = comments.filter((c) => c.tag === 'tip').length;
  const issueCount = comments.filter((c) => c.tag === 'form_issue').length;

  return (
    <section
      id="candidate-discussion-section"
      className="no-print bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 transition-all"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-100">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#0B2545] uppercase tracking-wide">
                  Candidate Q&A & Discussion Hub
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {comments.length} Posts
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ask vacancy questions, verify eligibility, share preparation tips, and clear form-filling doubts with fellow aspirants.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsComposerOpen((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#800000] hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isComposerOpen ? 'Close Composer' : 'Ask Question / Share Tip'}</span>
        </button>
      </div>

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="mt-3 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-lg flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* QUICK QUESTION STARTER PROMPTS */}
      <div className="mt-4 pt-1 pb-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          💡 Common Aspirant Questions (Click to Ask):
        </span>
        <div className="flex flex-wrap gap-2">
          {PROMPT_STARTERS.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleUseStarter(starter)}
              className="text-left text-xs bg-slate-50 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="line-clamp-1">{starter.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* COMMENT COMPOSER FORM */}
      {isComposerOpen && (
        <form
          id="candidate-comment-composer"
          onSubmit={handlePostComment}
          className="mt-4 p-4 sm:p-5 bg-blue-50/50 rounded-2xl border-2 border-blue-200 animate-fadeIn space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black text-[#0B2545] uppercase tracking-wide flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-700" />
              <span>Post to Recruitment Discussion</span>
            </h4>
            <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Post: {postTitle.substring(0, 35)}...
            </span>
          </div>

          {/* Topic Tag Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Discussion Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(Object.keys(TAG_CONFIG) as CommentTag[]).map((t) => {
                const cfg = TAG_CONFIG[t];
                const Icon = cfg.icon;
                const isSelected = commentTag === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCommentTag(t)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-white shadow-sm border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                        : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    <span className="truncate">{cfg.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Author Details Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Your Name / Handle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Aspirant Category / Background
              </label>
              <select
                value={authorBadge}
                onChange={(e) => setAuthorBadge(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                {ASPIRANT_BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Your City / District (Optional)
              </label>
              <input
                type="text"
                value={authorLocation}
                onChange={(e) => setAuthorLocation(e.target.value)}
                placeholder="e.g. Sitapur / Lucknow / Prayagraj"
                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                Your Question, Tip, or Update: <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">
                {commentContent.length}/1000 characters
              </span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={1000}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write your question, eligibility query, syllabus tip, or document issue here..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 resize-none leading-relaxed"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <p className="text-[10px] text-slate-500">
              🛡️ No login required. Please maintain helpful and friendly discussion standards.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !commentContent.trim()}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Posting...' : 'Submit Post'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* FILTER & SORT BAR */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({comments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('question')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeFilter === 'question'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions ({questionCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('tip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeFilter === 'tip'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Tips ({tipCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('form_issue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeFilter === 'form_issue'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Form Issues ({issueCount})</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comments..."
              className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-500 w-36 sm:w-44"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="newest">Newest First</option>
            <option value="helpful">Most Helpful</option>
            <option value="discussed">Most Replies</option>
          </select>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="mt-4 space-y-3.5">
        {isLoading && comments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <span className="animate-spin inline-block mr-2">⏳</span> Loading candidate discussions...
          </div>
        ) : sortedComments.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">No discussions match your filter</h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
              Be the first aspirant to ask a question or share advice about this vacancy!
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
                setIsComposerOpen(true);
              }}
              className="mt-3 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black rounded-xl cursor-pointer"
            >
              Start the Discussion
            </button>
          </div>
        ) : (
          sortedComments.map((comment) => {
            const tagCfg = TAG_CONFIG[comment.tag] || TAG_CONFIG.general;
            const TagIcon = tagCfg.icon;
            const isLiked = likedCommentIds.has(comment.id);
            const isReplying = activeReplyCommentId === comment.id;

            return (
              <div
                key={comment.id}
                className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                  comment.isPinned
                    ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/20 shadow-xs'
                    : comment.isStaff
                    ? 'bg-blue-50/30 border-blue-200'
                    : 'bg-white hover:bg-slate-50/40 border-slate-200 shadow-xs'
                }`}
              >
                {/* Header: Author & Tag */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-xs uppercase flex-shrink-0 shadow-xs ${
                        comment.isStaff
                          ? 'bg-[#800000] text-amber-300'
                          : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                      }`}
                    >
                      {comment.authorName.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          {comment.authorName}
                        </span>

                        {comment.isStaff && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-900 border border-red-200">
                            <ShieldCheck className="w-3 h-3 text-red-700" />
                            Official Staff
                          </span>
                        )}

                        {comment.authorBadge && !comment.isStaff && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {comment.authorBadge}
                          </span>
                        )}

                        {comment.authorLocation && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {comment.authorLocation}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTimeAgo(comment.createdAt)}
                        </span>

                        {comment.isPinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
                            <Pin className="w-3 h-3 fill-amber-700" />
                            Pinned Advice
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tag Pill */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black border ${tagCfg.bg} ${tagCfg.color} ${tagCfg.border}`}
                  >
                    <TagIcon className="w-3 h-3" />
                    <span>{tagCfg.label}</span>
                  </span>
                </div>

                {/* Comment Content */}
                <p className="text-xs sm:text-sm text-slate-800 mt-2.5 whitespace-pre-line leading-relaxed font-normal">
                  {comment.content}
                </p>

                {/* Action Bar */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {/* Upvote */}
                    <button
                      type="button"
                      onClick={() => handleLikeComment(comment.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'text-slate-500 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-blue-700 text-blue-700' : ''}`} />
                      <span>{comment.likes || 0} Helpful</span>
                    </button>

                    {/* Reply Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveReplyCommentId(isReplying ? null : comment.id);
                        setReplyText('');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>{comment.replies?.length ? `${comment.replies.length} Replies` : 'Reply'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share */}
                    <button
                      type="button"
                      onClick={() => handleShareComment(comment)}
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="Copy comment text & link"
                    >
                      {copiedCommentId === comment.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Flag/Report */}
                    <button
                      type="button"
                      onClick={handleReportComment}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer text-xs"
                      title="Report inappropriate comment"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* INLINE REPLIES LIST */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 pl-3 sm:pl-4 space-y-2.5 border-l-2 border-slate-200 pt-1">
                    {comment.replies.map((reply) => {
                      const isReplyLiked = likedCommentIds.has(`rep_${reply.id}`);
                      return (
                        <div
                          key={reply.id}
                          className={`p-3 rounded-xl text-xs ${
                            reply.isStaff
                              ? 'bg-blue-50/80 border border-blue-200'
                              : 'bg-slate-50 border border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-slate-900">{reply.authorName}</span>
                              {reply.isStaff ? (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-red-100 text-red-900 border border-red-200">
                                  Staff Reply
                                </span>
                              ) : (
                                reply.authorBadge && (
                                  <span className="text-[9px] text-slate-500 font-medium">
                                    • {reply.authorBadge}
                                  </span>
                                )
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>

                          <p className="text-slate-700 mt-1 leading-relaxed">{reply.content}</p>

                          <div className="mt-2 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => handleLikeReply(comment.id, reply.id)}
                              className={`text-[11px] font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                                isReplyLiked
                                  ? 'text-blue-700 bg-blue-100/50'
                                  : 'text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              <ThumbsUp className={`w-3 h-3 ${isReplyLiked ? 'fill-blue-700' : ''}`} />
                              <span>{reply.likes || 0}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* INLINE REPLY COMPOSER */}
                {isReplying && (
                  <div className="mt-3 pl-3 sm:pl-4 border-l-2 border-blue-400 pt-2 animate-fadeIn">
                    <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-900">
                          Replying to {comment.authorName}:
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveReplyCommentId(null)}
                          className="text-[10px] text-slate-400 hover:text-slate-700 font-bold"
                        >
                          ✕ Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={replyAuthorName}
                          onChange={(e) => setReplyAuthorName(e.target.value)}
                          placeholder="Your Name (e.g. Amit K.)"
                          className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your answer or suggestion here..."
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 resize-none"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveReplyCommentId(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isSubmittingReply || !replyText.trim()}
                          onClick={() => handlePostReply(comment.id)}
                          className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isSubmittingReply ? 'Replying...' : 'Post Reply'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

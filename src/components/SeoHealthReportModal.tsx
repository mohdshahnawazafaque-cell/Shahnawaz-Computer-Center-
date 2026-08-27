import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Download,
  Search,
  Filter,
  Eye,
  Globe,
  Tag,
  Share2,
  FileText,
  Clock,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  Play,
  Pause,
  ExternalLink,
  Code,
  Info,
} from 'lucide-react';
import { Post } from '../types';
import {
  runPortalSeoHealthCheck,
  auditPostMetadata,
  generateAutoFixPayload,
  exportReportAsMarkdown,
  downloadTextReport,
  PortalSeoHealthReport,
  PostSeoAuditResult,
  SeoIssueSeverity,
} from '../utils/seoHealthAuditor';
import { saveClientPosts, getClientPosts } from '../utils/clientStorage';

interface SeoHealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  token: string;
  onPostUpdated: (updatedPost: Post) => void;
  onOpenSeoEditor: (post: Post) => void;
  onBulkUpdated?: () => void;
}

export const SeoHealthReportModal: React.FC<SeoHealthReportModalProps> = ({
  isOpen,
  onClose,
  posts,
  token,
  onPostUpdated,
  onOpenSeoEditor,
  onBulkUpdated,
}) => {
  // Audit report state
  const [report, setReport] = useState<PortalSeoHealthReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'suggestion' | 'perfect'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [fixingPostId, setFixingPostId] = useState<string | null>(null);
  const [isBulkFixing, setIsBulkFixing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Periodic automated runner state
  const [autoRunIntervalMinutes, setAutoRunIntervalMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('sarkari_seo_autorun_interval');
    return saved ? Number(saved) : 15; // default 15 mins
  });
  const [isAutoRunEnabled, setIsAutoRunEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('sarkari_seo_autorun_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [lastScanTime, setLastScanTime] = useState<Date>(new Date());
  const [nextScanSeconds, setNextScanSeconds] = useState<number>(15 * 60);

  // Run audit function
  const executeAudit = (silent: boolean = false) => {
    if (!silent) setIsScanning(true);
    try {
      const result = runPortalSeoHealthCheck(posts);
      setReport(result);
      setLastScanTime(new Date());
      setNextScanSeconds(autoRunIntervalMinutes * 60);
      if (!silent) {
        setFeedbackMsg({
          type: 'success',
          text: `SEO Audit Completed: ${result.totalPostsAudited} posts analyzed. Overall Health Score: ${result.overallScore}/100 (${result.averageGrade})`,
        });
      }
    } catch (err: any) {
      if (!silent) {
        setFeedbackMsg({
          type: 'error',
          text: 'Failed to complete SEO Health Check: ' + (err?.message || 'Unknown error'),
        });
      }
    } finally {
      if (!silent) {
        setTimeout(() => setIsScanning(false), 400);
      }
    }
  };

  // Initial audit run on open
  useEffect(() => {
    if (isOpen) {
      executeAudit(true);
    }
  }, [isOpen, posts]);

  // Periodic background check timer
  useEffect(() => {
    if (!isAutoRunEnabled || autoRunIntervalMinutes <= 0) return;

    const timer = setInterval(() => {
      setNextScanSeconds((prev) => {
        if (prev <= 1) {
          executeAudit(true);
          return autoRunIntervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoRunEnabled, autoRunIntervalMinutes, posts]);

  // Save auto-run settings
  const handleAutoRunChange = (interval: number) => {
    setAutoRunIntervalMinutes(interval);
    localStorage.setItem('sarkari_seo_autorun_interval', String(interval));
    setNextScanSeconds(interval * 60);
  };

  const handleToggleAutoRun = () => {
    const next = !isAutoRunEnabled;
    setIsAutoRunEnabled(next);
    localStorage.setItem('sarkari_seo_autorun_enabled', String(next));
    if (next) {
      setNextScanSeconds(autoRunIntervalMinutes * 60);
    }
  };

  // Single Post Auto-Fix
  const handleApplyAutoFix = async (targetPost: Post) => {
    setFixingPostId(targetPost.id);
    try {
      // 1. Try server endpoint
      let updatedPost: Post | null = null;
      try {
        const res = await fetch(`/api/admin/seo-health/post/${targetPost.id}/autofix`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          updatedPost = data.post;
        }
      } catch (e) {
        // Fallback to client storage
      }

      if (!updatedPost) {
        const payload = generateAutoFixPayload(targetPost);
        const all = getClientPosts();
        const idx = all.findIndex((p) => p.id === targetPost.id);
        if (idx !== -1) {
          all[idx] = { ...all[idx], ...payload };
          saveClientPosts(all);
          updatedPost = all[idx];
        } else {
          updatedPost = { ...targetPost, ...payload };
        }
      }

      if (updatedPost) {
        onPostUpdated(updatedPost);
        setFeedbackMsg({
          type: 'success',
          text: `Auto-fix applied successfully for "${updatedPost.title.slice(0, 40)}..."`,
        });
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: 'Failed to apply auto-fix: ' + (err?.message || 'Error'),
      });
    } finally {
      setFixingPostId(null);
    }
  };

  // Bulk Auto-Fix for All Critical/Sub-optimal Posts
  const handleBulkAutoFix = async () => {
    if (!report) return;
    const targets = report.postsResults.filter((r) => r.criticalCount > 0 || r.score < 75);
    if (targets.length === 0) {
      setFeedbackMsg({
        type: 'success',
        text: 'All posts are already well-optimized! No critical fixes needed.',
      });
      return;
    }

    if (!window.confirm(`Auto-optimize search metadata for ${targets.length} posts with missing or short tags?`)) {
      return;
    }

    setIsBulkFixing(true);
    try {
      let bulkSucceeded = false;
      try {
        const res = await fetch('/api/admin/seo-health/bulk-autofix', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postIds: targets.map((t) => t.postId),
            onlyCritical: true,
          }),
        });
        if (res.ok) {
          bulkSucceeded = true;
        }
      } catch (e) {
        // Fallback to client
      }

      if (!bulkSucceeded) {
        const all = getClientPosts();
        for (const target of targets) {
          const idx = all.findIndex((p) => p.id === target.postId);
          if (idx !== -1) {
            const fixPayload = generateAutoFixPayload(all[idx]);
            all[idx] = { ...all[idx], ...fixPayload };
          }
        }
        saveClientPosts(all);
      }

      if (onBulkUpdated) onBulkUpdated();
      executeAudit(false);
      setFeedbackMsg({
        type: 'success',
        text: `Bulk Optimization Complete: Optimized ${targets.length} posts with compliant meta titles, descriptions & OpenGraph cards.`,
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: 'Bulk auto-fix failed: ' + (err?.message || 'Unknown error'),
      });
    } finally {
      setIsBulkFixing(false);
    }
  };

  // Export Report as Markdown
  const handleExportMarkdown = () => {
    if (!report) return;
    const md = exportReportAsMarkdown(report);
    downloadTextReport(md, `sarkari-seo-health-report-${new Date().toISOString().slice(0, 10)}.md`);
    setFeedbackMsg({
      type: 'success',
      text: 'SEO Health Report exported as Markdown successfully!',
    });
  };

  // Export Report as JSON
  const handleExportJson = () => {
    if (!report) return;
    const jsonStr = JSON.stringify(report, null, 2);
    downloadTextReport(jsonStr, `sarkari-seo-health-report-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    setFeedbackMsg({
      type: 'success',
      text: 'SEO Health Report exported as JSON successfully!',
    });
  };

  // Filtered Post Results
  const filteredPosts = useMemo(() => {
    if (!report) return [];
    return report.postsResults.filter((postRes) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        postRes.postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        postRes.postSlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        postRes.currentMeta.seoTitle.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Severity Filter
      if (severityFilter === 'critical' && postRes.criticalCount === 0) return false;
      if (severityFilter === 'warning' && postRes.warningCount === 0 && postRes.criticalCount === 0) return false;
      if (severityFilter === 'suggestion' && postRes.suggestionCount === 0) return false;
      if (severityFilter === 'perfect' && postRes.score < 90) return false;

      // Type Filter
      if (typeFilter !== 'all' && postRes.postType.toLowerCase() !== typeFilter.toLowerCase()) return false;

      return true;
    });
  }, [report, searchQuery, severityFilter, typeFilter]);

  if (!isOpen) return null;

  // Format countdown mm:ss
  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="seo-health-report-modal"
        className="bg-white text-slate-800 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] text-white px-5 py-4 flex items-center justify-between border-b border-blue-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg tracking-wide uppercase">
                  Automated SEO Health Inspector & Diagnostic Report
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Live Audit Engine
                </span>
              </div>
              <p className="text-xs text-blue-200/90 font-medium mt-0.5">
                Periodic automated scans checking metadata, missing tags, social OpenGraph banners, and SERP rankings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FEEDBACK TOAST */}
        {feedbackMsg && (
          <div
            className={`px-5 py-2.5 text-xs font-bold flex items-center justify-between ${
              feedbackMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedbackMsg.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-white/80 hover:text-white underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENT */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-slate-50/50">
          {/* TOP SECTION: GLOBAL SCORE & PERIODIC RUNNER BAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Overall Score Card (4 cols) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-[#0B2545] to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-blue-900/60 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                    Portal SEO Health Score
                  </span>
                  <span className="text-[10px] bg-white/10 text-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                    Grade {report?.averageGrade || 'A'}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 my-2">
                  <span
                    className={`text-5xl font-black ${
                      (report?.overallScore || 0) >= 85
                        ? 'text-emerald-400'
                        : (report?.overallScore || 0) >= 70
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {report?.overallScore ?? '--'}
                  </span>
                  <span className="text-slate-400 text-base font-bold">/ 100</span>
                </div>

                <p className="text-xs text-blue-200 font-medium mt-1 leading-relaxed">
                  {(report?.overallScore || 0) >= 85
                    ? '🌟 Excellent health: Most posts have optimized meta titles, descriptions, and high Google CTR eligibility.'
                    : (report?.overallScore || 0) >= 70
                    ? '⚠️ Moderate health: Some posts are missing OpenGraph social images or concise search snippets.'
                    : '🚨 Needs immediate optimization: Several posts lack meta descriptions or titles.'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden p-0.5 border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      (report?.overallScore || 0) >= 85
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : (report?.overallScore || 0) >= 70
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                        : 'bg-gradient-to-r from-rose-600 to-amber-500'
                    }`}
                    style={{ width: `${report?.overallScore || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Audited: {report?.totalPostsAudited || 0} Posts</span>
                  <span>Last: {lastScanTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Breakdown (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Fully Optimized</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600 my-1">
                  {report?.perfectPostsCount || 0}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">Score 90-100 (Google Ready)</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Good / Minor Adjust</span>
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-blue-600 my-1">
                  {report?.goodPostsCount || 0}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">Score 75-89 (Solid SEO)</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Warnings Detected</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-600 my-1">
                  {report?.warningPostsCount || 0}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">Score 50-74 (Needs Attention)</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Critical SEO Risks</span>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-rose-600 my-1">
                  {report?.criticalPostsCount || 0}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">Score &lt; 50 (Missing tags)</div>
              </div>
            </div>

            {/* Automated Periodic Runner Config Card (3 cols) */}
            <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Auto-Check Schedule</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleAutoRun}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                      isAutoRunEnabled
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isAutoRunEnabled ? '● Active' : '○ Paused'}
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Audit Frequency:
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {[
                      { val: 5, label: '5m' },
                      { val: 15, label: '15m' },
                      { val: 60, label: '1h' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleAutoRunChange(opt.val)}
                        className={`py-1 rounded font-bold text-[11px] border transition-colors ${
                          autoRunIntervalMinutes === opt.val
                            ? 'bg-[#0B2545] text-white border-[#0B2545]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {isAutoRunEnabled && (
                    <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span>Next auto-scan in:</span>
                      <span className="font-bold text-blue-700">{formatCountdown(nextScanSeconds)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => executeAudit(false)}
                  disabled={isScanning}
                  className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-lg border border-blue-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-blue-600' : ''}`} />
                  <span>{isScanning ? 'Scanning Portal...' : 'Run Audit Now'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SUMMARY OF TOP MISSING TAGS & BOTTLENECKS */}
          {report && report.topMissingTags.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Key SEO Bottlenecks & Missing Tags Identified</span>
                </h4>
                <span className="text-[10px] text-amber-800 font-bold">
                  {report.topMissingTags.length} Types of Issues Detected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.topMissingTags.map((item, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                    ></span>
                    <span>{item.tag}:</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono text-[11px]">
                      {item.affectedPostsCount} posts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTION & FILTER TOOLBAR */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts in audit..."
                  className="w-full text-xs pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {[
                  { id: 'all', label: 'All Issues' },
                  { id: 'critical', label: '🔴 Critical Only' },
                  { id: 'warning', label: '🟡 Warnings' },
                  { id: 'suggestion', label: '💡 Suggestions' },
                  { id: 'perfect', label: '✅ Perfect' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSeverityFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors ${
                      severityFilter === f.id
                        ? 'bg-[#0B2545] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="job">Jobs</option>
                <option value="result">Results</option>
                <option value="admit_card">Admit Cards</option>
                <option value="answer_key">Answer Keys</option>
                <option value="syllabus">Syllabus</option>
                <option value="scheme">Schemes / Yojana</option>
              </select>
            </div>

            {/* Quick Bulk Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleBulkAutoFix}
                disabled={isBulkFixing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isBulkFixing ? 'animate-spin' : 'text-amber-300'}`} />
                <span>{isBulkFixing ? 'Optimizing...' : 'Auto-Optimize All Issues'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  title="Download Markdown Report"
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Report.md</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportJson}
                  title="Download JSON Report"
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* POST DIAGNOSTIC ITEMS LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Showing {filteredPosts.length} Posts Analyzed</span>
              <span>Click any post card to view comprehensive diagnostic details & optimization tips</span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 font-medium">
                No posts match the selected SEO health filter.
              </div>
            ) : (
              filteredPosts.map((auditRes) => {
                const originalPost = posts.find((p) => p.id === auditRes.postId);
                const isExpanded = expandedPostId === auditRes.postId;
                const isFixing = fixingPostId === auditRes.postId;

                return (
                  <div
                    key={auditRes.postId}
                    className={`bg-white rounded-xl border transition-all duration-200 shadow-2xs overflow-hidden ${
                      auditRes.criticalCount > 0
                        ? 'border-rose-200 hover:border-rose-300'
                        : auditRes.warningCount > 0
                        ? 'border-amber-200 hover:border-amber-300'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {/* CARD HEADER ROW */}
                    <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                      {/* Left: Score Badge & Title */}
                      <div className="flex items-start gap-3 flex-1">
                        {/* Score Circle */}
                        <div
                          className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-black border ${
                            auditRes.score >= 90
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : auditRes.score >= 75
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : auditRes.score >= 50
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <span className="text-base leading-none">{auditRes.score}</span>
                          <span className="text-[9px] font-bold opacity-75">{auditRes.grade}</span>
                        </div>

                        {/* Title & Metadata Pills */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded uppercase">
                              {auditRes.postType}
                            </span>
                            {auditRes.criticalCount > 0 && (
                              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                <span>{auditRes.criticalCount} Critical</span>
                              </span>
                            )}
                            {auditRes.warningCount > 0 && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>{auditRes.warningCount} Warnings</span>
                              </span>
                            )}
                            {auditRes.suggestionCount > 0 && (
                              <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-1.5 py-0.5 rounded">
                                {auditRes.suggestionCount} Suggestions
                              </span>
                            )}
                            {auditRes.criticalCount === 0 && auditRes.warningCount === 0 && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Optimal</span>
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                            {auditRes.postTitle}
                          </h4>

                          {/* Quick Tag Summary Line */}
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3 text-slate-400" />
                              <span className="font-mono text-slate-700">
                                Title: {auditRes.currentMeta.seoTitle.length}ch
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-slate-400" />
                              <span className="font-mono text-slate-700">
                                Desc: {auditRes.currentMeta.metaDescription.length}/160ch
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3 text-slate-400" />
                              <span>{auditRes.currentMeta.keywordsCount} tags</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="w-3 h-3 text-slate-400" />
                              <span>{auditRes.currentMeta.hasOgImage ? 'OG Image ✓' : 'No OG ✗'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Action Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {originalPost && (
                          <button
                            type="button"
                            onClick={() => handleApplyAutoFix(originalPost)}
                            disabled={isFixing}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors shadow-2xs"
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${isFixing ? 'animate-spin text-emerald-600' : 'text-emerald-600'}`} />
                            <span>{isFixing ? 'Fixing...' : 'Auto-Fix'}</span>
                          </button>
                        )}

                        {originalPost && (
                          <button
                            type="button"
                            onClick={() => onOpenSeoEditor(originalPost)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Edit SEO</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setExpandedPostId(isExpanded ? null : auditRes.postId)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* EXPANDABLE DETAILED DIAGNOSTIC & SUGGESTIONS ACCORDION */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50/80 p-4 sm:p-5 space-y-4">
                        {/* Current Meta State Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                          <div>
                            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-0.5">
                              Current Search Meta Title (&lt;title&gt;)
                            </span>
                            <div className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[11px] break-words">
                              {auditRes.currentMeta.seoTitle || <span className="text-red-500 italic">Missing</span>}
                            </div>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-0.5">
                              Current Meta Description
                            </span>
                            <div className="font-medium text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 text-[11px] leading-relaxed break-words">
                              {auditRes.currentMeta.metaDescription || <span className="text-red-500 italic">Missing</span>}
                            </div>
                          </div>
                        </div>

                        {/* Audit Issues & Smart Suggestions */}
                        <div className="space-y-2">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-blue-600" />
                            <span>Detailed Audit Findings & Actionable Recommendations</span>
                          </h5>

                          <div className="space-y-2">
                            {auditRes.issues.map((issue, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border text-xs ${
                                  issue.severity === 'critical'
                                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                                    : issue.severity === 'warning'
                                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                                    : issue.severity === 'suggestion'
                                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-2">
                                    {issue.severity === 'critical' ? (
                                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                    ) : issue.severity === 'warning' ? (
                                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    ) : issue.severity === 'suggestion' ? (
                                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                    ) : (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                      <div className="font-bold text-xs">{issue.title}</div>
                                      <div className="text-[11px] opacity-90 mt-0.5">{issue.message}</div>
                                      {issue.suggestion && (
                                        <div className="mt-1.5 p-2 rounded bg-white/75 border border-current/20 text-[11px] font-semibold">
                                          💡 <span className="font-bold">Recommendation:</span> {issue.suggestion}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 ${
                                      issue.severity === 'critical'
                                        ? 'bg-rose-200 text-rose-900'
                                        : issue.severity === 'warning'
                                        ? 'bg-amber-200 text-amber-900'
                                        : issue.severity === 'suggestion'
                                        ? 'bg-blue-200 text-blue-900'
                                        : 'bg-emerald-200 text-emerald-900'
                                    }`}
                                  >
                                    {issue.severity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Automated SEO health checks update whenever posts are created, modified, or auto-fixed.
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors shadow-2xs"
            >
              Close Inspector
            </button>
            <button
              type="button"
              onClick={handleBulkAutoFix}
              disabled={isBulkFixing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBulkFixing ? 'Processing...' : 'Auto-Optimize All Posts'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

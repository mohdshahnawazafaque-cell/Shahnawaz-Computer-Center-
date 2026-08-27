import React, { useState, useMemo } from 'react';
import {
  X,
  RefreshCw,
  Download,
  Copy,
  Check,
  Globe,
  ExternalLink,
  Code,
  Sparkles,
  FileCheck,
  Search,
  Layers,
  Image as ImageIcon,
  Newspaper,
  Send,
  Zap,
} from 'lucide-react';
import { Post, Category } from '../types';
import {
  generateAutoXmlSitemap,
  downloadSitemapXml,
  getSearchEnginePingUrls,
  SitemapGenerationMetrics,
} from '../utils/sitemapGenerator';

interface SitemapGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  categories: Category[];
  token?: string | null;
  onServerRebuildSuccess?: (stats: any) => void;
}

export const SitemapGeneratorModal: React.FC<SitemapGeneratorModalProps> = ({
  isOpen,
  onClose,
  posts,
  categories,
  token,
  onServerRebuildSuccess,
}) => {
  const [baseUrl, setBaseUrl] = useState(
    typeof window !== 'undefined' ? window.location.origin : 'https://shahnawazcomputercenter.in'
  );
  const [includeImages, setIncludeImages] = useState(true);
  const [includeNews, setIncludeNews] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isRebuildingServer, setIsRebuildingServer] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Auto-generate XML sitemap based on current parameters and database posts
  const { xml, entries, metrics } = useMemo(() => {
    return generateAutoXmlSitemap(posts, categories, {
      baseUrl: baseUrl.trim() || undefined,
      includeImages,
      includeGoogleNews: includeNews,
    });
  }, [posts, categories, baseUrl, includeImages, includeNews]);

  if (!isOpen) return null;

  const showNotice = (text: string) => {
    setFeedback(text);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(xml);
    setCopied(true);
    showNotice('Sitemap XML copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadSitemapXml(xml, 'sitemap.xml');
    showNotice('sitemap.xml downloaded to your computer!');
  };

  const handleServerRebuild = async () => {
    if (!token) {
      showNotice('Sitemap generated from client database!');
      return;
    }
    setIsRebuildingServer(true);
    try {
      const res = await fetch('/api/admin/sitemap/rebuild', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (onServerRebuildSuccess) onServerRebuildSuccess(data.stats);
        showNotice(data.message || 'Server sitemap.xml regenerated & disk cached!');
      } else {
        showNotice('Generated client sitemap fallback');
      }
    } catch {
      showNotice('Generated client sitemap fallback');
    } finally {
      setIsRebuildingServer(false);
    }
  };

  const pingUrls = getSearchEnginePingUrls(`${baseUrl.replace(/\/+$/, '')}/sitemap.xml`);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md font-black">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                  XML Sitemap Auto-Generator
                </h3>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase font-mono">
                  Sitemaps 0.9 W3C
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Auto-generate and inspect high-crawlability XML sitemaps for Google, Bing & Yandex
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800/10 hover:bg-white dark:bg-slate-800/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2 flex items-center justify-between animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{feedback}</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Controls & Configuration Bar */}
          <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Auto-Generation Settings</span>
              </h4>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                Database: {posts.length} Total Posts Loaded
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Canonical Base URL
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://shahnawazcomputercenter.in"
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-4 pt-4 md:pt-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    Google Image Schema
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeNews}
                    onChange={(e) => setIncludeNews(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                    <Newspaper className="w-3.5 h-3.5 text-orange-600" />
                    Google News (48h)
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2 md:justify-end pt-2 md:pt-4">
                <button
                  type="button"
                  onClick={handleServerRebuild}
                  disabled={isRebuildingServer}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRebuildingServer ? 'animate-spin' : ''}`} />
                  <span>{isRebuildingServer ? 'Rebuilding...' : 'Re-crawl Server'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download XML</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Crawl Metrics Dashboard */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Index Coverage & Crawl Statistics</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-black uppercase text-blue-900 block">Total URLs</span>
                <span className="text-xl font-black text-blue-800">{metrics.totalUrls}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300 block">Jobs</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{metrics.jobsCount}</span>
              </div>
              <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase text-orange-900 block">Admit Cards</span>
                <span className="text-lg font-black text-orange-800">{metrics.admitCardsCount}</span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase text-emerald-900 block">Results</span>
                <span className="text-lg font-black text-emerald-800">{metrics.resultsCount}</span>
              </div>
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase text-purple-900 block">Yojana</span>
                <span className="text-lg font-black text-purple-800">{metrics.schemesCount}</span>
              </div>
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase text-sky-900 block">Images</span>
                <span className="text-lg font-black text-sky-800">{metrics.imagesIndexedCount}</span>
              </div>
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase text-amber-900 block">Size</span>
                <span className="text-xs font-mono font-black text-amber-900 mt-1 block">
                  {(metrics.fileSizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          </div>

          {/* XML Output Code Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-600" />
                <span>Generated sitemap.xml Preview ({entries.length} URL entries)</span>
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy XML'}</span>
                </button>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Open /sitemap.xml</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-slate-950 text-emerald-400 font-mono text-[11px] p-4 rounded-xl border border-slate-800 max-h-72 overflow-y-auto leading-relaxed shadow-inner select-all">
              <pre className="whitespace-pre">{xml}</pre>
            </div>
          </div>

          {/* Search Engine Crawl & Ping Submissions */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl p-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Search Engine Crawl Ping & Webmaster Submission</span>
            </h4>
            <p className="text-xs text-blue-200 mb-3">
              Notify Google, Bing, and web crawlers immediately after publishing new recruitments, answer keys, or results.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={pingUrls.google}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white dark:bg-slate-800/10 hover:bg-white dark:bg-slate-800/20 rounded-lg text-xs font-bold flex items-center justify-between border border-white/10 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ping Google Search</span>
                </span>
                <ExternalLink className="w-3 h-3 text-slate-300" />
              </a>

              <a
                href={pingUrls.bing}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white dark:bg-slate-800/10 hover:bg-white dark:bg-slate-800/20 rounded-lg text-xs font-bold flex items-center justify-between border border-white/10 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>Ping Bing Webmaster</span>
                </span>
                <ExternalLink className="w-3 h-3 text-slate-300" />
              </a>

              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white dark:bg-slate-800/10 hover:bg-white dark:bg-slate-800/20 rounded-lg text-xs font-bold flex items-center justify-between border border-white/10 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Search Console</span>
                </span>
                <ExternalLink className="w-3 h-3 text-slate-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-700 px-6 py-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            W3C standard XML format recognized by Googlebot, Bingbot, DuckDuckGo & Yandex.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

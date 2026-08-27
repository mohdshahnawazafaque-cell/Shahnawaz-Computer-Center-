import React, { useState } from 'react';
import {
  Rss,
  X,
  Copy,
  Check,
  ExternalLink,
  Briefcase,
  Award,
  CreditCard,
  Layers,
  Sparkles,
  Info,
  Radio,
} from 'lucide-react';

interface RssFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RssFeedModal: React.FC<RssFeedModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const feeds = [
    {
      id: 'all',
      title: 'Master All-in-One Feed',
      description: 'Instant alerts for every new Vacancy, Admit Card, Result, Answer Key & Govt Scheme.',
      category: 'All Updates',
      url: `${origin}/rss.xml`,
      badge: 'Recommended',
      badgeColor: 'bg-red-600 text-white',
      icon: Radio,
    },
    {
      id: 'jobs',
      title: 'Sarkari Naukri / Vacancies Only',
      description: 'Central & State Government job recruitments, eligibility, and direct apply deadlines.',
      category: 'Vacancies',
      url: `${origin}/rss.xml?category=vacancy`,
      badge: 'Jobs',
      badgeColor: 'bg-blue-600 text-white',
      icon: Briefcase,
    },
    {
      id: 'admit-card',
      title: 'Admit Cards & Hall Tickets Only',
      description: 'Direct call letters, exam center city slips, and exam date announcements.',
      category: 'Admit Cards',
      url: `${origin}/rss.xml?category=admit-card`,
      badge: 'Exam Passes',
      badgeColor: 'bg-amber-600 text-white',
      icon: CreditCard,
    },
    {
      id: 'results',
      title: 'Sarkari Results & Scorecards Only',
      description: 'Written exam scores, final selection merit lists, cut-off marks & recommendations.',
      category: 'Results',
      url: `${origin}/rss.xml?category=result`,
      badge: 'Merit Lists',
      badgeColor: 'bg-emerald-600 text-white',
      icon: Award,
    },
    {
      id: 'up-state',
      title: 'Uttar Pradesh (UP) State Jobs Feed',
      description: 'Exclusive alerts for UP Police, UPPSC, UPSSSC, UP Scholarship, and state recruitment.',
      category: 'UP State',
      url: `${origin}/rss.xml?state=Uttar%20Pradesh`,
      badge: 'UP Special',
      badgeColor: 'bg-purple-600 text-white',
      icon: Layers,
    },
  ];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div
      id="rss-feed-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="rss-feed-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B2545] text-white p-5 flex items-center justify-between border-b-4 border-red-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                RSS Feeds & News Reader Syndication
              </h3>
              <p className="text-xs text-amber-300 font-medium">
                Subscribe to instant real-time government recruitment alerts
              </p>
            </div>
          </div>
          <button
            id="rss-modal-close-btn"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 flex-1">
          {/* Quick Explainer */}
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">What is an RSS Feed?</p>
              <p className="text-amber-800 leading-relaxed">
                RSS allows you to get new vacancies, admit cards, and results delivered automatically to your favorite news reader (like Feedly, Inoreader, Thunderbird, NetNewsWire, or RSS Telegram bots) without spam or delays.
              </p>
            </div>
          </div>

          {/* Feed List */}
          <div className="space-y-3">
            {feeds.map((feed) => {
              const Icon = feed.icon;
              const isCopied = copiedUrl === feed.url;

              return (
                <div
                  key={feed.id}
                  id={`rss-feed-item-${feed.id}`}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-100/70 text-blue-900 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{feed.title}</h4>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${feed.badgeColor}`}>
                            {feed.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">{feed.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* URL Box & Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-[11px] text-slate-700 truncate select-all">
                      {feed.url}
                    </div>

                    <button
                      id={`rss-copy-btn-${feed.id}`}
                      onClick={() => handleCopy(feed.url)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0 ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0B2545] text-white hover:bg-blue-900'
                      }`}
                      title="Copy RSS URL"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <a
                      id={`rss-view-xml-btn-${feed.id}`}
                      href={feed.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors flex-shrink-0"
                      title="Open XML Feed in browser"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Raw XML</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Reader Integrations */}
          <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 text-xs">
            <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Quick 1-Click Feed Reader Import:</span>
            </h5>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://feedly.com/i/subscription/feed/${encodeURIComponent(`${origin}/rss.xml`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>Subscribe on Feedly</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`https://www.inoreader.com/?add_feed=${encodeURIComponent(`${origin}/rss.xml`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>Subscribe on Inoreader</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`${origin}/rss.xml`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>Direct Feed (/rss.xml)</span>
                <Rss className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Standards: <strong>RSS 2.0 & Atom</strong> • UTF-8 • Auto-updating</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-lg font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface SharePortalButtonProps {
  className?: string;
  variant?: 'header' | 'footer' | 'floating' | 'card';
}

export const SharePortalButton: React.FC<SharePortalButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const shareTitle = settings?.websiteName || 'Shahnawaz Computer Center';
    const shareText = `${settings?.websiteName || 'Shahnawaz Computer Center'} - Latest Government Jobs, Sarkari Results, Admit Cards, Sarkari Yojana & Online Form Filling Services.`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        // Ignore user cancel errors (AbortError)
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    });
  };

  if (variant === 'footer') {
    return (
      <div className="relative inline-block">
        <button
          id="footer-share-portal-btn"
          onClick={handleShare}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-md transition-all uppercase tracking-wider ${className}`}
          title="Share Shahnawaz Computer Center Portal"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Portal</span>
            </>
          )}
        </button>

        {showToast && (
          <div className="absolute bottom-full left-0 mb-2 whitespace-nowrap bg-slate-900 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-xl flex items-center gap-1.5 z-50 animate-bounce">
            <Copy className="w-3.5 h-3.5" />
            <span>Website link copied to clipboard!</span>
          </div>
        )}
      </div>
    );
  }

  // Header / default variant
  return (
    <div className="relative inline-block">
      <button
        id="header-share-portal-btn"
        onClick={handleShare}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-xs ${className}`}
        title="Share This Portal with Friends & Family"
        aria-label="Share This Portal"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-emerald-700">Copied</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden sm:inline">Share Portal</span>
            <span className="sm:hidden">Share</span>
          </>
        )}
      </button>

      {showToast && (
        <div className="fixed sm:absolute top-16 sm:top-full right-4 sm:right-0 mt-2 whitespace-nowrap bg-[#0B2545] text-amber-300 border border-blue-800 px-3 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 z-50">
          <Copy className="w-4 h-4 text-amber-400" />
          <span>Website link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

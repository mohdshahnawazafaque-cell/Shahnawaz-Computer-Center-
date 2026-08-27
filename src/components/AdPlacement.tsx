import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Monitor } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { GoogleAdSense } from './GoogleAdSense';

interface AdPlacementProps {
  placement:
    | 'header'
    | 'home_middle'
    | 'post_top'
    | 'post_before_links'
    | 'post_after_links'
    | 'footer'
    | 'sidebar';
  className?: string;
  onActionClick?: () => void;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({
  placement,
  className = '',
  onActionClick,
}) => {
  const { ads, settings } = useSettings();

  const ad = ads.find((a) => a.placement === placement && a.enabled);
  if (!ad) return null;

  if (ad.codeHtml && ad.codeHtml.trim()) {
    // If the snippet looks like a Google AdSense code block, parse and render it safely
    if (ad.codeHtml.includes('adsbygoogle') || ad.codeHtml.includes('ca-pub-')) {
      const slotMatch = ad.codeHtml.match(/data-ad-slot=["']([^"']+)["']/);
      const slot = slotMatch ? slotMatch[1] : undefined;
      const clientMatch = ad.codeHtml.match(/data-ad-client=["']([^"']+)["']/);
      const client = clientMatch ? clientMatch[1] : 'ca-pub-6516980434501091';

      return <GoogleAdSense className={className} slot={slot} client={client} />;
    }

    // Custom HTML banner
    return (
      <div
        id={`ad-container-${placement}`}
        className={`my-4 p-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-center overflow-hidden ${className}`}
        dangerouslySetInnerHTML={{ __html: ad.codeHtml }}
      />
    );
  }

  // If enabled but no custom code is provided, use Google AdSense by default
  return <GoogleAdSense className={className} />;
};

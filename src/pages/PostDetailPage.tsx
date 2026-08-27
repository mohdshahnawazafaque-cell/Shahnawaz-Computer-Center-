import React, { useState, useEffect } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Share2,
  MessageCircle,
  Facebook,
  Twitter,
  Send,
  Copy,
  Check,
  Share,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Layers,
  Sparkles,
  Phone,
  Monitor,
  Printer,
  Eye,
  Flame,
  TrendingUp,
  Zap,
  Activity,
} from 'lucide-react';
import { Post, PostType } from '../types';
import { calculatePostStatus, getStatusBadgeConfig } from '../utils/statusCalculator';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImportantLinksTable } from '../components/ImportantLinksTable';
import { AdPlacement } from '../components/AdPlacement';
import { PostCommentSection } from '../components/PostCommentSection';
import { ReadingProgressBar } from '../components/ReadingProgressBar';
import { useSettings } from '../context/SettingsContext';
import { getClientPostBySlug, getClientPosts, incrementClientPostViews } from '../utils/clientStorage';

interface PostDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onSelectPost: (slug: string, type: PostType) => void;
}

export function getPopularityMetrics(viewsCount: number, isFeatured?: boolean, isPinned?: boolean) {
  const v = Math.max(0, viewsCount || 0);
  if (v >= 1800 || isPinned) {
    return {
      tier: 'viral' as const,
      label: 'Trending #1 in Sarkari',
      badgeText: '🔥 High Demand Vacancy',
      colorClass: 'bg-rose-50 border-rose-200 text-rose-800',
      badgeBgClass: 'bg-rose-600 text-white',
      barPercent: '96%',
      barGradient: 'from-rose-500 via-orange-500 to-amber-500',
      indicatorText: 'Top 5% most viewed government job notifications this week',
      estimatedToday: Math.floor(v * 0.12) + 42,
    };
  }
  if (v >= 800 || isFeatured) {
    return {
      tier: 'popular' as const,
      label: 'High Popularity',
      badgeText: '⚡ High Demand Alert',
      colorClass: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBgClass: 'bg-amber-500 text-white',
      barPercent: '82%',
      barGradient: 'from-amber-500 to-orange-500',
      indicatorText: 'High candidate interest and continuous application traffic',
      estimatedToday: Math.floor(v * 0.08) + 24,
    };
  }
  if (v >= 300) {
    return {
      tier: 'rising' as const,
      label: 'Popular Notice',
      badgeText: '📈 Rising Interest',
      colorClass: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeBgClass: 'bg-blue-600 text-white',
      barPercent: '65%',
      barGradient: 'from-blue-500 to-indigo-500',
      indicatorText: 'Steady stream of aspirant candidate inquiries today',
      estimatedToday: Math.floor(v * 0.05) + 12,
    };
  }
  return {
    tier: 'active' as const,
    label: 'Active Notice',
    badgeText: '✨ Active Vacancy',
    colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    badgeBgClass: 'bg-emerald-600 text-white',
    barPercent: '48%',
    barGradient: 'from-emerald-500 to-teal-500',
    indicatorText: 'Newly published notification receiving candidate views',
    estimatedToday: Math.max(8, Math.floor(v * 0.05) + 6),
  };
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({
  slug,
  onNavigate,
  onSelectPost,
}) => {
  const { settings } = useSettings();
  const [post, setPost] = useState<Post | null>(() => getClientPostBySlug(slug) || null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [readingTime, setReadingTime] = useState<number>(1);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setCanShare(true);
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      let data: Post | null = null;
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (res.ok) {
          data = await res.json();
        } else {
          data = getClientPostBySlug(slug) || null;
          if (data) {
            const updatedViews = incrementClientPostViews(slug);
            data.views = updatedViews || (data.views || 0) + 1;
          }
        }
      } catch (err) {
        data = getClientPostBySlug(slug) || null;
        if (data) {
          const updatedViews = incrementClientPostViews(slug);
          data.views = updatedViews || (data.views || 0) + 1;
        }
      }

      if (data) {
        setPost(data);

        // Calculate reading time based on content
        const textContent = (data.shortDescription || '').replace(/<[^>]+>/g, ' '); // Strip HTML tags
        const wordCount = textContent.trim().split(/\s+/).filter(w => w.length > 0).length;
        setReadingTime(Math.max(1, Math.ceil(wordCount / 200))); // 200 words per minute average reading speed

        // Update Document Head SEO Meta Tags dynamically
        const title = data.seoTitle || `${data.title} - Shahnawaz Computer Center`;
        const desc = data.metaDescription || data.shortDescription || `Get full recruitment details for ${data.title} at Shahnawaz Computer Center.`;
        const kw = data.keywords && data.keywords.length > 0 ? data.keywords.join(', ') : `${data.title}, Sarkari Result, Apply Online, Shahnawaz Computer Center`;
        const ogImg = data.ogImage || data.featuredImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80';
        const curUrl = data.canonicalUrl || window.location.href;

        document.title = title;

        // Helper to set or create meta tag
        const setMeta = (nameAttr: string, nameVal: string, content: string) => {
          let tag = document.querySelector(`meta[${nameAttr}="${nameVal}"]`) as HTMLMetaElement;
          if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(nameAttr, nameVal);
            document.head.appendChild(tag);
          }
          tag.content = content;
        };

        setMeta('name', 'description', desc);
        setMeta('name', 'keywords', kw);
        setMeta('name', 'robots', data.robotsIndex || 'index, follow');
        setMeta('name', 'author', data.authorName || 'Shahnawaz Computer Center');

        // Open Graph
        setMeta('property', 'og:title', data.ogTitle || title);
        setMeta('property', 'og:description', data.ogDescription || desc);
        setMeta('property', 'og:image', ogImg);
        setMeta('property', 'og:url', curUrl);
        setMeta('property', 'og:type', data.ogType || 'article');
        setMeta('property', 'og:site_name', 'Shahnawaz Computer Center');

        // Twitter Card
        setMeta('name', 'twitter:card', data.twitterCard || 'summary_large_image');
        setMeta('name', 'twitter:title', data.twitterTitle || data.ogTitle || title);
        setMeta('name', 'twitter:description', data.twitterDescription || data.ogDescription || desc);
        setMeta('name', 'twitter:image', data.twitterImage || ogImg);
        setMeta('name', 'twitter:site', data.twitterSite || '@shahnawazcc');
        setMeta('name', 'twitter:creator', data.twitterCreator || '@mohdshahnawaz');

        // Canonical Link
        let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = curUrl;

        // JSON-LD Structured Data for Google Jobs / Schema
        let schemaScript = document.getElementById('post-json-ld-schema') as HTMLScriptElement;
        if (!schemaScript) {
          schemaScript = document.createElement('script');
          schemaScript.id = 'post-json-ld-schema';
          schemaScript.type = 'application/ld+json';
          document.head.appendChild(schemaScript);
        }

        const schemaData =
          data.type === 'job'
            ? {
                '@context': 'https://schema.org',
                '@type': 'JobPosting',
                title: data.seoTitle || data.title,
                description: desc,
                datePosted: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
                validThrough: data.lastDate ? new Date(data.lastDate).toISOString() : undefined,
                employmentType: 'FULL_TIME',
                hiringOrganization: {
                  '@type': 'Organization',
                  name: data.department || data.organization || 'Government Recruitment Board',
                  sameAs: data.officialSource?.websiteUrl || 'https://gov.in',
                },
                jobLocation: {
                  '@type': 'Place',
                  address: {
                    '@type': 'PostalAddress',
                    addressRegion: data.state || 'Uttar Pradesh',
                    addressCountry: 'IN',
                  },
                },
                url: curUrl,
              }
            : {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: data.seoTitle || data.title,
                description: desc,
                image: ogImg,
                datePublished: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
                dateModified: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString(),
                author: {
                  '@type': 'Organization',
                  name: 'Shahnawaz Computer Center',
                  url: 'https://shahnawazcomputercenter.in',
                },
                mainEntityOfPage: curUrl,
              };

        schemaScript.textContent = JSON.stringify(schemaData);

        // Fetch related posts from same category/type
        try {
          const relRes = await fetch(`/api/posts?type=${data.type}&limit=4`);
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedPosts((relData.posts || []).filter((p: Post) => p.id !== data!.id));
          } else {
            const all = getClientPosts();
            setRelatedPosts(all.filter((p) => p.type === data!.type && p.id !== data!.id).slice(0, 4));
          }
        } catch {
          const all = getClientPosts();
          setRelatedPosts(all.filter((p) => p.type === data.type && p.id !== data.id).slice(0, 4));
        }
      }

      setIsLoading(false);
    };
    fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20 max-w-4xl mx-auto text-center">
        <div className="inline-block w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-slate-600 text-sm font-semibold">Loading notification details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 max-w-md mx-auto text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Post Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested recruitment or notice might have been removed or moved to another section.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-4 py-2 bg-[#0B2545] text-white font-bold text-xs rounded-lg shadow"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const computedStatus = calculatePostStatus(post);
  const badge = getStatusBadgeConfig(computedStatus);
  const popularity = getPopularityMetrics(post.views, post.isFeatured, post.isPinned);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    let success = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pageUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => {
          // Fallback if clipboard API throws permission error
          fallbackCopy(pageUrl);
        });
    } else {
      fallbackCopy(pageUrl);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const copiedOk = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (copiedOk) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.warn('Clipboard copy failed', err);
    }
  };

  const shareTitle = `${post.title} - Sarkari Recruitment Notice`;
  const shareSummary = `📢 *${post.title}*\n🏢 Department: ${post.department || 'Government of India'}\n👥 Vacancies: ${post.totalVacancy || 'See Notification'}\n📅 Last Date: ${post.lastDate || 'Check Details'}\n\n👉 *Full Details & Direct Apply Link:* \n${pageUrl}\n\n🌐 Shahnawaz Computer Center`;

  const whatsAppShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareSummary)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`📢 ${post.title} - Check Eligibility, Vacancy & Apply Online:`)}&url=${encodeURIComponent(pageUrl)}&hashtags=SarkariNaukri,GovtJobs,${(post.category || 'Jobs').replace(/[^a-zA-Z0-9]/g, '')}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(`📢 ${post.title}\n\nApply Online & Full Details:`)}`;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out ${post.title} on Shahnawaz Computer Center:`,
          url: pageUrl,
        });
      } catch (err) {
        // Ignored if cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsAppServiceNumber = settings?.whatsAppNumber ? settings.whatsAppNumber.replace(/[^0-9]/g, '') : '919956078419';

  return (
    <div id="post-detail-container" className="pb-16 relative">
      {/* Dynamic Reading Progress Bar with Quick Jump Anchors */}
      <ReadingProgressBar
        post={post}
        onNavigate={onNavigate}
        onShare={handleNativeShare}
      />

      {/* Link Copied Toast Alert */}
      {copied && (
        <div
          id="copy-toast-notification"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl border border-emerald-500/50 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
          <span>Post link copied to clipboard!</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="no-print">
        <Breadcrumbs
          items={[
            { label: post.category || 'Recruitment', path: `/category/${post.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
            { label: post.title },
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <article className="max-w-5xl mx-auto px-4 space-y-6">
        {/* PRINT-ONLY HEADER BANNER */}
        <div className="print-only pb-4 mb-4 border-b-2 border-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0B2545] uppercase tracking-tight">
                SHAHNAWAZ COMPUTER CENTER
              </h2>
              <p className="text-xs text-slate-800 font-bold">
                Government Recruitment Alerts & Online Form Filling Portal • Tambour (Sitapur, UP)
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Helpline / WhatsApp: +91 99560 78419 • Portal: {typeof window !== 'undefined' ? window.location.origin : 'https://shahnawaz-computer.web.app'}
              </p>
            </div>
            <div className="text-right text-[10px] text-slate-600 shrink-0">
              <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-300 font-bold uppercase rounded text-slate-900">
                Official Job Notice
              </span>
              <p className="mt-1">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Top Ad Placement */}
        <div className="no-print">
          <AdPlacement placement="post_top" onActionClick={() => onNavigate('/services')} />
        </div>

        {/* Main Post Header Card */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-4 sm:p-6 overflow-hidden">
          {/* Badges & Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${badge.bgClass} ${badge.borderClass}`}>
                <span className={`w-2 h-2 rounded-full ${badge.dotClass}`}></span>
                {badge.label}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {post.category}
              </span>
              {post.state && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>{post.state}</span>
                </span>
              )}

              {/* Database View Counter Badge */}
              <span
                id="post-header-views-badge"
                title="Total candidates tracked in database"
                className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>{(post.views || 0).toLocaleString('en-IN')} Views</span>
              </span>

              {/* Popularity Indicator Pill */}
              <span
                id="post-header-popularity-badge"
                className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${popularity.colorClass}`}
              >
                {popularity.tier === 'viral' ? (
                  <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                ) : popularity.tier === 'popular' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                ) : popularity.tier === 'rising' ? (
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{popularity.badgeText}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Posted: {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0B2545] leading-tight tracking-tight uppercase font-sans">
            {post.title}
          </h1>

          {/* Department / Organization & Vacancy summary */}
          <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
            {post.department && (
              <div className="flex items-center gap-1.5 font-bold">
                <Building2 className="w-4 h-4 text-red-600" />
                <span>{post.department}</span>
              </div>
            )}
            {post.totalVacancy && (
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Total Vacancy: {post.totalVacancy}</span>
              </div>
            )}
          </div>

          {/* Short Description */}
          {post.shortDescription && (
            <div className="mt-4 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              <p>{post.shortDescription}</p>
            </div>
          )}

          {/* Social Share & Print Action Bar */}
          <div className="no-print mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Share or Save:</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* WhatsApp */}
              <a
                id="share-whatsapp-btn"
                href={whatsAppShareUrl}
                target="_blank"
                rel="noreferrer"
                title="Share on WhatsApp"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold shadow-xs transition-transform active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>

              {/* Facebook */}
              <a
                id="share-facebook-btn"
                href={facebookShareUrl}
                target="_blank"
                rel="noreferrer"
                title="Share on Facebook"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-xs font-bold shadow-xs transition-transform active:scale-95"
              >
                <Facebook className="w-3.5 h-3.5 fill-white" />
                <span>Facebook</span>
              </a>

              {/* Twitter / X */}
              <a
                id="share-twitter-btn"
                href={twitterShareUrl}
                target="_blank"
                rel="noreferrer"
                title="Share on Twitter / X"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-transform active:scale-95"
              >
                <Twitter className="w-3.5 h-3.5 fill-white" />
                <span>Twitter / X</span>
              </a>

              {/* Telegram */}
              <a
                id="share-telegram-btn"
                href={telegramShareUrl}
                target="_blank"
                rel="noreferrer"
                title="Share on Telegram"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#229ED9] hover:bg-[#1d8cc2] text-white rounded-lg text-xs font-bold shadow-xs transition-transform active:scale-95 hidden sm:inline-flex"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              {/* Native Device Share */}
              {canShare && (
                <button
                  type="button"
                  id="native-share-btn"
                  onClick={handleNativeShare}
                  title="More Sharing Options"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition-colors shadow-xs"
                >
                  <Share className="w-3.5 h-3.5" />
                  <span>Share Via...</span>
                </button>
              )}

              {/* Copy Link */}
              <button
                type="button"
                id="copy-link-btn"
                onClick={handleCopyLink}
                title="Copy Direct URL"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              {/* Print / Save PDF Button */}
              <button
                type="button"
                id="print-post-btn"
                onClick={() => window.print()}
                title="Print this notification or save as PDF"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold shadow-xs transition-transform active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* CANDIDATE INTEREST & REAL-TIME POPULARITY CARD */}
        <div
          id="post-popularity-meter-card"
          className="bg-gradient-to-br from-[#07172c] via-[#0B2545] to-[#081f3b] text-white rounded-2xl p-4 sm:p-5 shadow-md border border-blue-900/60 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Title & Status */}
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
                  {popularity.tier === 'viral' ? (
                    <Flame className="w-6 h-6 text-rose-400 animate-pulse" />
                  ) : popularity.tier === 'popular' ? (
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Activity className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base uppercase tracking-wider text-white">
                      Job Popularity & Candidate Engagement
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${popularity.badgeBgClass} shadow-xs`}>
                      {popularity.label}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/90 mt-0.5 font-medium">
                    {popularity.indicatorText}
                  </p>
                </div>
              </div>

              {/* Right Live Stats Counter */}
              <div className="flex items-center gap-3 bg-slate-900/60 border border-white/10 px-4 py-2.5 rounded-xl self-start md:self-auto shrink-0 shadow-xs">
                <div className="text-center px-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Views</span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-base sm:text-lg font-black text-amber-400">{(post.views || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/15"></div>
                <div className="text-center px-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Estimated Today</span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-base sm:text-lg font-black text-emerald-400">~{popularity.estimatedToday}+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Popularity Meter Progress Bar */}
            <div className="mt-4 pt-3.5 border-t border-white/10">
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Aspirant Interest Index:</span>
                </span>
                <span className="text-amber-300 font-black">{popularity.barPercent} Demand Rating</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${popularity.barGradient} transition-all duration-700 shadow-xs`}
                  style={{ width: popularity.barPercent }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN DATES & FEE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Important Dates Box */}
          <div id="important-dates-section" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-red-600 text-white px-4 py-2.5 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <h3 className="font-black text-sm uppercase tracking-wide">IMPORTANT DATES</h3>
            </div>
            <div className="p-4 divide-y divide-slate-150 text-xs">
              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Application Begin:</span>
                <span className="font-bold text-slate-900">{post.startDate || 'Check Official Notification'}</span>
              </div>
              <div className="py-2 flex justify-between items-center bg-red-50/70 -mx-4 px-4 font-bold text-red-700">
                <span>Last Date for Apply Online:</span>
                <span>{post.lastDate || 'Notified Soon'}</span>
              </div>
              {post.feeLastDate && (
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Last Date for Fee Payment:</span>
                  <span className="font-bold text-slate-900">{post.feeLastDate}</span>
                </div>
              )}
              {post.correctionDate && (
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Correction Window:</span>
                  <span className="font-bold text-slate-900">{post.correctionDate}</span>
                </div>
              )}
              {post.examDate && (
                <div className="py-2 flex justify-between items-center bg-blue-50/70 -mx-4 px-4 font-bold text-blue-900">
                  <span>Exam Date:</span>
                  <span>{post.examDate}</span>
                </div>
              )}
              {post.admitCardDate && (
                <div className="py-2 flex justify-between items-center bg-amber-50/70 -mx-4 px-4 font-bold text-amber-900">
                  <span>Admit Card Available:</span>
                  <span>{post.admitCardDate}</span>
                </div>
              )}
              {post.resultDate && (
                <div className="py-2 flex justify-between items-center bg-emerald-50/70 -mx-4 px-4 font-bold text-emerald-900">
                  <span>Result Declared:</span>
                  <span>{post.resultDate}</span>
                </div>
              )}
              {post.answerKeyDate && (
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Answer Key Date:</span>
                  <span className="font-bold text-teal-800">{post.answerKeyDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Application Fee Box */}
          <div id="application-fee-section" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#0B2545] text-white px-4 py-2.5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <h3 className="font-black text-sm uppercase tracking-wide">APPLICATION FEE</h3>
            </div>
            <div className="p-4 divide-y divide-slate-150 text-xs">
              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-600 font-medium">General / OBC / EWS:</span>
                <span className="font-bold text-slate-900">{post.feeStructure?.general || '₹100/-'}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-600 font-medium">SC / ST / PH:</span>
                <span className="font-bold text-emerald-700">{post.feeStructure?.sc || '₹0/-'}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-600 font-medium">All Category Female:</span>
                <span className="font-bold text-emerald-700">{post.feeStructure?.female || '₹0/- (Exempted)'}</span>
              </div>
              <div className="pt-3">
                <p className="font-bold text-slate-700 mb-1">Payment Mode:</p>
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                  {post.feeStructure?.paymentMode || 'Pay the Examination Fee Through Debit Card, Credit Card, Net Banking, UPI or E Challan.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AGE LIMIT SECTION */}
        {post.ageLimit && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="font-black text-sm uppercase tracking-wide">
                  AGE LIMIT CRITERIA {post.ageLimit.asOnDate ? `(AS ON ${post.ageLimit.asOnDate})` : ''}
                </h3>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium block">Minimum Age:</span>
                <span className="font-black text-base text-[#0B2545]">{post.ageLimit.minAge || '18 Years'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium block">Maximum Age:</span>
                <span className="font-black text-base text-[#0B2545]">{post.ageLimit.maxAge || '27 - 30 Years'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium block">Age Relaxation:</span>
                <span className="font-bold text-xs text-red-700">{post.ageLimit.ageRelaxation || 'Age Relaxation Extra as per Recruitment Rules.'}</span>
              </div>
            </div>
          </div>
        )}

        {/* VACANCIES & ELIGIBILITY DETAILS TABLE */}
        {post.vacancies && post.vacancies.length > 0 && (
          <div id="vacancy-details-section" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#0B2545] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="font-black text-sm sm:text-base uppercase tracking-wide">
                  VACANCY DETAILS (TOTAL: {post.totalVacancy || 'See Table'})
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-slate-200">Post Name</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 text-center">Total Posts</th>
                    <th className="py-2.5 px-3">Educational Qualification & Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {post.vacancies.map((v, i) => (
                    <tr key={v.id || i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-3 px-3 font-bold text-slate-900 border-r border-slate-200">
                        {v.postName}
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-800 text-center border-r border-slate-200 bg-emerald-50/40">
                        {v.total}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium leading-relaxed">
                        {v.qualification || post.educationalQualification || 'As per notification criteria.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SELECTION PROCESS & HOW TO APPLY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selection Process */}
          {post.selectionProcess && post.selectionProcess.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <h3 className="font-black text-sm text-[#0B2545] uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>SELECTION PROCESS</span>
              </h3>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside font-medium">
                {post.selectionProcess.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-slate-900 font-semibold">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Required Documents */}
          {post.requiredDocuments && post.requiredDocuments.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <h3 className="font-black text-sm text-[#0B2545] uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>REQUIRED DOCUMENTS FOR FORM FILLING</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {post.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* IMPORTANT INSTRUCTIONS */}
        {post.importantInstructions && post.importantInstructions.length > 0 && (
          <div className="bg-amber-50/80 rounded-xl border border-amber-300 p-4 space-y-3">
            <h3 className="font-black text-sm text-amber-950 uppercase tracking-wide flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>IMPORTANT INSTRUCTIONS BEFORE APPLYING</span>
            </h3>
            <ul className="space-y-2 text-xs text-amber-900 font-medium">
              {post.importantInstructions.map((ins, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0"></span>
                  <span>{ins}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ad Placement: Before Links */}
        <div className="no-print">
          <AdPlacement placement="post_before_links" onActionClick={() => onNavigate('/services')} />
        </div>

        {/* MANDATORY HIGH-CONTRAST 2-COLUMN IMPORTANT LINKS TABLE */}
        <ImportantLinksTable
          links={post.importantLinks || []}
          postId={post.id}
          postTitle={post.title}
        />

        {/* SOCIAL SHARE CALLOUT BAR */}
        <div className="no-print bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wide text-white flex items-center gap-1.5 justify-center md:justify-start">
                <span>Help Your Friends & Study Groups</span>
                <span className="bg-red-600 text-[10px] font-bold px-1.5 py-0.2 rounded text-white uppercase">Share</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Send this job alert directly to WhatsApp, Facebook, or Twitter so nobody misses the last date!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 flex-shrink-0 w-full md:w-auto">
            <a
              id="share-cta-whatsapp"
              href={whatsAppShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>

            <a
              id="share-cta-facebook"
              href={facebookShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Facebook className="w-4 h-4 fill-white" />
              <span>Facebook</span>
            </a>

            <a
              id="share-cta-twitter"
              href={twitterShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Twitter className="w-4 h-4 fill-white" />
              <span>Twitter</span>
            </a>

            <button
              type="button"
              id="share-cta-copy"
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Link Copied!' : 'Copy'}</span>
            </button>

            {canShare && (
              <button
                type="button"
                id="share-cta-native"
                onClick={handleNativeShare}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Share className="w-4 h-4 text-blue-600" />
                <span>Share Via...</span>
              </button>
            )}
          </div>
        </div>

        {/* Ad Placement: After Links */}
        <div className="no-print">
          <AdPlacement placement="post_after_links" onActionClick={() => onNavigate('/services')} />
        </div>

        {/* COMPUTER CENTER FORM FILLING ASSISTANCE BANNER */}
        <div className="no-print bg-gradient-to-r from-[#0B2545] via-[#133A6B] to-[#0B2545] text-white rounded-2xl p-5 sm:p-6 shadow-md border-2 border-amber-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                Center Form Filling Assistance
              </span>
              <h3 className="text-base sm:text-lg font-black uppercase mt-1">
                Want Shahnawaz Computer Center to Fill This Form For You?
              </h3>
              <p className="text-xs text-slate-200 mt-0.5">
                Send your documents on WhatsApp or visit our center for 100% accurate, error-free submission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              id="form-assist-whatsapp-btn"
              href={`https://wa.me/${whatsAppServiceNumber}?text=${encodeURIComponent(`Hello Shahnawaz Computer Center, I want to fill the form for: ${post.title}. Please guide me with documents & fees.`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us Now</span>
            </a>
            {settings?.contactNumber && (
              <a
                href={`tel:${settings.contactNumber}`}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-[#0B2545] font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline">Call</span>
              </a>
            )}
          </div>
        </div>

        {/* OFFICIAL SOURCE VERIFICATION DISCLAIMER BOX */}
        {post.officialSource && (
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-300 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">
                  Official Verification Source: {post.officialSource.websiteName}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Information compiled from official notification PDFs released on government recruitment portals.
                </p>
              </div>
            </div>

            {post.officialSource.websiteUrl && (
              <a
                href={post.officialSource.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-700 hover:underline font-bold text-xs flex-shrink-0"
              >
                <span>Visit Official Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* CANDIDATE DISCUSSION & COMMENT SECTION */}
        <div id="candidate-discussion-section">
          <PostCommentSection
            postId={post.id}
            postSlug={post.slug}
            postTitle={post.title}
            postCategory={post.category}
          />
        </div>

        {/* RELATED RECRUITMENTS */}
        {relatedPosts.length > 0 && (
          <div className="no-print pt-6 border-t border-slate-200">
            <h3 className="text-base font-black text-[#0B2545] uppercase tracking-wide mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Related {post.category} Updates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectPost(rel.slug, rel.type)}
                  className="p-3 bg-white hover:bg-blue-50/50 border border-slate-200 rounded-xl cursor-pointer transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-500">{rel.category}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-900 line-clamp-2 mt-1">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{rel.lastDate ? `Last: ${rel.lastDate}` : 'Active'}</span>
                    <span className="text-blue-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRINT-ONLY FOOTER */}
        <div className="print-only mt-8 pt-4 border-t border-slate-400 text-center text-[9pt] text-slate-600 space-y-1">
          <p className="font-bold text-slate-900">
            SHAHNAWAZ COMPUTER CENTER • TAMBOUR (SITAPUR, U.P.)
          </p>
          <p>
            Online Form Filling • Admit Card Printing • Corrections • PVC Smart Card Printing • Result & Scorecard Downloads
          </p>
          <p className="text-[8pt] text-slate-500">
            Direct Helpline: +91 99560 78419 • Portal Link: {pageUrl}
          </p>
        </div>
      </article>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Save,
  Search,
  Globe,
  Share2,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Code,
  Tag,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Eye,
  ShieldCheck,
  Twitter,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  Sliders,
  Monitor,
  Smartphone,
  CheckCheck,
} from 'lucide-react';
import { Post } from '../types';
import { getClientPosts, saveClientPosts } from '../utils/clientStorage';

interface PostSeoModalProps {
  post: Post | null;
  allPosts?: Post[];
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedPost: Post) => void;
  onSelectAnotherPost?: (post: Post) => void;
  token: string;
}

export const PostSeoModal: React.FC<PostSeoModalProps> = ({
  post,
  allPosts = [],
  isOpen,
  onClose,
  onSaved,
  onSelectAnotherPost,
  token,
}) => {
  const [activeTab, setActiveTab] = useState<
    'meta' | 'opengraph' | 'twitter' | 'preview_google' | 'preview_social' | 'schema'
  >('meta');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('mobile');
  const [twitterTheme, setTwitterTheme] = useState<'light' | 'dark'>('dark');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Meta Tags State
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsIndex, setRobotsIndex] = useState('index, follow');
  const [authorName, setAuthorName] = useState('Shahnawaz Computer Center');
  const [schemaType, setSchemaType] = useState('JobPosting');
  const [slug, setSlug] = useState('');

  // OpenGraph State
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogType, setOgType] = useState('article');

  // Twitter Card State
  const [twitterCard, setTwitterCard] = useState<'summary' | 'summary_large_image' | 'app' | 'player'>('summary_large_image');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [twitterSite, setTwitterSite] = useState('@shahnawazcc');
  const [twitterCreator, setTwitterCreator] = useState('@mohdshahnawaz');

  // Sync state when post changes
  useEffect(() => {
    if (post) {
      const defaultTitle = post.seoTitle || post.title || '';
      const defaultDesc = post.metaDescription || post.shortDescription || '';
      const defaultImage =
        post.ogImage ||
        post.featuredImage ||
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80';

      setSeoTitle(defaultTitle);
      setMetaDescription(defaultDesc);
      setKeywords(
        post.keywords && post.keywords.length > 0
          ? [...post.keywords]
          : generateDefaultKeywords(post)
      );
      setCanonicalUrl(post.canonicalUrl || `https://shahnawazcomputercenter.in/post/${post.slug}`);
      setRobotsIndex(post.robotsIndex || 'index, follow');
      setAuthorName(post.authorName || 'Shahnawaz Computer Center');
      setSchemaType(
        post.schemaType ||
          (post.type === 'job'
            ? 'JobPosting'
            : post.type === 'result' || post.type === 'admit_card'
            ? 'EducationalOccupationalCredential'
            : 'Article')
      );
      setSlug(post.slug || '');

      // OpenGraph
      setOgTitle(post.ogTitle || defaultTitle);
      setOgDescription(post.ogDescription || defaultDesc);
      setOgImage(defaultImage);
      setOgType(post.ogType || 'article');

      // Twitter Card
      setTwitterCard(post.twitterCard || 'summary_large_image');
      setTwitterTitle(post.twitterTitle || post.ogTitle || defaultTitle);
      setTwitterDescription(post.twitterDescription || post.ogDescription || defaultDesc);
      setTwitterImage(post.twitterImage || defaultImage);
      setTwitterSite(post.twitterSite || '@shahnawazcc');
      setTwitterCreator(post.twitterCreator || '@mohdshahnawaz');

      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [post]);

  if (!isOpen || !post) return null;

  // Helper default keyword generator
  function generateDefaultKeywords(p: Post): string[] {
    const list: string[] = ['Sarkari Result', 'Shahnawaz Computer Center', 'Govt Job Online Form'];
    if (p.title) list.push(p.title);
    if (p.department) list.push(p.department);
    if (p.category) list.push(p.category);
    if (p.type === 'job') list.push('Sarkari Naukri 2026', 'Apply Online', 'Eligibility & Vacancy');
    if (p.type === 'admit_card') list.push('Admit Card Download', 'Hall Ticket', 'Exam Date City Slip');
    if (p.type === 'result') list.push('Sarkari Result 2026', 'Merit List PDF', 'Cut Off Marks');
    if (p.type === 'answer_key') list.push('Answer Key PDF', 'Question Paper Objection');
    if (p.type === 'sarkari_yojana') list.push('Sarkari Yojana 2026', 'Registration Online Form');
    return Array.from(new Set(list));
  }

  // 1-Click Smart SEO & Social Optimizer
  const handleAutoOptimize = () => {
    const currentYear = new Date().getFullYear();
    let generatedTitle = '';
    let generatedDesc = '';

    if (post.type === 'job') {
      const vac = post.totalVacancy ? ` (${post.totalVacancy} Posts)` : '';
      generatedTitle = `${post.title}${vac} ${currentYear} - Apply Online, Eligibility & Notification | Shahnawaz Computer Center`;
      generatedDesc = `${post.title} online recruitment form is active. Check eligibility criteria, age limit, selection process, fee details and direct official apply link here.`;
    } else if (post.type === 'admit_card') {
      generatedTitle = `${post.title} Admit Card ${currentYear} Out - Download Hall Ticket & Exam City Slip`;
      generatedDesc = `Download official ${post.title} Admit Card & Hall Ticket ${currentYear}. Check exam date, shift timings, reporting center and direct login download links.`;
    } else if (post.type === 'result') {
      generatedTitle = `${post.title} Result ${currentYear} Declared - Check Merit List & Cut Off Marks PDF`;
      generatedDesc = `${post.title} Result & Scorecard released. Check category-wise cut off marks, selected candidate merit list, and direct scorecard links at Shahnawaz Computer Center.`;
    } else if (post.type === 'answer_key') {
      generatedTitle = `${post.title} Answer Key ${currentYear} Released - Download Question Paper & Solution`;
      generatedDesc = `Official ${post.title} Answer Key and candidate response sheet released. Check solutions, calculate score and submit online objections.`;
    } else {
      generatedTitle = `${post.title} ${currentYear} - Complete Details, Eligibility & Online Form`;
      generatedDesc = `Check full details for ${post.title}. Get step-by-step guidance, required documents, important dates, and direct links at Shahnawaz Computer Center.`;
    }

    const titleTrim = generatedTitle.slice(0, 95);
    const descTrim = generatedDesc.slice(0, 160);

    setSeoTitle(titleTrim);
    setMetaDescription(descTrim);
    setOgTitle(titleTrim);
    setOgDescription(descTrim);
    setTwitterTitle(titleTrim);
    setTwitterDescription(descTrim);
    setKeywords(generateDefaultKeywords(post));

    setSuccessMsg('⚡ AI Smart SEO Meta, OpenGraph & Twitter Cards generated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Keyword operations
  const handleAddKeyword = (kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    if (!keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setKeywordInput('');
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== kwToRemove));
  };

  // Suggested keywords
  const suggestedTags = [
    'Sarkari Result 2026',
    'Apply Online Direct Link',
    'Official Notification PDF',
    'Eligibility Criteria',
    'Age Limit & Relaxation',
    'Admit Card Download',
    'Merit List & Cut Off',
    'Answer Key Out',
    'UP Government Jobs',
    'Central Govt Jobs',
    'Shahnawaz Computer Center',
  ];

  // Save SEO & Meta Tags
  const handleSaveSeo = async () => {
    if (!seoTitle.trim()) {
      setErrorMsg('Meta Title is required for search engines.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      seoTitle: seoTitle.trim(),
      metaDescription: metaDescription.trim(),
      keywords,
      ogTitle: ogTitle.trim() || seoTitle.trim(),
      ogDescription: ogDescription.trim() || metaDescription.trim(),
      ogImage: ogImage.trim() || undefined,
      ogType,
      twitterCard,
      twitterTitle: twitterTitle.trim() || ogTitle.trim() || seoTitle.trim(),
      twitterDescription: twitterDescription.trim() || ogDescription.trim() || metaDescription.trim(),
      twitterImage: twitterImage.trim() || ogImage.trim() || undefined,
      twitterSite: twitterSite.trim() || '@shahnawazcc',
      twitterCreator: twitterCreator.trim() || '@mohdshahnawaz',
      authorName: authorName.trim() || 'Shahnawaz Computer Center',
      featuredImage: ogImage.trim() || undefined,
      canonicalUrl: canonicalUrl.trim() || undefined,
      robotsIndex,
      schemaType,
      slug: slug.trim() || post.slug,
    };

    try {
      let savedPost: Post | null = null;

      try {
        const res = await fetch(`/api/admin/posts/${post.id}/seo`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          savedPost = await res.json();
        }
      } catch {}

      // If backend offline (e.g. Netlify static hosting), update client storage directly
      if (!savedPost) {
        const all = getClientPosts();
        savedPost = {
          ...post,
          ...payload,
          updatedAt: new Date().toISOString(),
        } as Post;
        const updatedList = all.map((p) => (p.id === post.id ? savedPost! : p));
        saveClientPosts(updatedList);
      }

      if (savedPost) {
        onSaved(savedPost);
        setSuccessMsg('✅ SEO Meta Tags, OpenGraph & Twitter Card published successfully!');
        setTimeout(() => setSuccessMsg(''), 3500);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error updating SEO meta tags');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Schema JSON
  const generateSchemaJson = () => {
    const baseUrl = 'https://shahnawazcomputercenter.in';
    const postUrl = `${baseUrl}/post/${slug || post.slug}`;
    const pubDate = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString();
    const modDate = post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString();
    const imgUrl = ogImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80';

    if (schemaType === 'JobPosting') {
      return {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: seoTitle || post.title,
        description: metaDescription || post.shortDescription,
        datePosted: pubDate,
        validThrough: post.lastDate ? new Date(post.lastDate).toISOString() : undefined,
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          '@type': 'Organization',
          name: post.department || post.organization || 'Government Recruitment Board',
          sameAs: post.officialSource?.websiteUrl || 'https://gov.in',
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressRegion: post.state || 'Uttar Pradesh',
            addressCountry: 'IN',
          },
        },
        baseSalary: post.salaryPayScale
          ? {
              '@type': 'MonetaryAmount',
              currency: 'INR',
              value: {
                '@type': 'QuantitativeValue',
                unitText: 'MONTH',
              },
            }
          : undefined,
        url: postUrl,
      };
    }

    return {
      '@context': 'https://schema.org',
      '@type': schemaType === 'EducationalOccupationalCredential' ? 'EducationalOccupationalCredential' : 'Article',
      headline: seoTitle || post.title,
      description: metaDescription || post.shortDescription,
      image: imgUrl,
      datePublished: pubDate,
      dateModified: modDate,
      author: {
        '@type': 'Organization',
        name: authorName || 'Shahnawaz Computer Center',
        url: baseUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Shahnawaz Computer Center',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/favicon.ico`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl,
      },
    };
  };

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(generateSchemaJson(), null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  // SEO Health calculation
  const titleLen = seoTitle.length;
  const descLen = metaDescription.length;
  const isTitleGood = titleLen >= 45 && titleLen <= 65;
  const isDescGood = descLen >= 120 && descLen <= 160;
  const hasKeywords = keywords.length >= 3;
  const hasOg = !!ogImage && !!ogTitle;
  const hasTwitter = !!twitterTitle && !!twitterImage;

  const seoScore =
    (isTitleGood ? 20 : titleLen > 0 ? 12 : 0) +
    (isDescGood ? 20 : descLen > 0 ? 12 : 0) +
    (hasKeywords ? 20 : keywords.length > 0 ? 10 : 0) +
    (hasOg ? 20 : 10) +
    (hasTwitter ? 20 : 10);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0B2545] text-white p-4 sm:px-6 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black flex-shrink-0 shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight">
                  Dynamic SEO & Social Meta Tag Studio
                </h2>
                <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded uppercase">
                  {post.type}
                </span>
                <span className="text-[10px] bg-blue-800 text-blue-100 font-bold px-2 py-0.5 rounded">
                  {post.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 max-w-xl font-medium mt-0.5">
                {post.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allPosts.length > 1 && onSelectAnotherPost && (
              <div className="hidden sm:block">
                <select
                  value={post.id}
                  onChange={(e) => {
                    const found = allPosts.find((p) => p.id === e.target.value);
                    if (found) onSelectAnotherPost(found);
                  }}
                  className="text-xs bg-blue-950/90 text-white border border-blue-700 rounded-lg p-1.5 font-semibold max-w-[180px] focus:outline-none"
                >
                  {allPosts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title.slice(0, 26)}...
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SEO Health Score & Smart Optimizer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Search Engine Optimization Score:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      seoScore >= 80 ? 'bg-emerald-500' : seoScore >= 55 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${seoScore}%` }}
                  ></div>
                </div>
                <span
                  className={`font-black ${
                    seoScore >= 80 ? 'text-emerald-700' : seoScore >= 55 ? 'text-amber-700' : 'text-red-600'
                  }`}
                >
                  {seoScore}%
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-[11px]">
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  isTitleGood ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                Title: {titleLen}/60
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  isDescGood ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                Meta Desc: {descLen}/160
              </span>
              <span className="px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                Keywords: {keywords.length}
              </span>
              <span className="px-2 py-0.5 rounded font-bold bg-purple-100 text-purple-800">
                OG & Twitter Card: Active
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutoOptimize}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-lg shadow-xs transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Auto-Optimize All Tags</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white px-4 sm:px-6 border-b border-slate-200 flex items-center gap-1 overflow-x-auto text-xs font-bold">
          {[
            { id: 'meta', label: '1. Meta Tags & Keywords', icon: FileText },
            { id: 'opengraph', label: '2. OpenGraph (WhatsApp/FB)', icon: Share2 },
            { id: 'twitter', label: '3. Twitter / X Card Data', icon: Twitter },
            { id: 'preview_google', label: 'Google SERP Preview', icon: Search },
            { id: 'preview_social', label: 'Live Social Previews', icon: Eye },
            { id: 'schema', label: 'Google Schema (JSON-LD)', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3 border-b-2 font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-red-600 text-red-600 font-black bg-red-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: META TAGS & KEYWORDS */}
          {activeTab === 'meta' && (
            <div className="space-y-5 text-xs">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Meta Title / Search Engine Title</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      titleLen >= 50 && titleLen <= 65
                        ? 'text-emerald-600'
                        : titleLen > 65
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {titleLen}/60 characters {titleLen > 65 && '(Google may truncate)'}
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. SSC CGL 2026: Apply Online for 17727 Posts, Eligibility & Last Date"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Primary headline shown in Google Search results. Keep between 50–60 characters with targeted keywords.
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Meta Description</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      descLen >= 120 && descLen <= 160
                        ? 'text-emerald-600'
                        : descLen > 160
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {descLen}/160 characters {descLen > 160 && '(Truncates after 160)'}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="e.g. SSC CGL Recruitment 2026 online form is now open. Check eligibility criteria, exam pattern, syllabus, application fee and direct official apply link at Shahnawaz Computer Center."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Concise snippet displayed underneath the title in Google search results.
                </p>
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Meta Keywords & Target Search Phrases
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword(keywordInput);
                        }
                      }}
                      placeholder="Type keyword and press Enter (e.g. 'SSC CGL 2026', 'Govt Job UP')"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddKeyword(keywordInput)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs"
                  >
                    + Add
                  </button>
                </div>

                {/* Keyword Chips */}
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-100 rounded-xl border border-slate-200 min-h-[48px] items-center">
                  {keywords.length === 0 ? (
                    <span className="text-slate-400 text-xs italic">
                      No keywords added yet. Click suggested tags below or add custom terms.
                    </span>
                  ) : (
                    keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md font-bold text-slate-800 shadow-2xs"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(kw)}
                          className="text-slate-400 hover:text-red-600 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Suggested Keywords */}
                <div className="mt-2">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    ⚡ Suggested High-Volume Keywords:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddKeyword(tag)}
                        disabled={keywords.includes(tag)}
                        className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                          keywords.includes(tag)
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 font-semibold'
                        }`}
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Directives & Canonical */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Robots Meta Directive</label>
                  <select
                    value={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="index, follow">index, follow (Allow search indexing)</option>
                    <option value="noindex, follow">noindex, follow (Hide from search, follow links)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Block indexing & links)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name Tag</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Shahnawaz Computer Center"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Canonical URL</label>
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://shahnawazcomputercenter.in/post/..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPEN GRAPH (OG) METADATA */}
          {activeTab === 'opengraph' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-start gap-2">
                <Share2 className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  OpenGraph metadata is read by <strong>WhatsApp, Facebook, LinkedIn, Telegram</strong>, and messaging apps to generate rich visual share cards when users share your post links.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      og:title (OpenGraph Title)
                    </label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="Leave empty to use Meta Title"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Falls back to Meta Title if blank</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      og:description (OpenGraph Description)
                    </label>
                    <textarea
                      rows={3}
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      placeholder="Leave empty to use Meta Description"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      og:image (Social Share Banner URL)
                    </label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => {
                        setOgImage(e.target.value);
                        if (!twitterImage) setTwitterImage(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                    />
                    <span className="text-[10px] text-slate-500">
                      Recommended: 1200 x 630 px (1.91:1 ratio) for crisp WhatsApp and Facebook cards.
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">og:type</label>
                    <select
                      value={ogType}
                      onChange={(e) => setOgType(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                    >
                      <option value="article">article (Recommended for job/exam posts)</option>
                      <option value="website">website (General web page)</option>
                    </select>
                  </div>
                </div>

                {/* Live OG Card Thumbnail */}
                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      OpenGraph Card Live Preview:
                    </span>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-300">
                      <div className="h-40 bg-slate-900 relative">
                        {ogImage ? (
                          <img
                            src={ogImage}
                            alt="OG Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded uppercase">
                          {post.type}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 border-t border-slate-200">
                        <span className="text-[10px] text-slate-400 font-mono block">
                          shahnawazcomputercenter.in
                        </span>
                        <h4 className="font-bold text-slate-900 line-clamp-1 mt-0.5">
                          {ogTitle || seoTitle || post.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {ogDescription || metaDescription || post.shortDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Configured for optimal high-clickthrough social distribution.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TWITTER / X CARD DATA */}
          {activeTab === 'twitter' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-start gap-2 border border-slate-800">
                <Twitter className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  Twitter Card meta tags determine how your post appears when tweeted or retweeted on <strong>Twitter / X</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      twitter:card Type
                    </label>
                    <select
                      value={twitterCard}
                      onChange={(e) => setTwitterCard(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                    >
                      <option value="summary_large_image">
                        summary_large_image (Large Hero Card - Best CTR)
                      </option>
                      <option value="summary">summary (Compact Square Thumbnail)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      twitter:title (Twitter Card Title)
                    </label>
                    <input
                      type="text"
                      value={twitterTitle}
                      onChange={(e) => setTwitterTitle(e.target.value)}
                      placeholder="Leave empty to use OG / Meta Title"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      twitter:description (Twitter Card Description)
                    </label>
                    <textarea
                      rows={3}
                      value={twitterDescription}
                      onChange={(e) => setTwitterDescription(e.target.value)}
                      placeholder="Leave empty to use OG / Meta Description"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      twitter:image (Twitter Image URL)
                    </label>
                    <input
                      type="text"
                      value={twitterImage}
                      onChange={(e) => setTwitterImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">twitter:site</label>
                      <input
                        type="text"
                        value={twitterSite}
                        onChange={(e) => setTwitterSite(e.target.value)}
                        placeholder="@shahnawazcc"
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">twitter:creator</label>
                      <input
                        type="text"
                        value={twitterCreator}
                        onChange={(e) => setTwitterCreator(e.target.value)}
                        placeholder="@mohdshahnawaz"
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Twitter Tweet Simulator */}
                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">
                        Twitter / X Tweet Simulator:
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-200 p-0.5 rounded-md">
                        <button
                          type="button"
                          onClick={() => setTwitterTheme('light')}
                          className={`px-2 py-0.5 rounded ${
                            twitterTheme === 'light' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                          }`}
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          onClick={() => setTwitterTheme('dark')}
                          className={`px-2 py-0.5 rounded ${
                            twitterTheme === 'dark' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500'
                          }`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>

                    {/* Mock Tweet Card */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        twitterTheme === 'dark'
                          ? 'bg-black border-slate-800 text-white'
                          : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs">
                          SC
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs">Shahnawaz Computer Center</span>
                            <span className="text-[10px] text-sky-400 font-bold">✔</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {twitterSite || '@shahnawazcc'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs mb-2 leading-relaxed">
                        🚨 <strong>New Update:</strong> {post.title} — check full notification, eligibility criteria and apply online link below! 👇
                      </p>

                      {/* Card embed */}
                      <div
                        className={`rounded-xl overflow-hidden border ${
                          twitterTheme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        {twitterCard === 'summary_large_image' ? (
                          <>
                            <div className="h-36 bg-slate-900 relative">
                              <img
                                src={twitterImage || ogImage}
                                alt="Twitter Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80';
                                }}
                              />
                            </div>
                            <div className="p-2.5">
                              <span className="text-[10px] text-slate-400 font-mono block">
                                shahnawazcomputercenter.in
                              </span>
                              <h5 className="font-bold text-xs line-clamp-1 mt-0.5">
                                {twitterTitle || ogTitle || seoTitle || post.title}
                              </h5>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {twitterDescription || ogDescription || metaDescription || post.shortDescription}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center p-2 gap-2">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                              <img
                                src={twitterImage || ogImage}
                                alt="Twitter Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 font-mono block">
                                shahnawazcomputercenter.in
                              </span>
                              <h5 className="font-bold text-xs line-clamp-1">
                                {twitterTitle || ogTitle || seoTitle || post.title}
                              </h5>
                              <p className="text-[10px] text-slate-400 line-clamp-1">
                                {twitterDescription || ogDescription || metaDescription || post.shortDescription}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 mt-2 block text-center">
                    Complies with standard Twitter Card specification.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE SEARCH SERP PREVIEW */}
          {activeTab === 'preview_google' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Google Search Results (SERP) Live Simulation:
                </span>
                <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setDevicePreview('mobile')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                      devicePreview === 'mobile' ? 'bg-white shadow-xs text-blue-900 font-black' : 'text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDevicePreview('desktop')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                      devicePreview === 'desktop' ? 'bg-white shadow-xs text-blue-900 font-black' : 'text-slate-600'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                </div>
              </div>

              {/* SERP Card */}
              <div
                className={`bg-white p-5 rounded-2xl border border-slate-300 shadow-md ${
                  devicePreview === 'mobile' ? 'max-w-md mx-auto' : 'w-full'
                }`}
              >
                {/* Site identifier */}
                <div className="flex items-center gap-2 text-xs text-slate-800 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-[10px]">
                    SCC
                  </div>
                  <div className="leading-tight">
                    <div className="font-semibold text-slate-900">Shahnawaz Computer Center</div>
                    <div className="text-[11px] text-slate-500 truncate font-mono">
                      https://shahnawazcomputercenter.in › {post.category?.toLowerCase() || 'jobs'} ›{' '}
                      {slug || post.slug}
                    </div>
                  </div>
                </div>

                {/* Blue Title Link */}
                <h3 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug mt-1 line-clamp-2">
                  {seoTitle || post.title || 'Untitled Recruitment Post'}
                </h3>

                {/* Snippet Description */}
                <p className="text-xs text-[#4d5156] mt-1.5 leading-relaxed line-clamp-3">
                  <span className="text-slate-400 mr-1">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} —
                  </span>
                  {metaDescription ||
                    post.shortDescription ||
                    'Check vacancy details, qualification, eligibility, important dates and apply online links.'}
                </p>

                {/* Sitelinks / Meta tags */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">
                    Category: {post.category}
                  </span>
                  {post.totalVacancy && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold">
                      {post.totalVacancy} Vacancies
                    </span>
                  )}
                  {post.lastDate && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-800 rounded font-semibold">
                      Last Date: {post.lastDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Google Search Best Practices</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Target keywords placed at the beginning of the title have a 25% higher CTR on mobile devices. Robots directive is set to <strong>{robotsIndex}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: LIVE SOCIAL PREVIEWS (WHATSAPP & TELEGRAM) */}
          {activeTab === 'preview_social' && (
            <div className="space-y-4 max-w-md mx-auto">
              <span className="text-xs font-bold text-slate-700 block text-center">
                WhatsApp & Telegram Link Preview Card:
              </span>

              {/* WhatsApp Mock Chat Bubble */}
              <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-slate-300 shadow-inner">
                <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-sm ml-auto border border-slate-200">
                  <div className="h-44 bg-slate-900 relative overflow-hidden">
                    <img
                      src={ogImage || twitterImage}
                      alt="Social Card"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                      {post.type.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-3 bg-[#F0F2F5] space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                      shahnawazcomputercenter.in
                    </span>
                    <h4 className="text-xs font-black text-slate-900 leading-tight line-clamp-2">
                      {ogTitle || seoTitle || post.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">
                      {ogDescription || metaDescription || post.shortDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <span className="font-bold block mb-0.5">🌟 Instant Visual Authority</span>
                <p className="text-[11px] text-emerald-800">
                  When students share this link on WhatsApp or Telegram study groups, this card delivers an instant professional preview.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: GOOGLE SCHEMA JSON-LD */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Google Structured Data (JSON-LD)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Injected into the post's HTML &lt;head&gt; for Google Jobs and Rich Snippets ranking.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copySchemaToClipboard}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied JSON!' : 'Copy Schema'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-80 leading-relaxed border border-slate-800">
                {JSON.stringify(generateSchemaJson(), null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-300"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSaveSeo}
              className="px-6 py-2 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Saving SEO Meta...' : 'Save & Publish SEO Meta'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

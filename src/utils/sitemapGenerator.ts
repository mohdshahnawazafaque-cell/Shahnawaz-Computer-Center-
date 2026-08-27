import { Post, Category } from '../types';

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  image?: {
    loc: string;
    title?: string;
    caption?: string;
  };
  news?: {
    publicationName: string;
    publicationLanguage: string;
    publicationDate: string;
    title: string;
  };
}

export interface SitemapGenerationMetrics {
  totalUrls: number;
  jobsCount: number;
  admitCardsCount: number;
  resultsCount: number;
  schemesCount: number;
  otherPostsCount: number;
  categoriesCount: number;
  statePagesCount: number;
  staticPagesCount: number;
  imagesIndexedCount: number;
  newsIndexedCount: number;
  fileSizeBytes: number;
  generatedAt: string;
}

export interface GenerateSitemapOptions {
  baseUrl?: string;
  siteName?: string;
  includeImages?: boolean;
  includeGoogleNews?: boolean;
  defaultPriority?: number;
}

/**
 * Escapes characters for strict XML compliance.
 */
export function escapeXml(unsafe?: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats date into ISO 8601 / W3C format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ).
 */
export function formatDateToW3C(dateInput?: string | number | Date): string {
  if (!dateInput) {
    return new Date().toISOString().split('T')[0];
  }
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Crawls available database posts, active categories, and static pages
 * to compile a comprehensive list of URL entries for search engine indexers.
 */
export function crawlDatabaseToSitemapEntries(
  posts: Post[],
  categories: Category[] = [],
  options: GenerateSitemapOptions = {}
): { entries: SitemapUrlEntry[]; metrics: SitemapGenerationMetrics } {
  const defaultOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://shahnawazcomputercenter.in';
  const siteUrl = (options.baseUrl || defaultOrigin).replace(/\/+$/, '');
  const siteName = options.siteName || 'Shahnawaz Computer Center';
  const includeImages = options.includeImages !== false;
  const includeGoogleNews = options.includeGoogleNews !== false;

  const entries: SitemapUrlEntry[] = [];
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  let jobsCount = 0;
  let admitCardsCount = 0;
  let resultsCount = 0;
  let schemesCount = 0;
  let otherPostsCount = 0;
  let imagesIndexedCount = 0;
  let newsIndexedCount = 0;

  // 1. Homepage (Highest priority)
  entries.push({
    loc: `${siteUrl}/`,
    lastmod: formatDateToW3C(now),
    changefreq: 'hourly',
    priority: 1.0,
  });

  // 2. Core feeds & hubs
  entries.push({
    loc: `${siteUrl}/rss.xml`,
    lastmod: formatDateToW3C(now),
    changefreq: 'hourly',
    priority: 0.95,
  });

  // 3. Category Landing Pages
  const enabledCategories = categories.filter((c) => c.enabled !== false);
  for (const cat of enabledCategories) {
    entries.push({
      loc: `${siteUrl}/category/${cat.slug}`,
      lastmod: formatDateToW3C(now),
      changefreq: 'daily',
      priority: 0.9,
    });
  }

  // 4. Static Services, Utility, and Legal Pages
  const staticRoutes: { path: string; priority: number; changefreq: SitemapUrlEntry['changefreq'] }[] = [
    { path: '/services', priority: 0.85, changefreq: 'weekly' },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' },
    { path: '/about', priority: 0.75, changefreq: 'monthly' },
    { path: '/faq', priority: 0.7, changefreq: 'monthly' },
    { path: '/privacy-policy', priority: 0.5, changefreq: 'monthly' },
    { path: '/terms', priority: 0.5, changefreq: 'monthly' },
  ];

  for (const route of staticRoutes) {
    entries.push({
      loc: `${siteUrl}${route.path}`,
      lastmod: formatDateToW3C(now),
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  // 5. Crawl all published & active posts
  const publishedPosts = posts.filter(
    (p) => p.status === 'published' || p.status === 'featured' || p.status === 'pinned' || !p.status
  );

  const seenStates = new Set<string>();

  for (const post of publishedPosts) {
    // Record distinct states for state-specific landing pages
    if (post.state && post.state !== 'All India' && post.state.trim().length > 0) {
      seenStates.add(post.state.trim());
    }

    // Determine path prefix & base priority
    let pathPrefix = 'post';
    let typePriority = 0.85;
    let changeFreq: SitemapUrlEntry['changefreq'] = 'daily';

    switch (post.type) {
      case 'job':
        pathPrefix = 'jobs';
        jobsCount++;
        typePriority = 0.9;
        break;
      case 'admit_card':
        pathPrefix = 'admit-card';
        admitCardsCount++;
        typePriority = 0.9;
        break;
      case 'result':
        pathPrefix = 'result';
        resultsCount++;
        typePriority = 0.9;
        break;
      case 'sarkari_yojana':
        pathPrefix = 'sarkari-yojana';
        schemesCount++;
        typePriority = 0.85;
        break;
      default:
        pathPrefix = 'post';
        otherPostsCount++;
        typePriority = 0.8;
        break;
    }

    // Priority and frequency boosters
    const postCreatedAt = new Date(post.createdAt || now);
    const postUpdatedAt = new Date(post.updatedAt || post.createdAt || now);
    const lastModDate = formatDateToW3C(post.updatedAt || post.createdAt);

    if (post.isPinned || post.isFeatured) {
      typePriority = Math.min(0.95, typePriority + 0.05);
      changeFreq = 'hourly';
    } else if (postUpdatedAt >= threeDaysAgo) {
      typePriority = Math.min(0.9, typePriority + 0.05);
      changeFreq = 'hourly';
    } else {
      changeFreq = 'weekly';
    }

    // Google Images tag inclusion
    let imageEntry: SitemapUrlEntry['image'] | undefined;
    const imgUrl = post.featuredImage || post.ogImage;
    if (includeImages && imgUrl && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('/'))) {
      const fullImgUrl = imgUrl.startsWith('http')
        ? imgUrl
        : `${siteUrl}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
      imageEntry = {
        loc: fullImgUrl,
        title: post.title,
        caption: post.shortDescription || post.title,
      };
      imagesIndexedCount++;
    }

    // Google News tag inclusion (for updates within 48h)
    let newsEntry: SitemapUrlEntry['news'] | undefined;
    if (includeGoogleNews && postCreatedAt >= fortyEightHoursAgo) {
      newsEntry = {
        publicationName: siteName,
        publicationLanguage: 'hi',
        publicationDate: postCreatedAt.toISOString(),
        title: post.title,
      };
      newsIndexedCount++;
    }

    entries.push({
      loc: `${siteUrl}/post/${post.slug || post.id}`,
      lastmod: lastModDate,
      changefreq: changeFreq,
      priority: Number(typePriority.toFixed(2)),
      image: imageEntry,
      news: newsEntry,
    });
  }

  // 6. State Landing Pages
  for (const stateName of seenStates) {
    const stateSlug = stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (stateSlug) {
      entries.push({
        loc: `${siteUrl}/state/${stateSlug}`,
        lastmod: formatDateToW3C(now),
        changefreq: 'daily',
        priority: 0.8,
      });
    }
  }

  const totalUrls = entries.length;
  const metrics: SitemapGenerationMetrics = {
    totalUrls,
    jobsCount,
    admitCardsCount,
    resultsCount,
    schemesCount,
    otherPostsCount,
    categoriesCount: enabledCategories.length,
    statePagesCount: seenStates.size,
    staticPagesCount: 2 + staticRoutes.length,
    imagesIndexedCount,
    newsIndexedCount,
    fileSizeBytes: 0,
    generatedAt: now.toISOString(),
  };

  return { entries, metrics };
}

/**
 * Generates an official Sitemaps Protocol 0.9 XML string from a list of entries.
 */
export function buildSitemapXmlString(entries: SitemapUrlEntry[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
  xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  for (const entry of entries) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (typeof entry.priority === 'number') {
      xml += `    <priority>${entry.priority.toFixed(2)}</priority>\n`;
    }

    // Google Images Schema Extension
    if (entry.image) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(entry.image.loc)}</image:loc>\n`;
      if (entry.image.title) {
        xml += `      <image:title>${escapeXml(entry.image.title)}</image:title>\n`;
      }
      if (entry.image.caption) {
        xml += `      <image:caption>${escapeXml(entry.image.caption)}</image:caption>\n`;
      }
      xml += `    </image:image>\n`;
    }

    // Google News Schema Extension
    if (entry.news) {
      xml += `    <news:news>\n`;
      xml += `      <news:publication>\n`;
      xml += `        <news:name>${escapeXml(entry.news.publicationName)}</news:name>\n`;
      xml += `        <news:language>${escapeXml(entry.news.publicationLanguage)}</news:language>\n`;
      xml += `      </news:publication>\n`;
      xml += `      <news:publication_date>${entry.news.publicationDate}</news:publication_date>\n`;
      xml += `      <news:title>${escapeXml(entry.news.title)}</news:title>\n`;
      xml += `    </news:news>\n`;
    }

    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

/**
 * High-level auto-generation function:
 * Directly turns database posts and categories into an XML sitemap with complete analytics.
 */
export function generateAutoXmlSitemap(
  posts: Post[],
  categories: Category[] = [],
  options: GenerateSitemapOptions = {}
): {
  xml: string;
  entries: SitemapUrlEntry[];
  metrics: SitemapGenerationMetrics;
} {
  const { entries, metrics } = crawlDatabaseToSitemapEntries(posts, categories, options);
  const xml = buildSitemapXmlString(entries);
  metrics.fileSizeBytes = new Blob([xml]).size;

  return {
    xml,
    entries,
    metrics,
  };
}

/**
 * Triggers a browser download of the generated sitemap.xml file.
 */
export function downloadSitemapXml(xmlContent: string, filename: string = 'sitemap.xml'): void {
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates ping URLs to notify major search engines (Google, Bing) of sitemap updates.
 */
export function getSearchEnginePingUrls(sitemapUrl: string): { google: string; bing: string } {
  const encoded = encodeURIComponent(sitemapUrl);
  return {
    google: `https://www.google.com/ping?sitemap=${encoded}`,
    bing: `https://www.bing.com/ping?sitemap=${encoded}`,
  };
}

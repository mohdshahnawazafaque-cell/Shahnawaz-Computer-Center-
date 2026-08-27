import fs from 'fs';
import path from 'path';
import { getAllPosts, getCategories, getSettings } from './db';
import { Post } from '../src/types';

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

export interface SitemapStats {
  lastGeneratedAt: string | null;
  totalUrls: number;
  postsCount: number;
  jobsCount: number;
  admitCardsCount: number;
  resultsCount: number;
  schemesCount: number;
  categoriesCount: number;
  staticPagesCount: number;
  fileSizeBytes: number;
  lastReason?: string;
  lastPostTitle?: string;
  durationMs: number;
}

// In-memory cache for fast response times
let cachedSitemapXml: string = '';
let sitemapStats: SitemapStats = {
  lastGeneratedAt: null,
  totalUrls: 0,
  postsCount: 0,
  jobsCount: 0,
  admitCardsCount: 0,
  resultsCount: 0,
  schemesCount: 0,
  categoriesCount: 0,
  staticPagesCount: 0,
  fileSizeBytes: 0,
  durationMs: 0,
};

function escapeXml(unsafe?: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDateToW3C(dateString?: string): string {
  if (!dateString) {
    return new Date().toISOString().split('T')[0];
  }
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Crawls application database, categories, states, and static pages
 * to assemble a comprehensive list of URL entries.
 */
export function crawlPortalUrls(baseUrl: string): { entries: SitemapUrlEntry[]; counts: Record<string, number> } {
  const settings = getSettings();
  const siteTitle = settings.websiteName || 'Shahnawaz Computer Center';
  const siteUrl = baseUrl.replace(/\/+$/, '');

  const entries: SitemapUrlEntry[] = [];
  const counts = {
    jobs: 0,
    admitCards: 0,
    results: 0,
    schemes: 0,
    otherPosts: 0,
    categories: 0,
    states: 0,
    staticPages: 0,
  };

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // 1. Homepage (Highest priority)
  entries.push({
    loc: `${siteUrl}/`,
    lastmod: formatDateToW3C(now.toISOString()),
    changefreq: 'hourly',
    priority: 1.0,
  });
  counts.staticPages++;

  // 2. Core feeds & hubs
  entries.push({
    loc: `${siteUrl}/rss.xml`,
    lastmod: formatDateToW3C(now.toISOString()),
    changefreq: 'hourly',
    priority: 0.95,
  });
  counts.staticPages++;

  // 3. Primary Categories & Modules
  const categories = getCategories().filter((c) => c.enabled);
  for (const cat of categories) {
    entries.push({
      loc: `${siteUrl}/category/${cat.slug}`,
      lastmod: formatDateToW3C(now.toISOString()),
      changefreq: 'daily',
      priority: 0.9,
    });
    counts.categories++;
  }

  // 4. Static Services & Utility pages
  const staticRoutes: { path: string; priority: number; changefreq: SitemapUrlEntry['changefreq'] }[] = [
    { path: '/services', priority: 0.85, changefreq: 'weekly' },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' },
    { path: '/about', priority: 0.75, changefreq: 'monthly' },
    { path: '/privacy-policy', priority: 0.5, changefreq: 'monthly' },
    { path: '/terms', priority: 0.5, changefreq: 'monthly' },
    { path: '/faq', priority: 0.7, changefreq: 'monthly' },
  ];

  for (const route of staticRoutes) {
    entries.push({
      loc: `${siteUrl}${route.path}`,
      lastmod: formatDateToW3C(now.toISOString()),
      changefreq: route.changefreq,
      priority: route.priority,
    });
    counts.staticPages++;
  }

  // 5. Crawl all published posts from database
  const allPostsResult = getAllPosts({ status: 'all' });
  const publishedPosts = allPostsResult.posts.filter(
    (p) => p.status === 'published' || p.status === 'featured' || p.status === 'pinned'
  );

  const seenStates = new Set<string>();

  for (const post of publishedPosts) {
    // Record distinct states for state-specific landing pages
    if (post.state && post.state !== 'All India' && post.state.trim().length > 0) {
      seenStates.add(post.state.trim());
    }

    // Determine path prefix based on post type
    let pathPrefix = 'post';
    let typePriority = 0.85;
    let changeFreq: SitemapUrlEntry['changefreq'] = 'daily';

    switch (post.type) {
      case 'job':
        pathPrefix = 'jobs';
        counts.jobs++;
        typePriority = 0.9;
        break;
      case 'admit_card':
        pathPrefix = 'admit-card';
        counts.admitCards++;
        typePriority = 0.9;
        break;
      case 'result':
        pathPrefix = 'result';
        counts.results++;
        typePriority = 0.9;
        break;
      case 'sarkari_yojana':
        pathPrefix = 'sarkari-yojana';
        counts.schemes++;
        typePriority = 0.85;
        break;
      default:
        pathPrefix = 'post';
        counts.otherPosts++;
        typePriority = 0.8;
        break;
    }

    // Date calculations
    const postCreatedAt = new Date(post.createdAt || now);
    const postUpdatedAt = new Date(post.updatedAt || post.createdAt || now);
    const lastModDate = formatDateToW3C(post.updatedAt || post.createdAt);

    // Boost priority if recent or pinned/featured
    if (post.isPinned || post.isFeatured) {
      typePriority = Math.min(0.95, typePriority + 0.05);
      changeFreq = 'hourly';
    } else if (postUpdatedAt >= threeDaysAgo) {
      typePriority = Math.min(0.9, typePriority + 0.05);
      changeFreq = 'hourly';
    } else {
      changeFreq = 'weekly';
    }

    // Check for Google Image search inclusion
    let imageEntry: SitemapUrlEntry['image'] | undefined;
    const imgUrl = post.featuredImage || post.ogImage;
    if (imgUrl && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('/'))) {
      const fullImgUrl = imgUrl.startsWith('http') ? imgUrl : `${siteUrl}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
      imageEntry = {
        loc: fullImgUrl,
        title: post.title,
        caption: post.shortDescription || post.title,
      };
    }

    // Check for Google News sitemap inclusion (if published within 48 hours)
    let newsEntry: SitemapUrlEntry['news'] | undefined;
    if (postCreatedAt >= fortyEightHoursAgo) {
      newsEntry = {
        publicationName: siteTitle,
        publicationLanguage: 'hi',
        publicationDate: postCreatedAt.toISOString(),
        title: post.title,
      };
    }

    // Standardized URL for Google Search Indexing
    const postUrl = `${siteUrl}/post/${post.slug}`;

    entries.push({
      loc: postUrl,
      lastmod: lastModDate,
      changefreq: changeFreq,
      priority: Number(typePriority.toFixed(2)),
      image: imageEntry,
      news: newsEntry,
    });
  }

  // 6. State landing pages
  for (const stateName of seenStates) {
    const stateSlug = stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (stateSlug) {
      entries.push({
        loc: `${siteUrl}/state/${stateSlug}`,
        lastmod: formatDateToW3C(now.toISOString()),
        changefreq: 'daily',
        priority: 0.8,
      });
      counts.states++;
    }
  }

  return { entries, counts };
}

/**
 * Builds the complete sitemap XML string according to official Sitemaps Protocol 0.9,
 * with optional Google Image and News extensions.
 */
export function buildSitemapXml(entries: SitemapUrlEntry[]): string {
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

    // Google Image Extension
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

    // Google News Extension
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

export interface GenerateSitemapOptions {
  baseUrl?: string;
  reason?: string;
  postTitle?: string;
  saveToDisk?: boolean;
}

/**
 * Executes a full crawl of all posts and generates + saves the sitemap.xml.
 * Can be called synchronously or asynchronously on post creation/update.
 */
export function generateAndSaveSitemap(options?: GenerateSitemapOptions): {
  xml: string;
  stats: SitemapStats;
} {
  const startTime = Date.now();
  const defaultBaseUrl = process.env.APP_URL || 'https://shahnawazcomputercenter.in';
  const baseUrl = options?.baseUrl || defaultBaseUrl;

  try {
    const { entries, counts } = crawlPortalUrls(baseUrl);
    const xml = buildSitemapXml(entries);

    const durationMs = Date.now() - startTime;
    const nowIso = new Date().toISOString();
    const totalPosts = counts.jobs + counts.admitCards + counts.results + counts.schemes + counts.otherPosts;

    sitemapStats = {
      lastGeneratedAt: nowIso,
      totalUrls: entries.length,
      postsCount: totalPosts,
      jobsCount: counts.jobs,
      admitCardsCount: counts.admitCards,
      resultsCount: counts.results,
      schemesCount: counts.schemes,
      categoriesCount: counts.categories,
      staticPagesCount: counts.staticPages + counts.states,
      fileSizeBytes: Buffer.byteLength(xml, 'utf8'),
      lastReason: options?.reason || 'manual',
      lastPostTitle: options?.postTitle,
      durationMs,
    };

    cachedSitemapXml = xml;

    // Save to public directory if requested or by default
    if (options?.saveToDisk !== false) {
      try {
        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        const sitemapPath = path.join(publicDir, 'sitemap.xml');
        fs.writeFileSync(sitemapPath, xml, 'utf8');

        // Also write to dist/ if dist directory exists (e.g. in production build)
        const distDir = path.join(process.cwd(), 'dist');
        if (fs.existsSync(distDir)) {
          fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
        }
      } catch (fileErr) {
        console.warn('⚠️ Could not write sitemap.xml to disk (using memory cache):', fileErr);
      }
    }

    console.log(
      `🗺️ [Sitemap Auto-Updater] Sitemap regenerated successfully (${entries.length} URLs indexed, ${totalPosts} posts, ${durationMs}ms)` +
        (options?.reason ? ` [Trigger: ${options.reason}]` : '') +
        (options?.postTitle ? ` [Post: "${options.postTitle}"]` : '')
    );

    return { xml, stats: sitemapStats };
  } catch (err) {
    console.error('❌ [Sitemap Generator] Failed to generate sitemap:', err);
    throw err;
  }
}

/**
 * Returns cached sitemap XML or regenerates if not yet cached.
 */
export function getSitemapXml(baseUrl?: string): string {
  if (cachedSitemapXml) {
    return cachedSitemapXml;
  }
  const result = generateAndSaveSitemap({ baseUrl, reason: 'initial_request' });
  return result.xml;
}

/**
 * Returns current sitemap status and crawl analytics.
 */
export function getSitemapStats(): SitemapStats {
  if (!sitemapStats.lastGeneratedAt) {
    // Generate initial stats
    generateAndSaveSitemap({ reason: 'initial_stats' });
  }
  return sitemapStats;
}

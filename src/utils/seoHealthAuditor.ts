import { Post } from '../types';

export type SeoIssueSeverity = 'critical' | 'warning' | 'suggestion' | 'passed';

export interface SeoIssueItem {
  id: string;
  category: 'title' | 'description' | 'keywords' | 'social' | 'schema' | 'crawl' | 'slug';
  severity: SeoIssueSeverity;
  title: string;
  message: string;
  suggestion?: string;
  autoFixAvailable?: boolean;
}

export interface PostSeoAuditResult {
  postId: string;
  postTitle: string;
  postSlug: string;
  postType: string;
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  criticalCount: number;
  warningCount: number;
  suggestionCount: number;
  passedCount: number;
  issues: SeoIssueItem[];
  checkedAt: string;
  currentMeta: {
    seoTitle: string;
    metaDescription: string;
    keywordsCount: number;
    hasOgImage: boolean;
    robotsIndex: string;
    schemaType: string;
  };
}

export interface PortalSeoHealthReport {
  overallScore: number;
  averageGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  totalPostsAudited: number;
  perfectPostsCount: number; // Score >= 90
  goodPostsCount: number;    // Score 75 - 89
  warningPostsCount: number; // Score 50 - 74
  criticalPostsCount: number;// Score < 50
  totalCriticalIssues: number;
  totalWarnings: number;
  totalSuggestions: number;
  postsResults: PostSeoAuditResult[];
  categoryBreakdown: Record<string, { count: number; avgScore: number }>;
  topMissingTags: { tag: string; affectedPostsCount: number; severity: SeoIssueSeverity }[];
  auditedAt: string;
}

/**
 * Calculates letter grade based on numeric 0-100 score
 */
export function getGradeFromScore(score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

/**
 * Generates an optimized auto-fix suggestion for a post
 */
export function generateAutoFixPayload(post: Post): Partial<Post> {
  const currentYear = new Date().getFullYear();
  const rawTitle = post.title.trim();
  const dept = post.department?.trim() || '';
  const state = post.state && post.state !== 'All India' ? ` (${post.state})` : '';

  // 1. Optimized Title (50-60 chars)
  let optTitle = post.seoTitle?.trim() || '';
  if (!optTitle || optTitle.length < 40 || optTitle.length > 70) {
    if (rawTitle.includes(String(currentYear))) {
      optTitle = `${rawTitle}${state} | Shahnawaz Computer Center`;
    } else {
      optTitle = `${rawTitle} ${currentYear}${state} | Apply Online Form`;
    }
    if (optTitle.length > 65) {
      optTitle = optTitle.slice(0, 62).trim() + '...';
    }
  }

  // 2. Optimized Meta Description (120-155 chars)
  let optDesc = post.metaDescription?.trim() || '';
  if (!optDesc || optDesc.length < 80 || optDesc.length > 165) {
    const vacancyText = post.totalVacancy ? ` for ${post.totalVacancy} Posts` : '';
    const lastDateText = post.lastDate ? ` Last Date: ${post.lastDate}.` : '';
    optDesc = `${rawTitle}${vacancyText}.${lastDateText} Check eligibility criteria, age limit, salary details, notification PDF & apply online at Shahnawaz Computer Center.`;
    if (optDesc.length > 158) {
      optDesc = optDesc.slice(0, 155).trim() + '...';
    }
  }

  // 3. Focus Keywords (Array of 6-8 relevant tags)
  let keywords = post.keywords && post.keywords.length > 0 ? [...post.keywords] : [];
  if (keywords.length < 4) {
    const autoKeywords = [
      rawTitle,
      `${rawTitle} ${currentYear}`,
      `${rawTitle} apply online`,
      `${rawTitle} eligibility criteria`,
      `${rawTitle} notification pdf`,
      dept ? `${dept} recruitment` : 'Sarkari Job Notification',
      'Shahnawaz Computer Center',
      'Sarkari Result',
    ].filter(Boolean);
    keywords = Array.from(new Set([...keywords, ...autoKeywords])).slice(0, 8);
  }

  // 4. Fallback OG Image
  const ogImage =
    post.ogImage ||
    post.featuredImage ||
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=630&fit=crop';

  return {
    seoTitle: optTitle,
    metaDescription: optDesc,
    keywords,
    ogTitle: optTitle,
    ogDescription: optDesc,
    ogImage,
    twitterCard: 'summary_large_image',
    twitterTitle: optTitle,
    twitterDescription: optDesc,
    twitterImage: ogImage,
    robotsIndex: 'index, follow',
    schemaType: post.type === 'job' ? 'JobPosting' : 'Article',
  };
}

/**
 * Runs complete metadata inspection on a single post
 */
export function auditPostMetadata(post: Post): PostSeoAuditResult {
  const issues: SeoIssueItem[] = [];
  let score = 100;

  const seoTitle = (post.seoTitle || post.title || '').trim();
  const rawTitle = (post.title || '').trim();
  const metaDesc = (post.metaDescription || post.shortDescription || '').trim();
  const keywords = post.keywords || [];
  const ogImage = post.ogImage || post.featuredImage;
  const robotsIndex = (post.robotsIndex || 'index, follow').toLowerCase();
  const schemaType = post.schemaType || (post.type === 'job' ? 'JobPosting' : 'Article');
  const slug = (post.slug || '').trim();

  // ==========================================
  // 1. Meta Title Analysis (Weight: 25%)
  // ==========================================
  if (!post.seoTitle && !post.title) {
    score -= 25;
    issues.push({
      id: 'title_missing',
      category: 'title',
      severity: 'critical',
      title: 'Missing Page Title (<title>)',
      message: 'No title or SEO title is defined. Search engines cannot index pages without a valid title.',
      suggestion: 'Set a descriptive title with post name, organization, and current year.',
      autoFixAvailable: true,
    });
  } else if (!post.seoTitle) {
    score -= 8;
    issues.push({
      id: 'title_not_explicit',
      category: 'title',
      severity: 'warning',
      title: 'Defaulting to Raw Post Title',
      message: 'Explicit SEO title (<title> tag) is not customized, falling back to basic title.',
      suggestion: 'Set a targeted 50-60 character SEO title including keywords like "Apply Online" or year.',
      autoFixAvailable: true,
    });
  } else if (seoTitle.length < 35) {
    score -= 10;
    issues.push({
      id: 'title_too_short',
      category: 'title',
      severity: 'warning',
      title: `SEO Title is Too Short (${seoTitle.length} chars)`,
      message: `Title has only ${seoTitle.length} characters. Optimal Google search title length is 50-60 characters.`,
      suggestion: 'Expand title with department name, state, or "Online Form 2026".',
      autoFixAvailable: true,
    });
  } else if (seoTitle.length > 68) {
    score -= 6;
    issues.push({
      id: 'title_too_long',
      category: 'title',
      severity: 'warning',
      title: `SEO Title is Too Long (${seoTitle.length} chars)`,
      message: `Title length (${seoTitle.length} chars) exceeds the Google 60-65 character display limit and will get truncated on SERPs.`,
      suggestion: 'Trim to 55-60 characters to prevent truncation ellipses on mobile and desktop searches.',
      autoFixAvailable: true,
    });
  } else {
    issues.push({
      id: 'title_optimal',
      category: 'title',
      severity: 'passed',
      title: `Optimal Title Tag (${seoTitle.length} chars)`,
      message: 'Title length is well-calibrated for maximum Google and Bing SERP click-through rates.',
    });
  }

  // Check for search intent terms in title
  const hasIntentKeywords = /202[4-9]|recruitment|online form|admit card|result|yojana|vacancy|bharti/i.test(seoTitle);
  if (!hasIntentKeywords && seoTitle.length > 0) {
    score -= 4;
    issues.push({
      id: 'title_missing_intent',
      category: 'title',
      severity: 'suggestion',
      title: 'Missing Search Intent Modifier in Title',
      message: 'Title does not include high-volume query keywords like "Recruitment", "Online Form", or "2026".',
      suggestion: 'Include recruitment year or form action in the title.',
      autoFixAvailable: true,
    });
  }

  // ==========================================
  // 2. Meta Description Analysis (Weight: 25%)
  // ==========================================
  if (!metaDesc) {
    score -= 25;
    issues.push({
      id: 'desc_missing',
      category: 'description',
      severity: 'critical',
      title: 'Missing Meta Description (<meta name="description">)',
      message: 'No meta description tag is present. Search engines will generate random snippets from page text.',
      suggestion: 'Add a 120-155 character concise summary outlining vacancy details, eligibility, and apply links.',
      autoFixAvailable: true,
    });
  } else if (metaDesc.length < 80) {
    score -= 12;
    issues.push({
      id: 'desc_too_short',
      category: 'description',
      severity: 'warning',
      title: `Meta Description is Too Short (${metaDesc.length}/160 chars)`,
      message: `Description has only ${metaDesc.length} characters. Optimal search snippet length is 120-155 characters.`,
      suggestion: 'Add eligibility highlights, last date, and a direct call to action.',
      autoFixAvailable: true,
    });
  } else if (metaDesc.length > 165) {
    score -= 5;
    issues.push({
      id: 'desc_too_long',
      category: 'description',
      severity: 'warning',
      title: `Meta Description Exceeds Limit (${metaDesc.length} chars)`,
      message: `Search engines truncate descriptions longer than 160 characters with "...".`,
      suggestion: 'Shorten to under 155 characters so the full sentence displays on search engines.',
      autoFixAvailable: true,
    });
  } else {
    issues.push({
      id: 'desc_optimal',
      category: 'description',
      severity: 'passed',
      title: `Optimal Meta Description (${metaDesc.length} chars)`,
      message: 'Description length conforms to current Google search snippet benchmarks.',
    });
  }

  // Check for CTA (Call To Action) in Description
  const hasCta = /apply|check|download|eligibility|click|visit|last date|fees/i.test(metaDesc);
  if (!hasCta && metaDesc.length > 0) {
    score -= 3;
    issues.push({
      id: 'desc_missing_cta',
      category: 'description',
      severity: 'suggestion',
      title: 'No Call-To-Action (CTA) in Description',
      message: 'Snippet lacks action verbs that drive user clicks from search results.',
      suggestion: 'Include action phrases like "Apply Online", "Check Eligibility", or "Download PDF".',
      autoFixAvailable: true,
    });
  }

  // ==========================================
  // 3. Social OpenGraph & Twitter Cards (Weight: 20%)
  // ==========================================
  if (!ogImage) {
    score -= 15;
    issues.push({
      id: 'og_image_missing',
      category: 'social',
      severity: 'critical',
      title: 'Missing Social Share Banner (<meta property="og:image">)',
      message: 'No OpenGraph or featured image found. Links shared on WhatsApp, Telegram, and Facebook will display with a blank or broken thumbnail.',
      suggestion: 'Assign a 1200x630px high-resolution banner image for rich preview cards.',
      autoFixAvailable: true,
    });
  } else {
    issues.push({
      id: 'og_image_ok',
      category: 'social',
      severity: 'passed',
      title: 'Social Share Image Configured',
      message: 'Rich link previews will render on WhatsApp, Facebook, Telegram & X.',
    });
  }

  if (!post.twitterCard) {
    score -= 3;
    issues.push({
      id: 'twitter_card_missing',
      category: 'social',
      severity: 'suggestion',
      title: 'Default Twitter Card Type',
      message: 'Twitter card type is unassigned; defaulting to standard image preview.',
      suggestion: 'Set twitter:card to "summary_large_image" for maximum screen real estate.',
      autoFixAvailable: true,
    });
  }

  // ==========================================
  // 4. Keywords & Search Terms (Weight: 15%)
  // ==========================================
  if (!keywords || keywords.length === 0) {
    score -= 12;
    issues.push({
      id: 'keywords_missing',
      category: 'keywords',
      severity: 'warning',
      title: 'Zero Focus Keywords Assigned',
      message: 'No search keywords or Hindi/English tags are attached to this recruitment notice.',
      suggestion: 'Add 4 to 8 long-tail search tags matching student queries (e.g. "SSC CGL Eligibility", "Form Last Date").',
      autoFixAvailable: true,
    });
  } else if (keywords.length < 3) {
    score -= 5;
    issues.push({
      id: 'keywords_too_few',
      category: 'keywords',
      severity: 'suggestion',
      title: `Low Keyword Density (${keywords.length} tags)`,
      message: 'Having at least 4-6 target keywords boosts category indexing and search relevance.',
      suggestion: 'Add related query tags and regional variations.',
      autoFixAvailable: true,
    });
  } else {
    issues.push({
      id: 'keywords_ok',
      category: 'keywords',
      severity: 'passed',
      title: `${keywords.length} Target Keywords Active`,
      message: 'Good keyword coverage for indexing and internal search.',
    });
  }

  // ==========================================
  // 5. Robots & Schema.org Structured Data (Weight: 15%)
  // ==========================================
  if (robotsIndex.includes('noindex')) {
    score -= 30; // Severe penalty
    issues.push({
      id: 'robots_noindex_warning',
      category: 'crawl',
      severity: 'critical',
      title: 'Robots Directs Google to "noindex"',
      message: 'This post is marked as "noindex". Search bots are instructed NOT to display this vacancy in search results!',
      suggestion: 'Change robots index directive to "index, follow" to allow search indexing.',
      autoFixAvailable: true,
    });
  } else {
    issues.push({
      id: 'robots_ok',
      category: 'crawl',
      severity: 'passed',
      title: 'Search Indexing Permitted ("index, follow")',
      message: 'Googlebot and Bingbot can crawl and rank this URL.',
    });
  }

  // Schema Type Verification
  if (!post.schemaType) {
    score -= 4;
    issues.push({
      id: 'schema_unassigned',
      category: 'schema',
      severity: 'suggestion',
      title: 'Implicit Structured Schema Type',
      message: `Schema type will default to ${schemaType}. Setting explicit schema enhances rich Google snippet cards.`,
      suggestion: 'Explicitly designate as JobPosting or Article.',
      autoFixAvailable: true,
    });
  }

  // Slug Hygiene
  if (!slug) {
    score -= 10;
    issues.push({
      id: 'slug_missing',
      category: 'slug',
      severity: 'critical',
      title: 'Missing URL Slug',
      message: 'Post has no slug defined and will fall back to an un-optimized ID URL.',
      suggestion: 'Generate a clean hyphenated slug from the title.',
      autoFixAvailable: true,
    });
  } else if (slug.length > 90) {
    score -= 3;
    issues.push({
      id: 'slug_long',
      category: 'slug',
      severity: 'suggestion',
      title: 'URL Slug is Quite Long',
      message: `Slug has ${slug.length} characters. Short, focused URLs perform better on mobile sharing and SERPs.`,
      suggestion: 'Shorten slug to 3-6 core keywords.',
    });
  }

  // Clamp Score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  const grade = getGradeFromScore(finalScore);

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const suggestionCount = issues.filter((i) => i.severity === 'suggestion').length;
  const passedCount = issues.filter((i) => i.severity === 'passed').length;

  return {
    postId: post.id,
    postTitle: rawTitle,
    postSlug: slug || post.id,
    postType: post.type || 'job',
    score: finalScore,
    grade,
    criticalCount,
    warningCount,
    suggestionCount,
    passedCount,
    issues,
    checkedAt: new Date().toISOString(),
    currentMeta: {
      seoTitle,
      metaDescription: metaDesc,
      keywordsCount: keywords.length,
      hasOgImage: !!ogImage,
      robotsIndex,
      schemaType,
    },
  };
}

/**
 * Runs a full health check audit across all posts in the portal
 */
export function runPortalSeoHealthCheck(posts: Post[]): PortalSeoHealthReport {
  const postsResults: PostSeoAuditResult[] = posts.map((p) => auditPostMetadata(p));

  const totalPostsAudited = postsResults.length;
  const overallScore = totalPostsAudited > 0
    ? Math.round(postsResults.reduce((acc, r) => acc + r.score, 0) / totalPostsAudited)
    : 100;

  const averageGrade = getGradeFromScore(overallScore);

  const perfectPostsCount = postsResults.filter((r) => r.score >= 90).length;
  const goodPostsCount = postsResults.filter((r) => r.score >= 75 && r.score < 90).length;
  const warningPostsCount = postsResults.filter((r) => r.score >= 50 && r.score < 75).length;
  const criticalPostsCount = postsResults.filter((r) => r.score < 50).length;

  let totalCriticalIssues = 0;
  let totalWarnings = 0;
  let totalSuggestions = 0;

  const tagCounts: Record<string, { count: number; severity: SeoIssueSeverity }> = {
    'Missing Meta Description': { count: 0, severity: 'critical' },
    'Missing Social Image (og:image)': { count: 0, severity: 'critical' },
    'Defaulting to Raw Title': { count: 0, severity: 'warning' },
    'Short Meta Description (<80 chars)': { count: 0, severity: 'warning' },
    'Zero Focus Keywords': { count: 0, severity: 'warning' },
    'Missing Intent Modifier': { count: 0, severity: 'suggestion' },
    'Missing Call-to-Action': { count: 0, severity: 'suggestion' },
    'Noindex Directives': { count: 0, severity: 'critical' },
  };

  const categoryBreakdown: Record<string, { count: number; totalScore: number; avgScore: number }> = {};

  for (const res of postsResults) {
    totalCriticalIssues += res.criticalCount;
    totalWarnings += res.warningCount;
    totalSuggestions += res.suggestionCount;

    // Track Category Stats
    const typeKey = res.postType || 'other';
    if (!categoryBreakdown[typeKey]) {
      categoryBreakdown[typeKey] = { count: 0, totalScore: 0, avgScore: 0 };
    }
    categoryBreakdown[typeKey].count += 1;
    categoryBreakdown[typeKey].totalScore += res.score;

    // Check specific tags
    for (const issue of res.issues) {
      if (issue.id === 'desc_missing') tagCounts['Missing Meta Description'].count++;
      if (issue.id === 'og_image_missing') tagCounts['Missing Social Image (og:image)'].count++;
      if (issue.id === 'title_not_explicit') tagCounts['Defaulting to Raw Title'].count++;
      if (issue.id === 'desc_too_short') tagCounts['Short Meta Description (<80 chars)'].count++;
      if (issue.id === 'keywords_missing') tagCounts['Zero Focus Keywords'].count++;
      if (issue.id === 'title_missing_intent') tagCounts['Missing Intent Modifier'].count++;
      if (issue.id === 'desc_missing_cta') tagCounts['Missing Call-to-Action'].count++;
      if (issue.id === 'robots_noindex_warning') tagCounts['Noindex Directives'].count++;
    }
  }

  // Calculate Category Averages
  const finalizedCategoryBreakdown: Record<string, { count: number; avgScore: number }> = {};
  for (const [k, v] of Object.entries(categoryBreakdown)) {
    finalizedCategoryBreakdown[k] = {
      count: v.count,
      avgScore: v.count > 0 ? Math.round(v.totalScore / v.count) : 0,
    };
  }

  const topMissingTags = Object.entries(tagCounts)
    .filter(([_, data]) => data.count > 0)
    .map(([tag, data]) => ({
      tag,
      affectedPostsCount: data.count,
      severity: data.severity,
    }))
    .sort((a, b) => b.affectedPostsCount - a.affectedPostsCount);

  return {
    overallScore,
    averageGrade,
    totalPostsAudited,
    perfectPostsCount,
    goodPostsCount,
    warningPostsCount,
    criticalPostsCount,
    totalCriticalIssues,
    totalWarnings,
    totalSuggestions,
    postsResults,
    categoryBreakdown: finalizedCategoryBreakdown,
    topMissingTags,
    auditedAt: new Date().toISOString(),
  };
}

/**
 * Exports full audit report as a clean Markdown string for download/sharing
 */
export function exportReportAsMarkdown(report: PortalSeoHealthReport): string {
  let md = `# SEO Health Check & Diagnostic Report\n`;
  md += `**Portal:** Shahnawaz Computer Center (Sarkari Job Notification & Services)\n`;
  md += `**Generated:** ${new Date(report.auditedAt).toLocaleString()}\n`;
  md += `**Overall Score:** ${report.overallScore}/100 (Grade: ${report.averageGrade})\n\n`;

  md += `## 📊 Executive Summary\n`;
  md += `- **Total Posts Audited:** ${report.totalPostsAudited}\n`;
  md += `- **Fully Optimized (Score >= 90):** ${report.perfectPostsCount}\n`;
  md += `- **Good Health (Score 75-89):** ${report.goodPostsCount}\n`;
  md += `- **Needs Attention (Score 50-74):** ${report.warningPostsCount}\n`;
  md += `- **Critical Risks (Score < 50):** ${report.criticalPostsCount}\n`;
  md += `- **Total Issues Detected:** ${report.totalCriticalIssues} Critical, ${report.totalWarnings} Warnings, ${report.totalSuggestions} Optimization Suggestions\n\n`;

  md += `## ⚠️ Top Missing Tags & SEO Bottlenecks\n`;
  if (report.topMissingTags.length === 0) {
    md += `*No major missing tags found. All posts have compliant metadata!*\n\n`;
  } else {
    for (const t of report.topMissingTags) {
      md += `- **${t.tag}**: Affects ${t.affectedPostsCount} posts [Severity: ${t.severity.toUpperCase()}]\n`;
    }
    md += `\n`;
  }

  md += `## 📑 Post-by-Post Breakdown\n`;
  for (const postRes of report.postsResults) {
    md += `### ${postRes.postTitle} (${postRes.postType.toUpperCase()})\n`;
    md += `- **Score:** ${postRes.score}/100 [Grade: ${postRes.grade}]\n`;
    md += `- **SEO Title:** ${postRes.currentMeta.seoTitle || '*None*'}\n`;
    md += `- **Meta Description:** ${postRes.currentMeta.metaDescription || '*None*'}\n`;
    md += `- **Social Image (OG):** ${postRes.currentMeta.hasOgImage ? 'Configured ✓' : 'Missing ✗'}\n`;
    md += `- **Keywords:** ${postRes.currentMeta.keywordsCount} tags\n`;

    const nonPassed = postRes.issues.filter((i) => i.severity !== 'passed');
    if (nonPassed.length > 0) {
      md += `- **Issues & Suggestions:**\n`;
      for (const iss of nonPassed) {
        md += `  - [${iss.severity.toUpperCase()}] **${iss.title}**: ${iss.message}`;
        if (iss.suggestion) md += ` *(Suggestion: ${iss.suggestion})*`;
        md += `\n`;
      }
    } else {
      md += `- *All SEO checks passed perfectly.*\n`;
    }
    md += `\n`;
  }

  return md;
}

/**
 * Downloads a generated string as a file
 */
export function downloadTextReport(content: string, filename: string, mimeType: string = 'text/markdown'): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
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

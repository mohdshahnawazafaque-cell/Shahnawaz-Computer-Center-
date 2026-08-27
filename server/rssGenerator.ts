import { Post, SiteSettings, PostType } from '../src/types';

interface RssFeedOptions {
  baseUrl: string;
  siteSettings?: Partial<SiteSettings>;
  feedUrl?: string;
  categoryFilter?: string;
  typeFilter?: PostType | string;
  stateFilter?: string;
  limit?: number;
}

// Utility to escape XML special entities safely
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Format date into RFC 822 standard string (required by RSS 2.0)
function formatRfc822Date(dateString?: string): string {
  if (!dateString) return new Date().toUTCString();
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

// Get clean category label and tag prefix
function getCategoryInfo(post: Post): { label: string; tagPrefix: string } {
  const type = (post.type || '').toLowerCase();
  const cat = (post.category || '').toLowerCase();

  if (type === 'job' || cat.includes('job') || cat.includes('naukri') || cat.includes('vacancy') || cat.includes('recruitment')) {
    return { label: 'Sarkari Naukri / Vacancy', tagPrefix: '[Vacancy]' };
  }
  if (type === 'admit_card' || cat.includes('admit') || cat.includes('hall ticket') || cat.includes('call letter')) {
    return { label: 'Admit Card & Hall Ticket', tagPrefix: '[Admit Card]' };
  }
  if (type === 'result' || cat.includes('result') || cat.includes('score') || cat.includes('merit')) {
    return { label: 'Sarkari Result & Selection List', tagPrefix: '[Result]' };
  }
  if (type === 'answer_key' || cat.includes('answer') || cat.includes('key') || cat.includes('challenge')) {
    return { label: 'Answer Key & Challenge', tagPrefix: '[Answer Key]' };
  }
  if (type === 'sarkari_yojana' || cat.includes('yojana') || cat.includes('scheme') || cat.includes('scholarship')) {
    return { label: 'Sarkari Yojana & Scholarship', tagPrefix: '[Yojana]' };
  }
  if (type === 'admission' || cat.includes('admission') || cat.includes('neet') || cat.includes('counseling')) {
    return { label: 'Admission & Counseling', tagPrefix: '[Admission]' };
  }

  return { label: post.category || 'Government Update', tagPrefix: '[Govt Notice]' };
}

// Build item HTML description for RSS readers
function buildItemHtmlDescription(post: Post, baseUrl: string): string {
  const { label } = getCategoryInfo(post);
  const pathPrefix =
    post.type === 'job'
      ? 'jobs'
      : post.type === 'admit_card'
      ? 'admit-card'
      : post.type === 'result'
      ? 'result'
      : post.type === 'sarkari_yojana'
      ? 'sarkari-yojana'
      : 'post';

  const postUrl = `${baseUrl}/${pathPrefix}/${post.slug}`;

  let html = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 680px;">`;

  // Badges Header
  html += `<div style="margin-bottom: 12px;">`;
  html += `<span style="background-color: #dc2626; color: #ffffff; padding: 3px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; text-transform: uppercase; margin-right: 6px;">${escapeXml(label)}</span>`;
  if (post.state) {
    html += `<span style="background-color: #0b2545; color: #ffffff; padding: 3px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; margin-right: 6px;">📍 ${escapeXml(post.state)}</span>`;
  }
  if (post.organization || post.department) {
    html += `<span style="background-color: #f1f5f9; color: #334155; padding: 3px 8px; font-size: 11px; font-weight: 600; border-radius: 4px; border: 1px solid #cbd5e1;">🏢 ${escapeXml(post.organization || post.department || '')}</span>`;
  }
  html += `</div>`;

  // Title and Short Description
  html += `<h2 style="font-size: 18px; color: #0b2545; margin: 8px 0;">${escapeXml(post.title)}</h2>`;
  if (post.shortDescription) {
    html += `<p style="font-size: 14px; color: #475569; margin-bottom: 14px;">${escapeXml(post.shortDescription)}</p>`;
  }

  // Key Overview Table
  html += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">`;
  html += `<tbody>`;

  if (post.totalVacancy) {
    html += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; font-weight: bold; color: #475569; width: 35%;">Total Vacancies</td><td style="padding: 8px 12px; color: #0b2545; font-weight: bold;">${escapeXml(post.totalVacancy)}</td></tr>`;
  }

  if (post.educationalQualification) {
    html += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Qualification</td><td style="padding: 8px 12px; color: #1e293b;">${escapeXml(post.educationalQualification)}</td></tr>`;
  }

  if (post.startDate) {
    html += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Published / Application Start</td><td style="padding: 8px 12px; color: #1e293b;">${escapeXml(post.startDate)}</td></tr>`;
  }

  if (post.lastDate) {
    html += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; font-weight: bold; color: #dc2626;">Last Date to Apply</td><td style="padding: 8px 12px; color: #dc2626; font-weight: bold;">${escapeXml(post.lastDate)}</td></tr>`;
  }

  if (post.examDate) {
    html += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; font-weight: bold; color: #2563eb;">Exam Date</td><td style="padding: 8px 12px; color: #2563eb; font-weight: bold;">${escapeXml(post.examDate)}</td></tr>`;
  }

  if (post.admitCardDate) {
    html += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; font-weight: bold; color: #d97706;">Admit Card Date</td><td style="padding: 8px 12px; color: #d97706; font-weight: bold;">${escapeXml(post.admitCardDate)}</td></tr>`;
  }

  if (post.resultDate) {
    html += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; font-weight: bold; color: #16a34a;">Result Declared Date</td><td style="padding: 8px 12px; color: #16a34a; font-weight: bold;">${escapeXml(post.resultDate)}</td></tr>`;
  }

  html += `</tbody></table>`;

  // Action Buttons & Official Links
  html += `<div style="margin: 16px 0; display: flex; flex-wrap: wrap; gap: 8px;">`;

  // Full Details Page Link
  html += `<a href="${postUrl}" style="display: inline-block; background-color: #0b2545; color: #ffffff; text-decoration: none; padding: 8px 16px; font-size: 13px; font-weight: bold; border-radius: 6px; margin-right: 8px;">📄 View Complete Notice & Details</a>`;

  // Direct Apply Link if available
  const applyLink = post.importantLinks?.find((l) => l.name.toLowerCase().includes('apply') || l.type === 'apply');
  if (applyLink && applyLink.url) {
    html += `<a href="${escapeXml(applyLink.url)}" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 8px 16px; font-size: 13px; font-weight: bold; border-radius: 6px; margin-right: 8px;">🚀 Official Apply Online</a>`;
  }

  // Admit Card link
  const admitLink = post.importantLinks?.find((l) => l.name.toLowerCase().includes('admit') || l.type === 'admit_card');
  if (admitLink && admitLink.url) {
    html += `<a href="${escapeXml(admitLink.url)}" style="display: inline-block; background-color: #d97706; color: #ffffff; text-decoration: none; padding: 8px 16px; font-size: 13px; font-weight: bold; border-radius: 6px; margin-right: 8px;">🎫 Download Admit Card</a>`;
  }

  // Result Link
  const resultLink = post.importantLinks?.find((l) => l.name.toLowerCase().includes('result') || l.type === 'result');
  if (resultLink && resultLink.url) {
    html += `<a href="${escapeXml(resultLink.url)}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 8px 16px; font-size: 13px; font-weight: bold; border-radius: 6px; margin-right: 8px;">🏆 Check Result / Scorecard</a>`;
  }

  // Notification PDF Link
  const notifLink =
    post.importantLinks?.find((l) => l.name.toLowerCase().includes('notification') || l.type === 'notification') ||
    (post.officialSource?.notificationUrl ? { url: post.officialSource.notificationUrl } : undefined);
  if (notifLink && notifLink.url) {
    html += `<a href="${escapeXml(notifLink.url)}" style="display: inline-block; background-color: #475569; color: #ffffff; text-decoration: none; padding: 8px 16px; font-size: 13px; font-weight: bold; border-radius: 6px;">📥 Official Notification PDF</a>`;
  }

  html += `</div>`;

  // Center assistance banner
  html += `<div style="margin-top: 20px; padding: 12px; background-color: #eff6ff; border-left: 4px solid #2563eb; font-size: 12px; color: #1e3a8a; border-radius: 0 6px 6px 0;">`;
  html += `<strong>Need Help Filling this Form?</strong> Visit <em>Shahnawaz Computer Center</em>, Tambour, Sitapur, UP or call <strong>+91 99560 78419</strong> for error-free online form submission, photo/signature resizing, and PVC printouts.`;
  html += `</div>`;

  html += `</div>`;
  return html;
}

/**
 * Generate full compliant RSS 2.0 XML with atom self links and rich module support
 */
export function generateRssFeed(posts: Post[], options: RssFeedOptions): string {
  const {
    baseUrl,
    siteSettings,
    feedUrl = `${baseUrl}/rss.xml`,
    categoryFilter,
    typeFilter,
    stateFilter,
  } = options;

  const siteName = siteSettings?.websiteName || 'SHAHNAWAZ COMPUTER CENTER';
  const currentYear = new Date().getFullYear();

  let channelTitle = `${siteName} - Sarkari Naukri, Admit Card & Results RSS Feed`;
  let channelDescription =
    siteSettings?.tagline ||
    'Latest real-time verified updates for Government Jobs (Vacancies), Admit Cards, Results, Exam Notifications, and Computer Center Form Filling services.';

  if (categoryFilter || typeFilter) {
    const filterKey = (categoryFilter || typeFilter || '').toLowerCase();
    if (filterKey.includes('job') || filterKey.includes('naukri') || filterKey.includes('vacancy')) {
      channelTitle = `${siteName} - Latest Vacancies & Sarkari Naukri RSS Feed`;
      channelDescription = 'Subscribe to new Central & State Government job vacancies and online recruitment forms.';
    } else if (filterKey.includes('admit')) {
      channelTitle = `${siteName} - Admit Cards & Hall Tickets RSS Feed`;
      channelDescription = 'Subscribe to new Government Exam Admit Cards, Call Letters, and Exam City slips.';
    } else if (filterKey.includes('result')) {
      channelTitle = `${siteName} - Sarkari Results & Merit Lists RSS Feed`;
      channelDescription = 'Subscribe to latest Sarkari Exam Results, Scorecards, and Final Selection Lists.';
    } else if (filterKey.includes('yojana')) {
      channelTitle = `${siteName} - Sarkari Yojana & Scholarship Schemes RSS Feed`;
      channelDescription = 'Subscribe to Government Welfare Schemes, PM Yojana, and State Scholarship alerts.';
    }
  }

  if (stateFilter && stateFilter !== 'All') {
    channelTitle += ` (${stateFilter})`;
  }

  const lastBuildDate = posts.length > 0
    ? formatRfc822Date(posts[0].updatedAt || posts[0].createdAt)
    : new Date().toUTCString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">\n`;
  xml += `  <channel>\n`;
  xml += `    <title><![CDATA[${channelTitle}]]></title>\n`;
  xml += `    <link>${baseUrl}/</link>\n`;
  xml += `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />\n`;
  xml += `    <description><![CDATA[${channelDescription}]]></description>\n`;
  xml += `    <language>en-IN</language>\n`;
  xml += `    <copyright>© ${currentYear} ${escapeXml(siteName)}. All Rights Reserved.</copyright>\n`;
  xml += `    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n`;
  xml += `    <pubDate>${lastBuildDate}</pubDate>\n`;
  xml += `    <ttl>30</ttl>\n`;
  xml += `    <generator>Shahnawaz Portal RSS Generator 2.0</generator>\n`;

  // Channel Logo / Image
  xml += `    <image>\n`;
  xml += `      <url>${baseUrl}/icon.svg</url>\n`;
  xml += `      <title><![CDATA[${channelTitle}]]></title>\n`;
  xml += `      <link>${baseUrl}/</link>\n`;
  xml += `    </image>\n`;

  // Loop through recent posts
  posts.forEach((post) => {
    const { tagPrefix, label } = getCategoryInfo(post);
    const pathPrefix =
      post.type === 'job'
        ? 'jobs'
        : post.type === 'admit_card'
        ? 'admit-card'
        : post.type === 'result'
        ? 'result'
        : post.type === 'sarkari_yojana'
        ? 'sarkari-yojana'
        : 'post';

    const postUrl = `${baseUrl}/${pathPrefix}/${post.slug}`;
    const pubDate = formatRfc822Date(post.createdAt || post.updatedAt);
    const itemTitle = `${tagPrefix} ${post.title}`;
    const itemHtml = buildItemHtmlDescription(post, baseUrl);
    const shortDesc = post.shortDescription || `${post.title} by ${post.organization || 'Government of India'}. Apply online and check notifications.`;

    xml += `    <item>\n`;
    xml += `      <title><![CDATA[${itemTitle}]]></title>\n`;
    xml += `      <link>${postUrl}</link>\n`;
    xml += `      <guid isPermaLink="true">${postUrl}</guid>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;
    xml += `      <dc:creator><![CDATA[${post.organization || siteName}]]></dc:creator>\n`;
    xml += `      <category><![CDATA[${label}]]></category>\n`;
    if (post.state) {
      xml += `      <category><![CDATA[${post.state}]]></category>\n`;
    }
    xml += `      <description><![CDATA[${escapeXml(shortDesc)}]]></description>\n`;
    xml += `      <content:encoded><![CDATA[${itemHtml}]]></content:encoded>\n`;
    xml += `    </item>\n`;
  });

  xml += `  </channel>\n`;
  xml += `</rss>`;

  return xml;
}

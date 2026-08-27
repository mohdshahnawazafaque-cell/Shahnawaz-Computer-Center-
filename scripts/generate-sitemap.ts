#!/usr/bin/env node
/**
 * Standalone CLI Sitemap Crawler & Generator Script
 * 
 * Usage:
 *   npx tsx scripts/generate-sitemap.ts
 *   npm run generate-sitemap
 */
import { generateAndSaveSitemap } from '../server/sitemapGenerator';

async function run() {
  console.log('🚀 Starting automated Sitemap.xml crawl & generation...');
  const startTime = Date.now();
  
  const baseUrl = process.env.APP_URL || 'https://shahnawazcomputercenter.in';
  const result = generateAndSaveSitemap({
    baseUrl,
    reason: 'cli_crawl_script',
    saveToDisk: true,
  });

  const duration = Date.now() - startTime;
  console.log('\n=============================================');
  console.log('✅ SITEMAP GENERATION COMPLETED SUCCESSFULLY');
  console.log('=============================================');
  console.log(`🌐 Base URL:          ${baseUrl}`);
  console.log(`📑 Total URLs:        ${result.stats.totalUrls}`);
  console.log(`💼 Jobs/Vacancies:    ${result.stats.jobsCount}`);
  console.log(`🎫 Admit Cards:       ${result.stats.admitCardsCount}`);
  console.log(`🏆 Results:           ${result.stats.resultsCount}`);
  console.log(`📜 Sarkari Yojana:    ${result.stats.schemesCount}`);
  console.log(`📂 Categories:        ${result.stats.categoriesCount}`);
  console.log(`📄 Static/States:     ${result.stats.staticPagesCount}`);
  console.log(`📦 XML File Size:     ${(result.stats.fileSizeBytes / 1024).toFixed(2)} KB`);
  console.log(`⏱️ Duration:          ${duration} ms`);
  console.log(`📁 Target File:       public/sitemap.xml`);
  console.log('=============================================\n');
}

run().catch((err) => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
});

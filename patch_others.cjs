const fs = require('fs');

// Fix CyberCafeSectionUI.tsx
let uiCode = fs.readFileSync('src/components/CyberCafeSectionUI.tsx', 'utf8');
uiCode = uiCode.replace(/isQuickTool/g, "componentKey === 'DAILY_USE'");
uiCode = uiCode.replace(/toolType/g, "componentKey");
uiCode = uiCode.replace(/t\.title/g, "t.name");
uiCode = uiCode.replace(/tool\.title/g, "tool.name");
fs.writeFileSync('src/components/CyberCafeSectionUI.tsx', uiCode);

// Fix CyberCafeAppBuilderPage.tsx
let appCode = fs.readFileSync('src/pages/CyberCafeAppBuilderPage.tsx', 'utf8');
appCode = appCode.replace(/tool\.title/g, "tool.name");
appCode = appCode.replace(/tool\.description/g, "'Free online tool'");
appCode = appCode.replace(/t\.title/g, "t.name");
fs.writeFileSync('src/pages/CyberCafeAppBuilderPage.tsx', appCode);

// Fix PostSeoModal.tsx
let seoCode = fs.readFileSync('src/components/PostSeoModal.tsx', 'utf8');
seoCode = seoCode.replace(/Share2,\s*Share2,\s*Share2/g, "Share2");
seoCode = seoCode.replace(/Share2,\s*Share2/g, "Share2");
fs.writeFileSync('src/components/PostSeoModal.tsx', seoCode);

// Fix PostDetailPage.tsx
let detailCode = fs.readFileSync('src/pages/PostDetailPage.tsx', 'utf8');
detailCode = detailCode.replace(/Share2,\s*Share2,\s*Share2/g, "Share2");
detailCode = detailCode.replace(/Share2,\s*Share2/g, "Share2");
fs.writeFileSync('src/pages/PostDetailPage.tsx', detailCode);

// Fix CyberCafeToolViewerPage.tsx
let viewCode = fs.readFileSync('src/pages/CyberCafeToolViewerPage.tsx', 'utf8');
viewCode = viewCode.replace(/<SEOHead title=\{`\$\{tool\.name\} - Cyber Cafe Tools`\} \/>/, "<SEOHead title={`" + "${tool.name}" + " - Cyber Cafe Tools`} description='Cyber cafe tool' />");
fs.writeFileSync('src/pages/CyberCafeToolViewerPage.tsx', viewCode);


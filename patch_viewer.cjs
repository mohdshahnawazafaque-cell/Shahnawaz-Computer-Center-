const fs = require('fs');
let code = fs.readFileSync('src/pages/CyberCafeToolViewerPage.tsx', 'utf8');

if (!code.includes('description=')) {
  code = code.replace(/<SEOHead title=\{`\$\{tool\.name\} - Cyber Cafe Tools`\} \/>/, "<SEOHead title={`" + "${tool.name}" + " - Cyber Cafe Tools`} description={`Use ${tool.name} for free in your browser.`} />");
  fs.writeFileSync('src/pages/CyberCafeToolViewerPage.tsx', code);
}

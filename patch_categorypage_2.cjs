const fs = require('fs');
let code = fs.readFileSync('src/pages/CategoryPage.tsx', 'utf8');

// Replace the <RecentPostsWidget ... /> block
const widgetRegex = /<RecentPostsWidget[\s\S]*?\/>/g;
code = code.replace(widgetRegex, '');

fs.writeFileSync('src/pages/CategoryPage.tsx', code);

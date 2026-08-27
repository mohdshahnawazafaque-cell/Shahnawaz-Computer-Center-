const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldRoutes = `    if (
      currentPath.startsWith('/post/') ||
      currentPath.startsWith('/jobs/') ||
      currentPath.startsWith('/admit-card/') ||
      currentPath.startsWith('/result/') ||
      currentPath.startsWith('/sarkari-yojana/')
    ) {`;

const newRoutes = `    if (
      currentPath.startsWith('/post/') ||
      currentPath.startsWith('/sarkari-yojana/')
    ) {`;

code = code.replace(oldRoutes, newRoutes);

fs.writeFileSync('src/App.tsx', code);

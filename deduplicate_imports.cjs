const fs = require('fs');

function deduplicateLucideImports(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(/import\s*\{(.*?)\}\s*from\s*'lucide-react';/s, (match, imports) => {
    const importList = imports.split(',').map(i => i.trim()).filter(i => i);
    const uniqueImports = [...new Set(importList)];
    return `import { ${uniqueImports.join(', ')} } from 'lucide-react';`;
  });
  fs.writeFileSync(filePath, code);
}

deduplicateLucideImports('src/components/PostSeoModal.tsx');
deduplicateLucideImports('src/pages/PostDetailPage.tsx');


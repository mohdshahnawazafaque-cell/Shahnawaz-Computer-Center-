const fs = require('fs');
let code = fs.readFileSync('src/data/cyberCafeData.ts', 'utf8');

// Fix the import line which should have it
code = code.replace(/import\s*\{(.*?)\} from 'lucide-react';/s, (match, imports) => {
  if (!imports.includes('Briefcase')) {
    return `import {${imports}, Briefcase} from 'lucide-react';`;
  }
  return match;
});

// Fix the accidental property addition
code = code.replace(/icon: Edit2, Briefcase,/g, "icon: Edit2,");

fs.writeFileSync('src/data/cyberCafeData.ts', code);

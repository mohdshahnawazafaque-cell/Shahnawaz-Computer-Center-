const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

code = code.replace(
  /interface HomePageProps \{\n  onNavigate: \(path: string\) => void;\n\}/,
  `interface HomePageProps {\n  onNavigate: (path: string) => void;\n  onSelectPost?: any;\n  onOpenSearch?: any;\n  onOpenTools?: any;\n}`
);

fs.writeFileSync('src/pages/HomePage.tsx', code);

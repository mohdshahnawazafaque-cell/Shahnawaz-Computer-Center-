const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// I need to just remove the Wallet button.
code = code.replace(/<button\s*onClick=\{\(\) => onNavigate\('\/wallet'\)\}[\s\S]*?<\/button>/, '');

fs.writeFileSync('src/pages/HomePage.tsx', code);

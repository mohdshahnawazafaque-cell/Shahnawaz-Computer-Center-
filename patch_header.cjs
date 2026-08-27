const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Remove wallet from nav links
code = code.replace(/    \{ name: 'Dashboard & Wallet', path: '\/wallet' \},\n/, '');

// Remove Wallet from mobile menu
code = code.replace(/<button\s*onClick=\{\(\) => handleNavClick\('\/wallet'\)\}[\s\S]*?<\/button>/g, '');
code = code.replace(/<button\s*onClick=\{\(\) => onNavigate\('\/wallet'\)\}[\s\S]*?<\/button>/g, '');

fs.writeFileSync('src/components/Header.tsx', code);

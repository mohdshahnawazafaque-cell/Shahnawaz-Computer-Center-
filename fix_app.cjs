const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/if \(currentPath === '\/wallet'\) \{\s*\}/, '');
code = code.replace(/if \(currentPath === '\/print-services'\) \{\s*return <PrintServicesPage onNavigate=\{navigate\} \/>;\s*\}/, '');
fs.writeFileSync('src/App.tsx', code);

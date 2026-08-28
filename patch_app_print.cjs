const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!app.includes('import { PrintServicesPage }')) {
  app = app.replace(
    /import \{ HomePage \} from '\.\/pages\/HomePage';/,
    "import { PrintServicesPage } from './pages/PrintServicesPage';\nimport { HomePage } from './pages/HomePage';"
  );
}

// Add route
if (!app.includes("currentPath === '/print-services'")) {
  app = app.replace(
    /if \(currentPath === '\/services'\) \{/,
    "if (currentPath === '/print-services') {\n      return <PrintServicesPage onNavigate={navigate} />;\n    }\n    if (currentPath === '/services') {"
  );
}
fs.writeFileSync('src/App.tsx', app);

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Add to Desktop Nav
if (!header.includes("path: '/print-services'")) {
  header = header.replace(
    /    \{ name: 'Services', path: '\/services' \},/,
    "    { name: 'Free Print', path: '/print-services' },\n    { name: 'Services', path: '/services' },"
  );
}

fs.writeFileSync('src/components/Header.tsx', header);

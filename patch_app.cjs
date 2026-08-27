const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
code = code.replace(
  "import { PrintPortalApp } from './print-portal/PrintPortalApp';",
  "import { WalletProvider } from './context/WalletContext';\nimport { WalletPage } from './pages/WalletPage';\nimport { PrintServicesPage } from './pages/PrintServicesPage';"
);

// Remove PrintPortalApp check
code = code.replace(
  `  if (currentPath.startsWith('/print-portal')) {
    return <PrintPortalApp currentPath={currentPath} onNavigate={navigate} />;
  }`,
  ""
);

// Add routes
const routesMatch = `    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }`;
const routesReplacement = `    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    if (currentPath === '/wallet') {
      return <WalletPage />;
    }
    if (currentPath === '/print-services') {
      return <PrintServicesPage onNavigate={navigate} />;
    }`;
code = code.replace(routesMatch, routesReplacement);

// Add WalletProvider
code = code.replace("<ThemeProvider>", "<WalletProvider>\n        <ThemeProvider>");
code = code.replace("</ThemeProvider>", "</ThemeProvider>\n      </WalletProvider>");

fs.writeFileSync('src/App.tsx', code);

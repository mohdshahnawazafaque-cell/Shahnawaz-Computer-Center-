const fs = require('fs');

// 1. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/import \{ PrintServicesPage \} from '\.\/pages\/PrintServicesPage';\n/, '');
app = app.replace(/<Route path="\/print-services" element=\{<PrintServicesPage onNavigate=\{handleNavigate\} \/>\} \/>\n/, '');
app = app.replace(/if \(currentPath === '\/print-services'\) \{\n\s*return <PrintServicesPage onNavigate=\{handleNavigate\} \/>;\n\s*\}/, '');
fs.writeFileSync('src/App.tsx', app);

// 2. Header.tsx
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace(/\s*\{ name: 'Print Services', path: '\/print-services' \},/, '');
header = header.replace(/\s*<button\s*onClick=\{\(\) => handleNavClick\('\/print-services'\)\}[\s\S]*?<\/button>/, '');
header = header.replace(/\s*<button\s*onClick=\{\(\) => onNavigate\('\/print-services'\)\}[\s\S]*?<\/button>/, '');
fs.writeFileSync('src/components/Header.tsx', header);

// 3. Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/\s*<li>\s*<button onClick=\{\(\) => onNavigate\('\/print-services'\)\}[\s\S]*?<\/li>/, '');
fs.writeFileSync('src/components/Footer.tsx', footer);

// 4. HomePage.tsx
let home = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
home = home.replace(/\s*<button \s*onClick=\{\(\) => onNavigate\('\/print-services'\)\}[\s\S]*?<\/button>/, '');
home = home.replace(/\s*\{\/\* Print Services \*\/\}\s*<div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-\[#990000\] transition-colors p-6 flex flex-col items-start cursor-pointer group" onClick=\{\(\) => onNavigate\('\/print-services'\)\}>[\s\S]*?<\/div>/, '');
fs.writeFileSync('src/pages/HomePage.tsx', home);


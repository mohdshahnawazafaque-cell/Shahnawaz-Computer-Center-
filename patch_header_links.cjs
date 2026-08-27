const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const oldMainNav = `  const mainNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Latest Job', path: '/category/latest-jobs' },
    { name: 'Admit Card', path: '/category/admit-card' },
    { name: 'Result', path: '/category/result' },
    { name: 'Admission', path: '/category/admission' },
    { name: 'Syllabus', path: '/category/syllabus' },
    { name: 'Answer Key', path: '/category/answer-key' },
  ];`;

const newMainNav = `  const mainNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Print Services', path: '/print-services' },
    { name: 'Sarkari Yojana', path: '/category/sarkari-yojana' },
    { name: 'Documents / Certificate', path: '/category/documents' },
    { name: 'Services (Cyber Cafe)', path: '/services' },
  ];`;

const oldMoreNav = `  const moreNavLinks = [
    { name: 'Sarkari Yojana', path: '/category/sarkari-yojana' },
    { name: 'Cyber Cafe Workspace', path: '/workspace' },
    { name: 'Documents / Certificate', path: '/category/documents' },
    { name: 'Scholarship', path: '/category/scholarship' },
    { name: 'Services (Cyber Cafe)', path: '/services' },
    { name: 'Contact Us', path: '/contact' },
  ];`;

const newMoreNav = `  const moreNavLinks = [
    { name: 'Cyber Cafe Workspace', path: '/workspace' },
    { name: 'Scholarship', path: '/category/scholarship' },
    { name: 'Wallet', path: '/wallet' },
    { name: 'Contact Us', path: '/contact' },
  ];`;

code = code.replace(oldMainNav, newMainNav);
code = code.replace(oldMoreNav, newMoreNav);

fs.writeFileSync('src/components/Header.tsx', code);

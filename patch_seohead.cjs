const fs = require('fs');
let code = fs.readFileSync('src/components/SEOHead.tsx', 'utf8');

code = code.replace(
  "'Sarkari Naukri, Sarkari Result, Admit Card, Latest Jobs, Answer Key, Syllabus, Shahnawaz Computer Center'",
  "'Cyber Cafe Services, Online Forms, Document Printing, Sarkari Yojana, PVC Aadhaar, Shahnawaz Computer Center'"
);

fs.writeFileSync('src/components/SEOHead.tsx', code);

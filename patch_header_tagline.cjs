const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  "{settings?.tagline || 'Latest Jobs, Results, Admit Card, Sarkari Yojana & Online Form Updates'}",
  "{settings?.tagline || 'Print Services, Cyber Cafe Work, Sarkari Yojana & Document Assistance'}"
);

fs.writeFileSync('src/components/Header.tsx', code);

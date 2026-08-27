const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');
code = code.replace(
  "{ name: 'Wallet', path: '/wallet' }",
  "{ name: 'Dashboard & Wallet', path: '/wallet' }"
);
fs.writeFileSync('src/components/Header.tsx', code);

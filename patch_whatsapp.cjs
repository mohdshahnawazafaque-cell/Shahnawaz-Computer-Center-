const fs = require('fs');
let code = fs.readFileSync('src/components/WhatsAppTelegramBanner.tsx', 'utf8');

code = code.replace(
  "Get instant notifications for Sarkari Naukri, UP Police, SSC, Admit Card & Sarkari Yojana on WhatsApp.",
  "Get instant notifications for Cyber Cafe Services, Documents, and Sarkari Yojana on WhatsApp."
);

fs.writeFileSync('src/components/WhatsAppTelegramBanner.tsx', code);

const fs = require('fs');
const filePath = 'src/components/FarmerRegistrySection.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(
  "const whatsAppPhone = settings.adminPhone ? settings.adminPhone.replace(/\\D/g, '') : '910000000000';",
  "const whatsAppPhone = settings?.whatsAppNumber ? settings.whatsAppNumber.replace(/[^0-9]/g, '') : '919956078419';"
);

fs.writeFileSync(filePath, content);

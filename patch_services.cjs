const fs = require('fs');
const filePath = 'src/pages/ServicesPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('FarmerRegistrySection')) {
  content = content.replace(
    "import { SarkariYojanaSection } from '../components/SarkariYojanaSection';",
    "import { SarkariYojanaSection } from '../components/SarkariYojanaSection';\nimport { FarmerRegistrySection } from '../components/FarmerRegistrySection';"
  );
  
  content = content.replace(
    "<SarkariYojanaSection isStandalonePage={true} />",
    "<FarmerRegistrySection isStandalonePage={true} />\n        <SarkariYojanaSection isStandalonePage={true} />"
  );
  fs.writeFileSync(filePath, content);
  console.log("Patched ServicesPage.tsx");
} else {
  console.log("Already patched ServicesPage.tsx");
}

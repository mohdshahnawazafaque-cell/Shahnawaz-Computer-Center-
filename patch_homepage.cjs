const fs = require('fs');
const filePath = 'src/pages/HomePage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('FarmerRegistrySection')) {
  content = content.replace(
    "import { SarkariYojanaSection } from '../components/SarkariYojanaSection';",
    "import { SarkariYojanaSection } from '../components/SarkariYojanaSection';\nimport { FarmerRegistrySection } from '../components/FarmerRegistrySection';"
  );
  
  content = content.replace(
    "<SarkariYojanaSection isStandalonePage={false} />",
    "<FarmerRegistrySection isStandalonePage={false} />\n        <SarkariYojanaSection isStandalonePage={false} />"
  );
  fs.writeFileSync(filePath, content);
  console.log("Patched HomePage.tsx");
} else {
  console.log("Already patched HomePage.tsx");
}

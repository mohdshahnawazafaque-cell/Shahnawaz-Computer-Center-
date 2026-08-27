const fs = require('fs');
const filePath = 'src/data/sarkariYojanaServicesData.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace category for fr-* items
const frPattern = /id:\s*'fr-\d+',[\s\S]*?category:\s*'14\. Kisan & Agriculture'/g;
content = content.replace(frPattern, (match) => {
  return match.replace("'14. Kisan & Agriculture'", "'26. Farmer Registry (UP)'");
});

fs.writeFileSync(filePath, content);
console.log("Updated categories for FR items");

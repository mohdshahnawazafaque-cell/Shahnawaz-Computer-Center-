const fs = require('fs');

const dataStr = fs.readFileSync('src/data/sarkariYojanaServicesData.ts', 'utf8');

// It's a TS file with `export const sarkariYojanaServicesData: ServiceData[] = [ ... ]`
// Let's just use string replace. There are multiple objects. 
// A regex to match `{ id: ..., category: '16. Sarkari Naukri', ... },`
const cleanedDataStr = dataStr.replace(/\{\s*id:[^}]*category:\s*'16\. Sarkari Naukri'[^}]*\},/g, '');

fs.writeFileSync('src/data/sarkariYojanaServicesData.ts', cleanedDataStr);

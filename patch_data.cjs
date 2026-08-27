const fs = require('fs');
let code = fs.readFileSync('src/data/sarkariYojanaServicesData.ts', 'utf8');

// The category list in the array
code = code.replace(
  `  "16. Sarkari Naukri",\n`,
  ``
);

// We need to filter out any objects that have category: '16. Sarkari Naukri'
// A quick regex or array filter if it's evaluated? Actually the file is TypeScript, so it exports `sarkariYojanaServicesData`.
// We can just use a regex to replace those entries.

// Or since it's an array of objects, we can run a quick node script to write a regex replacement that removes all objects with "category: '16. Sarkari Naukri'".
// Even better: since it's just the last few items in the file, we can look for `category: '16. Sarkari Naukri'` and remove from there to the end of the array.

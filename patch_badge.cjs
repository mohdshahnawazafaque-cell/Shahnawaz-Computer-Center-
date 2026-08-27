const fs = require('fs');
const filePath = 'src/components/SarkariYojanaSection.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const search = `{item.category.replace(/^[0-9]+\\.\\s*/, '')}`;
const replace = `{item.category.includes('Farmer Registry') ? 'किसान सेवाएँ' : item.category.replace(/^[0-9]+\\.\\s*/, '')}`;

content = content.replace(search, replace);
fs.writeFileSync(filePath, content);
console.log("Patched badge");

const fs = require('fs');
const filePath = 'src/components/FarmerRegistrySection.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace("encodeURIComponent(\\`Hello Shahnawaz Computer Center, please help me with applying for: \\${item.name}\\`)", "encodeURIComponent('Hello Shahnawaz Computer Center, please help me with applying for: ' + item.name)");
content = content.replace("encodeURIComponent(\\`Hello Shahnawaz Computer Center, I want you to fill the form for: \\${item.name}. Please guide me.\\`)", "encodeURIComponent('Hello Shahnawaz Computer Center, I want you to fill the form for: ' + item.name + '. Please guide me.')");

fs.writeFileSync(filePath, content);

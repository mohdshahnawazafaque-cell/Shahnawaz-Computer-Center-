const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if(!code.includes("import { CyberCafeToolViewerPage }")) {
  code = code.replace(
    "import { CyberCafeAppBuilderPage } from './pages/CyberCafeAppBuilderPage';",
    "import { CyberCafeAppBuilderPage } from './pages/CyberCafeAppBuilderPage';\nimport { CyberCafeToolViewerPage } from './pages/CyberCafeToolViewerPage';"
  );
}

if(!code.includes("currentPath.startsWith('/workspace/tool/')")) {
  code = code.replace(
    "if (currentPath === '/workspace') {",
    "if (currentPath.startsWith('/workspace/tool/')) {\n      return <CyberCafeToolViewerPage onNavigate={navigate} currentPath={currentPath} />;\n    }\n\n    if (currentPath === '/workspace') {"
  );
}

fs.writeFileSync('src/App.tsx', code);

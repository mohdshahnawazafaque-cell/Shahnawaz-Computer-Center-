const fs = require('fs');
let code = fs.readFileSync('src/pages/CyberCafeHubPage.tsx', 'utf8');

code = code.replace("import { useNavigate } from 'react-router-dom';", "");
code = code.replace("export const CyberCafeHubPage: React.FC = () => {", 
  "interface CyberCafeHubPageProps { onNavigate: (path: string) => void; currentPath?: string; }\nexport const CyberCafeHubPage: React.FC<CyberCafeHubPageProps> = ({ onNavigate }) => {");
code = code.replace("const navigate = useNavigate();", "");
code = code.replace(/navigate\(/g, "onNavigate(");

fs.writeFileSync('src/pages/CyberCafeHubPage.tsx', code);

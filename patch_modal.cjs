const fs = require('fs');
let code = fs.readFileSync('src/components/SarkariToolsModal.tsx', 'utf8');

// 1. Add 'qrcode' to types
code = code.replace(
  "initialTab?: 'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter';",
  "initialTab?: 'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter' | 'qrcode';"
);
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter'>(initialTab);",
  "const [activeTab, setActiveTab] = useState<'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter' | 'qrcode'>(initialTab);"
);

// 2. Import QrCode from lucide-react
code = code.replace(
  "Wallet,",
  "Wallet,\n  QrCode,"
);

// 3. Import QRCodeGeneratorTab
code = code.replace(
  "import { SalaryCalculatorTab } from './SalaryCalculatorTab';",
  "import { SalaryCalculatorTab } from './SalaryCalculatorTab';\nimport { QRCodeGeneratorTab } from './QRCodeGeneratorTab';"
);

// 4. Add tab to mapping
code = code.replace(
  "{ id: 'salary', label: '💰 In-Hand Salary Calculator', icon: Wallet },",
  "{ id: 'salary', label: '💰 In-Hand Salary Calculator', icon: Wallet },\n            { id: 'qrcode', label: '🔳 QR Code Generator', icon: QrCode },"
);

// 5. Add tab content
code = code.replace(
  "{/* 4. ONLINE RESUME / CV MAKER TAB */}",
  "{activeTab === 'qrcode' && <QRCodeGeneratorTab />}\n          {/* 4. ONLINE RESUME / CV MAKER TAB */}"
);

fs.writeFileSync('src/components/SarkariToolsModal.tsx', code);

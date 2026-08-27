const fs = require('fs');
let code = fs.readFileSync('src/pages/PrintServicesPage.tsx', 'utf8');

// Remove wallet import
code = code.replace(/import \{ useWallet \} from '\.\.\/context\/WalletContext';\n/, '');

// Remove useWallet usage
code = code.replace(/  const \{ balance, processServiceOrder \} = useWallet\(\);\n/, '');

// Make prices 0, or just remove price from the display
code = code.replace(/<p className="text-sm font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900\/30 px-2 py-1 rounded inline-block mt-1">₹\{s.price.toFixed\(2\)\}<\/p>/g, '<p className="text-sm font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded inline-block mt-1">Free</p>');

// Mock processServiceOrder
code = code.replace(/processServiceOrder\(selectedService.price, `Order: \$\{selectedService.name\} - \$\{orderInput\}`\)/g, 'true');

// Remove balance checks
code = code.replace(/if \(balance < selectedService.price\) \{[\s\S]*?return;\n      \}/g, '');

// Remove Wallet Balance section in Modal
code = code.replace(/<div className="text-right">\s*<p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Wallet Balance<\/p>[\s\S]*?<\/div>/g, '');

// Remove Service Fee pricing
code = code.replace(/<p className="text-xl font-black text-slate-900 dark:text-white">₹\{selectedService.price.toFixed\(2\)\}<\/p>/g, '<p className="text-xl font-black text-emerald-600 dark:text-emerald-400">Free</p>');

// Update button text
code = code.replace(/Confirm & Pay ₹\{selectedService.price\}/g, 'Confirm Request');

// Remove Go to Wallet link
code = code.replace(/\{balance < selectedService.price && \([\s\S]*?\}\)/g, '');

fs.writeFileSync('src/pages/PrintServicesPage.tsx', code);

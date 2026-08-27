const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const desktopMatch = `            <button
              onClick={() => handleNavClick('/print-portal')}
              className="text-[11px] font-bold text-white bg-indigo-600 px-2 py-1 rounded hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3 h-3" />
              <span>Print Portal</span>
            </button>`;

const desktopReplace = `            <button
              onClick={() => handleNavClick('/print-services')}
              className="text-[11px] font-bold text-amber-300 bg-[#990000] border border-amber-300 px-2 py-1 rounded hover:bg-amber-400 hover:text-[#990000] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3 h-3" />
              <span>Print Services</span>
            </button>
            <button
              onClick={() => handleNavClick('/wallet')}
              className="text-[11px] font-bold text-white bg-emerald-600 px-2 py-1 rounded hover:bg-emerald-500 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Wallet</span>
            </button>`;

const mobileMatch = `            <button
              onClick={() => handleNavClick('/print-portal')}
              className="w-full text-left py-2 px-3 rounded text-indigo-300 font-bold hover:bg-[#132C52] hover:text-white flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Portal
            </button>`;

const mobileReplace = `            <button
              onClick={() => handleNavClick('/print-services')}
              className="w-full text-left py-2 px-3 rounded text-amber-300 font-bold hover:bg-[#132C52] hover:text-white flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Services
            </button>
            <button
              onClick={() => handleNavClick('/wallet')}
              className="w-full text-left py-2 px-3 rounded text-emerald-400 font-bold hover:bg-[#132C52] hover:text-white flex items-center gap-2"
            >
              Wallet
            </button>`;

code = code.replace(desktopMatch, desktopReplace);
code = code.replace(mobileMatch, mobileReplace);

fs.writeFileSync('src/components/Header.tsx', code);

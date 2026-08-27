const fs = require('fs');
const filePath = 'src/components/SarkariYojanaSection.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const search = `                <div className="text-center">
                  <a
                    href={\`https://wa.me/\${whatsAppPhone}?text=\${encodeURIComponent(\`Hello Shahnawaz Computer Center, I want you to fill the form for: \${item.name}. Please guide me.\`)}\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-500 hover:text-emerald-700 font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Need center assistance with documents? Click to WhatsApp</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </a>
                </div>`;

const replace = `                {item.note ? (
                  <div className="text-center bg-slate-50 border border-slate-200 py-1.5 px-2 rounded-lg">
                    <span className="text-[10px] text-slate-600 font-medium inline-flex items-center gap-1">
                      {item.note}
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <a
                      href={\`https://wa.me/\${whatsAppPhone}?text=\${encodeURIComponent(\`Hello Shahnawaz Computer Center, I want you to fill the form for: \${item.name}. Please guide me.\`)}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-500 hover:text-emerald-700 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Need center assistance with documents? Click to WhatsApp</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}`;

content = content.replace(search, replace);
fs.writeFileSync(filePath, content);

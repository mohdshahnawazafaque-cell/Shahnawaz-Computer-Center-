const fs = require('fs');
let code = fs.readFileSync('src/pages/CyberCafeHubPage.tsx', 'utf8');

// Replace the layout structure
code = code.replace(
  /<div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">[\s\S]*?\{\/\* Tools Grid \*\/\}/,
  `<div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Grid - High Contrast for Mobile & Desktop */}
        <div className="mb-8 overflow-hidden relative">
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={\`shrink-0 snap-start flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all w-32 h-32 \${
                selectedCategory === 'ALL'
                  ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-xl scale-105'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#990000] hover:shadow-md'
              }\`}
            >
              <div className={\`w-12 h-12 rounded-full flex items-center justify-center \${selectedCategory === 'ALL' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}\`}>
                <LayoutGrid className={\`w-6 h-6 \${selectedCategory === 'ALL' ? 'text-amber-400' : 'text-slate-500 dark:text-slate-400'}\`} />
              </div>
              <span className="text-xs font-black uppercase text-center leading-tight">All Tools</span>
            </button>
            {CYBER_CAFE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={\`shrink-0 snap-start flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all w-32 h-32 \${
                  selectedCategory === cat.id
                    ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-xl scale-105'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#990000] hover:shadow-md'
                }\`}
              >
                <div className={\`w-12 h-12 rounded-full flex items-center justify-center \${selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}\`}>
                  <cat.icon className={\`w-6 h-6 \${selectedCategory === cat.id ? 'text-amber-400' : 'text-slate-500 dark:text-slate-400'}\`} />
                </div>
                <span className="text-xs font-black uppercase text-center leading-tight">{cat.name.replace(' TOOLS', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}`
);

// We need to also close the new div properly at the end of the file.
// The original structure was:
// <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
//   <div className="lg:w-64 shrink-0">...</div>
//   <div className="flex-1">...</div>
// </div>
// Since I removed the sidebar and replaced the top div, the closing tags are fine.

fs.writeFileSync('src/pages/CyberCafeHubPage.tsx', code);

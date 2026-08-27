import React from 'react';
import { ExternalLink, Link2, Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ImportantLink } from '../types';

interface ImportantLinksTableProps {
  links: ImportantLink[];
  postId: string;
  postTitle: string;
}

export const ImportantLinksTable: React.FC<ImportantLinksTableProps> = ({
  links,
  postId,
  postTitle,
}) => {
  const activeLinks = (links || []).filter((l) => l.enabled).sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeLinks.length === 0) return null;

  const handleLinkClick = async (link: ImportantLink) => {
    try {
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkId: link.id,
          linkName: link.name,
          postId,
          postTitle,
          url: link.url,
        }),
      }).catch(() => {});
    } catch {}
  };

  return (
    <section id="important-links-section" className="my-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-[#0B2545] shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#0B2545] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-black tracking-wide uppercase">
              SOME USEFUL IMPORTANT LINKS
            </h3>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-semibold bg-red-600 px-2 py-0.5 rounded text-white uppercase">
            Direct Server Links
          </span>
        </div>

        {/* Two-column High-Contrast Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-600 text-xs font-black uppercase text-slate-700 dark:text-slate-200 tracking-wider">
                <th className="py-2.5 px-4 w-2/3 border-r border-slate-300 dark:border-slate-600">LINK TITLE / DETAILS</th>
                <th className="py-2.5 px-4 w-1/3 text-center">CLICK TO OPEN / APPLY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {activeLinks.map((link, idx) => (
                <tr
                  key={link.id || idx}
                  className={`hover:bg-blue-50/70 transition-colors ${
                    idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/60'
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="leading-snug">{link.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <a
                      id={`important-link-btn-${idx}`}
                      href={link.url}
                      target={link.openInNewTab ? '_blank' : '_self'}
                      rel="noreferrer"
                      onClick={() => handleLinkClick(link)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all transform active:scale-95"
                    >
                      <span>{link.btnText || 'CLICK HERE'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer subtext */}
        <div className="p-3 bg-amber-50 border-t border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Official Source Verification:</strong> All links lead directly to official departmental examination servers (e.g. ssc.gov.in, upsconline.nic.in, uppbpb.gov.in). Shahnawaz Computer Center does not charge any extra fee for accessing official forms.
          </span>
        </div>
      </div>
    </section>
  );
};

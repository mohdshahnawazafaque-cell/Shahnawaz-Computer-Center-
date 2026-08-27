import React, { useMemo } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles,
  MessageCircle,
  FileCheck,
  Globe,
  ChevronRight,
} from 'lucide-react';
import {
  SARKARI_YOJANA_SERVICES_DATA,
} from '../data/sarkariYojanaServicesData';
import { useSettings } from '../context/SettingsContext';

interface FarmerRegistrySectionProps {
  isStandalonePage?: boolean;
}

export const FarmerRegistrySection: React.FC<FarmerRegistrySectionProps> = ({
  isStandalonePage = false,
}) => {
  const { settings } = useSettings();

  const farmerServices = useMemo(() => {
    return SARKARI_YOJANA_SERVICES_DATA.filter(
      (item) => item.category === '26. Farmer Registry (किसान रजिस्ट्री)'
    );
  }, []);

  const whatsAppPhone = settings?.whatsAppNumber ? settings.whatsAppNumber.replace(/[^0-9]/g, '') : '919956078419';

  if (farmerServices.length === 0) return null;

  return (
    <section
      id="farmer-registry-services"
      className={`max-w-7xl mx-auto px-3 sm:px-4 ${isStandalonePage ? 'py-4' : 'my-8'}`}
    >
      {/* SECTION HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-800 text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-emerald-700 relative overflow-hidden mb-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-red-600 text-white flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Government Portals
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> UP Agristack
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-sans">
              Farmer Registry (किसान रजिस्ट्री) Services
            </h2>
            <p className="text-emerald-50 text-xs sm:text-sm font-medium max-w-2xl">
              Complete your farmer registration, check status, verify e-KYC, and link land records (Bhulekh) directly on the official UP Agristack portal.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {farmerServices.map((item) => (
          <div
            key={item.id}
            id={`scheme-card-${item.id}`}
            className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-600 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between group"
          >
            <div>
              {/* Card Badges */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex-shrink-0">
                  किसान सेवाएँ
                </span>
                <div className="flex items-center gap-1">
                  {item.isCentral ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200">
                      Central Govt
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                      {item.state || 'State Govt'}
                    </span>
                  )}
                  {item.isPopular && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                      Popular
                    </span>
                  )}
                </div>
              </div>

              {/* Scheme Title */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-900 leading-snug font-sans">
                {item.name}
              </h3>
              {item.hindiName && (
                <p className="text-xs text-red-700 font-semibold mt-0.5 font-hindi">
                  {item.hindiName}
                </p>
              )}

              {/* Department */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{item.department}</span>
              </p>

              {/* Description */}
              <p className="text-[12px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Primary Open/Apply Button */}
                <a
                  id={`open-scheme-btn-${item.id}`}
                  href={item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-[#990000] hover:bg-red-700 text-amber-300 hover:text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  title={`Open official portal: ${item.name}`}
                >
                  <span>{item.actionText || 'Open / Apply'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Status Check / Guideline secondary button */}
                {item.statusCheckUrl ? (
                  <a
                    id={`status-scheme-btn-${item.id}`}
                    href={item.statusCheckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-blue-50 text-slate-800 dark:text-slate-100 hover:text-blue-900 border border-slate-300 dark:border-slate-600 hover:border-blue-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                    title="Check Application Status / Beneficiary Search"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.statusText || 'Check Status'}</span>
                  </a>
                ) : item.guidelinesUrl ? (
                  <a
                    id={`guideline-scheme-btn-${item.id}`}
                    href={item.guidelinesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-amber-50 text-slate-800 dark:text-slate-100 hover:text-amber-900 border border-slate-300 dark:border-slate-600 hover:border-amber-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                    title="View Official Scheme Guidelines"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-600" />
                    <span>{item.guidelineText || 'Guidelines'}</span>
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent('Hello Shahnawaz Computer Center, please help me with applying for: ' + item.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                    title="Request Assistance via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Center Assist</span>
                  </a>
                )}
              </div>

              {item.note ? (
                <div className="text-center bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 py-1.5 px-2 rounded-lg">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium inline-flex items-center gap-1">
                    {item.note}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <a
                    href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent('Hello Shahnawaz Computer Center, I want you to fill the form for: ' + item.name + '. Please guide me.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-emerald-700 font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Need center assistance with documents? Click to WhatsApp</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

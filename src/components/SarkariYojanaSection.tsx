import React, { useState, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Filter,
  X,
  FileCheck,
  ChevronRight,
  Globe,
  Share2,
  Phone,
  Bookmark,
} from 'lucide-react';
import {
  SARKARI_YOJANA_SERVICES_DATA,
  SARKARI_CATEGORIES,
  GovernmentSchemeService,
} from '../data/sarkariYojanaServicesData';
import { useSettings } from '../context/SettingsContext';

interface SarkariYojanaSectionProps {
  initialCategory?: string;
  isStandalonePage?: boolean;
}

export const SarkariYojanaSection: React.FC<SarkariYojanaSectionProps> = ({
  initialCategory = 'All Schemes & Services',
  isStandalonePage = false,
}) => {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filterType, setFilterType] = useState<'all' | 'popular' | 'central' | 'state'>('all');

  const whatsAppPhone = settings?.whatsAppNumber ? settings.whatsAppNumber.replace(/[^0-9]/g, '') : '919956078419';

  const filteredItems = useMemo(() => {
    return SARKARI_YOJANA_SERVICES_DATA.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All Schemes & Services' && item.category !== selectedCategory) {
        return false;
      }

      // Quick filter
      if (filterType === 'popular' && !item.isPopular) return false;
      if (filterType === 'central' && !item.isCentral) return false;
      if (filterType === 'state' && item.isCentral) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchHindi = item.hindiName ? item.hindiName.toLowerCase().includes(q) : false;
      const matchDept = item.department.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = item.category.toLowerCase().includes(q);

      return matchName || matchHindi || matchDept || matchDesc || matchTags || matchCat;
    });
  }, [searchQuery, selectedCategory, filterType]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Schemes & Services': SARKARI_YOJANA_SERVICES_DATA.length,
    };
    SARKARI_YOJANA_SERVICES_DATA.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <section
      id="sarkari-yojana-online-services"
      className={`max-w-7xl mx-auto px-3 sm:px-4 ${isStandalonePage ? 'py-4' : 'my-8'}`}
    >
      {/* SECTION HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#133A6B] to-[#0B2545] text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-[#1d4677] relative overflow-hidden mb-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-red-600 text-white flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Government Portals
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Direct Apply & Status Links
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-sans">
              Sarkari Yojana & Online Government Services Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Direct official access to all Central & State Government Welfare Schemes, e-Services, Citizen Portals, Aadhaar, PAN, Voter, Ration, Ayushman, Kisan, Labour, and Pension schemes.
            </p>
          </div>

          {/* WhatsApp Form Filling Assistance Quick Action */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3 sm:p-4 rounded-xl flex-shrink-0 flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Need Help with Form Filling?</span>
            </div>
            <p className="text-[11px] text-slate-200">
              Visit Shahnawaz Computer Center or apply via WhatsApp.
            </p>
            <a
              href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent('Hello Shahnawaz Computer Center, I want to apply for a Government Scheme/Online Service. Please help me with required documents and process.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Center Assistance</span>
            </a>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-6 space-y-4">
        {/* Search Input and Quick Filter Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-sarkari-yojana-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name (e.g. PM Kisan, Ayushman, E-Shram, PAN, Ration Card, Voter ID, Bijli Bill)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Segment Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({SARKARI_YOJANA_SERVICES_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'popular'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔥 High Demand
            </button>
            <button
              type="button"
              onClick={() => setFilterType('central')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'central'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Central Govt
            </button>
            <button
              type="button"
              onClick={() => setFilterType('state')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'state'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              State / UP Govt
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter by Category:
            </span>
            <span>Showing {filteredItems.length} schemes / services</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
            {SARKARI_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 border ${
                    isSelected
                      ? 'bg-[#990000] text-white border-[#770000] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SCHEMES GRID DISPLAY */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-6 space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Schemes or Services Found</h3>
          <p className="text-xs text-slate-500">
            No matching result for "{searchQuery}". Try clearing search filters or searching with alternative keywords.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Schemes & Services');
              setFilterType('all');
            }}
            className="px-4 py-2 bg-[#0B2545] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`scheme-card-${item.id}`}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Card Badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 flex-shrink-0">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1">
                    {item.isCentral ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-700">
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
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-900 leading-snug font-sans">
                  {item.name}
                </h3>

                {item.hindiName && (
                  <p className="text-xs text-red-700 font-semibold mt-0.5 font-hindi">
                    {item.hindiName}
                  </p>
                )}

                {/* Department */}
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{item.department}</span>
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Verified Official Domain Badge */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Official Portal</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[10px] truncate max-w-[150px]">
                    {item.officialUrl.replace('https://', '').replace('http://', '').replace(/\/$/, '')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
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
                      className="w-full py-2 px-3 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-300 hover:border-blue-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                      title="Check Application Status / Beneficiary Search"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.statusText || "Check Status"}</span>
                    </a>
                  ) : item.guidelinesUrl ? (
                    <a
                      id={`guideline-scheme-btn-${item.id}`}
                      href={item.guidelinesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-slate-100 hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                      title="View Official Scheme Guidelines"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.guidelineText || "Guidelines"}</span>
                    </a>
                  ) : (
                    <a
                      href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(`Hello Shahnawaz Computer Center, please help me with applying for: ${item.name}`)}`}
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

                {/* Subtext Link to get filled at center */}
                {item.note ? (
                  <div className="text-center bg-slate-50 border border-slate-200 py-1.5 px-2 rounded-lg">
                    <span className="text-[10px] text-slate-600 font-medium inline-flex items-center gap-1">
                      {item.note}
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <a
                      href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(`Hello Shahnawaz Computer Center, I want you to fill the form for: ${item.name}. Please guide me.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-500 hover:text-emerald-700 font-medium inline-flex items-center gap-1 transition-colors"
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
      )}
    </section>
  );
};

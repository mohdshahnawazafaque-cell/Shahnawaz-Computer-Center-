import React, { useState } from 'react';
import {
  Monitor,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Share2,
  Rss,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { SharePortalButton } from './SharePortalButton';
import { RssFeedModal } from './RssFeedModal';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, categories } = useSettings();
  const [isRssModalOpen, setIsRssModalOpen] = useState(false);

  const handleNavClick = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(path);
  };

  return (
    <footer id="main-portal-footer" className="bg-[#0B2545] text-slate-200 border-t-4 border-red-600 mt-12">
      {/* Top Footer with highlights */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white flex flex-col items-center justify-center font-black shadow-md border border-amber-400">
                <span className="text-[11px] text-amber-300">SCC</span>
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                  {settings?.websiteName || 'SHAHNAWAZ COMPUTER CENTER'}
                </h3>
                <p className="text-[11px] text-amber-400 font-semibold">
                  Online Forms & Government Updates
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {settings?.footerText ||
                'Your premier independent destination for latest Government Jobs, Sarkari Results, Admit Cards, Answer Keys, Sarkari Yojana, UP Scholarships, and professional Computer Center form filling services.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {settings?.whatsAppUrl && (
                <a
                  href={settings.whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                  title="Official WhatsApp Channel"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings?.telegramUrl && (
                <a
                  href={settings.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
                  title="Official Telegram Channel"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {settings?.contactNumber && (
                <a
                  href={`tel:${settings.contactNumber}`}
                  className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors font-bold"
                  title="Call Shahnawaz Computer Center"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              <button
                id="footer-rss-btn"
                onClick={() => setIsRssModalOpen(true)}
                className="p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors font-bold flex items-center gap-1.5"
                title="RSS Feeds & Syndication Updates"
              >
                <Rss className="w-4 h-4" />
              </button>
              <SharePortalButton variant="footer" />
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-black uppercase text-amber-400 tracking-wider mb-4 border-b border-blue-800 pb-2">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNavClick('/category/sarkari-naukri')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Sarkari Naukri / Latest Jobs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/category/admit-card')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Admit Card & Hall Ticket</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/category/result')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Sarkari Results & Score Cards</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/category/answer-key')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Answer Key & Challenges</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/category/sarkari-yojana')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Sarkari Yojana & PM Schemes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/category/scholarship')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>UP Scholarship & NSP Forms</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/category/admission')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>University & NEET Admission</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Center Services */}
          <div>
            <h4 className="text-sm font-black uppercase text-amber-400 tracking-wider mb-4 border-b border-blue-800 pb-2">
              Center Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNavClick('/services')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>Online Exam Form Filling</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/services')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>High-Speed Laser Print & Scan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/services')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>Professional Resume / CV</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/services')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>5-Minute Passport Size Photos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/services')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>PAN Card New & Corrections</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/services')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>PVC Aadhaar Card Printing</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information & Center Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase text-amber-400 tracking-wider mb-4 border-b border-blue-800 pb-2">
              Center Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{settings?.address || 'Shahnawaz Computer Center, Tambour, District Sitapur, Uttar Pradesh, India'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{settings?.timing || 'Mon-Sat: 8:00 AM - 8:30 PM'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{settings?.contactNumber || '+91 99560 78419'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="truncate">{settings?.contactEmail || 'mohdshahnawaz.afaque@gmail.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Independent Portal Legal Disclaimer */}
        <div className="mt-8 pt-6 border-t border-blue-900/80 bg-blue-950/60 p-4 rounded-xl text-xs text-slate-300 space-y-2 border border-blue-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Independent Information Portal Disclaimer</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-300">
            <strong>Important Notice:</strong> <em>Shahnawaz Computer Center</em> is an independent informational and digital assistance portal. This website is <strong>NOT</strong> an official government website and is <strong>NOT</strong> associated, affiliated, authorized, or endorsed by any Government Department, Ministry, Staff Selection Commission (SSC), UPSC, Railway Recruitment Board (RRB), State Police Boards, or official examination authorities. All logos, official names, and trademarks belong to their respective government entities. Candidates are strictly advised to cross-verify all recruitment details, exam dates, syllabus, and notifications on the respective official government portals before taking action.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-blue-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} <strong>SHAHNAWAZ COMPUTER CENTER</strong>. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => handleNavClick('/')} className="hover:text-white">
              Home
            </button>
            <button onClick={() => handleNavClick('/services')} className="hover:text-white">
              Services
            </button>
            <button onClick={() => handleNavClick('/contact')} className="hover:text-white">
              Contact & Location
            </button>
            <a href="/sitemap.xml" target="_blank" className="hover:text-white">
              Sitemap
            </a>
            <button
              id="bottom-bar-rss-btn"
              onClick={() => setIsRssModalOpen(true)}
              className="hover:text-orange-400 text-slate-300 flex items-center gap-1 font-semibold"
            >
              <Rss className="w-3 h-3 text-orange-400" />
              <span>RSS Feeds</span>
            </button>
            <button onClick={() => handleNavClick('/admin/login')} className="hover:text-amber-400 text-slate-400">
              Admin Access
            </button>
          </div>
        </div>
      </div>

      {/* RSS Syndication Modal */}
      <RssFeedModal isOpen={isRssModalOpen} onClose={() => setIsRssModalOpen(false)} />
    </footer>
  );
};

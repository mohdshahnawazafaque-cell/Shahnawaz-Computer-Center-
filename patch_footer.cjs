const fs = require('fs');

let code = `import React, { useState } from 'react';
import { RssFeedModal } from './RssFeedModal';
import { useSettings } from '../context/SettingsContext';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  Rss
} from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [isRssModalOpen, setIsRssModalOpen] = useState(false);

  const handleNavClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <footer className="w-full bg-[#071529] text-white border-t-[3px] border-[#990000]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white tracking-wider leading-none">
                SHAHNAWAZ
              </h3>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mt-1">
                Computer Center
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              We provide professional online form filling, government scheme applications, instant laser printing, smart PVC card printing, photo making, and document verification services.
            </p>
          </div>

          {/* Quick Services Links */}
          <div>
            <h4 className="text-sm font-black uppercase text-amber-400 tracking-wider mb-4 border-b border-blue-800 pb-2">
              Popular Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('/print-services')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Print Services</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/category/sarkari-yojana')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Sarkari Yojana & PM Schemes</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/category/documents')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Documents & Certificates</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/services')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Cyber Cafe Work</span>
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
                <button onClick={() => handleNavClick('/services')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>High-Speed Laser Print & Scan</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/services')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>Professional Resume / CV</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/services')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>5-Minute Passport Size Photos</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/services')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>PAN Card & Voter ID Services</span>
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
            <button onClick={() => handleNavClick('/admin/login')} className="hover:text-amber-400 text-slate-400">
              Admin Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
`;

fs.writeFileSync('src/components/Footer.tsx', code);

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Phone,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  UserCheck,
  LogIn,
  Rss,
  Bell,
  BellRing,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { RssFeedModal } from './RssFeedModal';
import { getNotificationPermissionState, getExistingPushSubscription } from '../utils/pushManager';

interface HeaderProps {
  onOpenSearch: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenTools?: (tab?: 'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter') => void;
  onOpenPushModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  currentPath,
  onNavigate,
  onOpenTools,
  onOpenPushModal,
}) => {
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [isRssModalOpen, setIsRssModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    getExistingPushSubscription().then((sub) => {
      setIsSubscribed(Boolean(sub));
    });
  }, []);

  const mainNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Latest Job', path: '/category/latest-jobs' },
    { name: 'Admit Card', path: '/category/admit-card' },
    { name: 'Result', path: '/category/result' },
    { name: 'Admission', path: '/category/admission' },
    { name: 'Syllabus', path: '/category/syllabus' },
    { name: 'Answer Key', path: '/category/answer-key' },
  ];

  const moreNavLinks = [
    { name: 'Sarkari Yojana', path: '/category/sarkari-yojana' },
    { name: 'Cyber Cafe Workspace', path: '/workspace' },
    { name: 'Documents / Certificate', path: '/category/documents' },
    { name: 'Scholarship', path: '/category/scholarship' },
    { name: 'Services (Cyber Cafe)', path: '/services' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    onNavigate(path);
  };

  return (
    <header id="main-sarkari-header" className="w-full bg-white select-none">
      {/* 1. TOP BRAND RED BANNER */}
      <div className="bg-[#990000] text-white py-4 px-4 text-center border-b-2 border-[#770000] shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center cursor-pointer" onClick={() => handleNavClick('/')}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans text-white drop-shadow-xs uppercase">
            {settings?.websiteName || 'SHAHNAWAZ COMPUTER CENTER'}
          </h1>
          <div className="text-xs sm:text-sm md:text-base font-bold text-amber-200 tracking-wide mt-1">
            {settings?.tagline || 'Latest Jobs, Results, Admit Card, Sarkari Yojana & Online Form Updates'}
          </div>
        </div>
      </div>

      {/* 2. DARK NAVY BLUE HORIZONTAL NAV BAR (Exact screenshot styling) */}
      <nav className="bg-[#0A1D37] text-white sticky top-0 z-40 border-b border-[#051122] shadow-md">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 flex items-center justify-between">
          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-0.5 text-xs lg:text-[13px] font-bold">
            {mainNavLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3 py-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#990000] text-white font-black'
                      : 'text-white hover:bg-[#132C52] hover:text-amber-300'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}

            {/* More Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="px-3 py-2.5 text-white hover:bg-[#132C52] hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute left-0 mt-0 w-48 bg-[#0A1D37] border border-slate-700 shadow-xl py-1 z-50 rounded-b-md"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {moreNavLinks.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.path)}
                      className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#990000] hover:text-white transition-colors cursor-pointer block font-semibold"
                    >
                      {item.name}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      onOpenTools?.('salary');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-amber-300 hover:bg-[#990000] hover:text-white transition-colors cursor-pointer block font-bold border-t border-slate-700"
                  >
                    💰 In-Hand Salary Calculator (7th CPC)
                  </button>
                  <button
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      onOpenTools?.('image');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-[#990000] hover:text-white transition-colors cursor-pointer block font-medium"
                  >
                    🛠️ Photo / Sign Resizer & CV Maker
                  </button>
                </div>
              )}
            </div>

            {/* Sarkari Tools Direct Link */}
            <button
              onClick={() => onOpenTools?.('salary')}
              className="px-2.5 py-1 text-xs font-black bg-[#990000] hover:bg-red-700 text-amber-300 rounded ml-2 cursor-pointer shadow-xs uppercase tracking-wider flex items-center gap-1"
            >
              <span>Tools</span>
              <span className="bg-amber-400 text-slate-950 text-[9px] px-1 py-0.2 rounded font-black">NEW</span>
            </button>
          </div>

          {/* Mobile Hamburger & Logo */}
          <div className="flex md:hidden items-center justify-between w-full py-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-white hover:bg-[#132C52]"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <span
              onClick={() => handleNavClick('/')}
              className="text-xs font-black text-amber-300 uppercase tracking-wide cursor-pointer"
            >
              PORTAL MENU
            </span>

            <div className="flex items-center gap-1">
              <button
                id="header-mobile-push-btn"
                onClick={onOpenPushModal}
                className="relative p-1.5 rounded text-amber-300 hover:text-white hover:bg-[#132C52]"
                aria-label="Instant Notifications"
                title="Job Alerts & Notifications"
              >
                <Bell className="w-5 h-5" />
                {isSubscribed ? (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
                ) : (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </button>

              <button
                onClick={onOpenSearch}
                className="p-1.5 rounded text-white hover:bg-[#132C52]"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-amber-300" />
              </button>
            </div>
          </div>

          {/* Right Header Icons / Search / Push Notifications */}
          <div className="hidden md:flex items-center gap-2">
            {/* Instant Push Notifications Bell Button */}
            <button
              id="header-push-alerts-btn"
              onClick={onOpenPushModal}
              className="relative p-2 text-amber-300 hover:text-white hover:bg-[#132C52] rounded transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Enable Instant Push Notifications for Jobs & Results"
            >
              <BellRing className={`w-4 h-4 ${!isSubscribed ? 'animate-bounce' : ''}`} />
              <span className="hidden lg:inline">{isSubscribed ? 'Alerts: On' : 'Job Alerts'}</span>
              {!isSubscribed && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </button>

            <button
              id="header-search-icon-btn"
              onClick={onOpenSearch}
              className="p-2 text-amber-300 hover:text-white hover:bg-[#132C52] rounded transition-colors cursor-pointer"
              title="Search Vacancy, Result, Admit Card"
            >
              <Search className="w-4 h-4" />
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => handleNavClick('/admin')}
                className="text-[11px] font-bold text-amber-300 bg-[#990000] px-2 py-1 rounded hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3" />
                <span>Admin</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('/admin/login')}
                className="text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#071529] border-t border-slate-800 px-4 py-3 space-y-1 text-sm font-semibold">
            {mainNavLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left py-2 px-3 rounded transition-colors ${
                  currentPath === link.path
                    ? 'bg-[#990000] text-white font-bold'
                    : 'text-slate-200 hover:bg-[#132C52] hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}
            {moreNavLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className="w-full text-left py-2 px-3 rounded text-slate-300 hover:bg-[#132C52] hover:text-white"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTools?.('salary');
              }}
              className="w-full text-left py-2 px-3 rounded bg-[#990000] text-amber-300 font-bold mt-2 flex items-center justify-between"
            >
              <span>💰 In-Hand Salary Calculator (7th CPC)</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-black">NEW</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTools?.('image');
              }}
              className="w-full text-left py-2 px-3 rounded bg-slate-800 text-slate-200 font-medium"
            >
              🛠️ Photo Resizer, Age & CV Tools
            </button>
          </div>
        )}
      </nav>

      {/* RSS Feed Reader Modal */}
      <RssFeedModal isOpen={isRssModalOpen} onClose={() => setIsRssModalOpen(false)} />
    </header>
  );
};

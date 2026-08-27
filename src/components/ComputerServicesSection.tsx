import React from 'react';
import {
  FileText,
  Printer,
  UserCheck,
  Camera,
  CreditCard,
  ShieldCheck,
  GraduationCap,
  FileSpreadsheet,
  Phone,
  MessageCircle,
  Clock,
  Check,
  Sparkles,
  ArrowRight,
  Monitor,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { ComputerService } from '../types';

interface ComputerServicesSectionProps {
  onNavigateToContact?: () => void;
}

export const ComputerServicesSection: React.FC<ComputerServicesSectionProps> = ({
  onNavigateToContact,
}) => {
  const { services, settings } = useSettings();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Printer':
        return <Printer className="w-5 h-5" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5" />;
      case 'Camera':
        return <Camera className="w-5 h-5" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const whatsAppPhone = settings?.whatsAppNumber ? settings.whatsAppNumber.replace(/[^0-9]/g, '') : '919956078419';
  const callPhone = settings?.contactNumber || '+91 99560 78419';

  return (
    <section id="computer-center-services" className="my-8 max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="bg-[#0B2545] rounded-2xl p-5 sm:p-7 text-white shadow-lg border border-[#1d4677]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-900/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 bg-amber-400 text-slate-950 rounded font-black text-xs uppercase tracking-wider">
                Center Services
              </span>
              <span className="text-xs text-blue-200 font-semibold">
                Fast & Error-Free Digital Services
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase">
              SHAHNAWAZ COMPUTER CENTER SERVICES
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Professional online form filling, instant laser printouts, PAN card applications, resume crafting, and government document assistance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              id="services-call-now-btn"
              href={`tel:${callPhone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>CALL NOW</span>
            </a>

            <a
              id="services-whatsapp-btn"
              href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent('Hello Shahnawaz Computer Center, I need assistance with online form filling / digital service.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP</span>
            </a>

            {onNavigateToContact && (
              <button
                id="services-contact-btn"
                onClick={onNavigateToContact}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-800/50 text-[#0B2545] font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all"
              >
                <span>CONTACT US</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          {services.map((srv: ComputerService) => (
            <div
              key={srv.id}
              id={`service-card-${srv.id}`}
              className="bg-[#0f2d52] hover:bg-[#153b6b] rounded-xl p-4 border border-blue-800/80 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/60 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getServiceIcon(srv.icon)}
                  </div>
                  {srv.isPopular && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 line-clamp-3 leading-relaxed">
                  {srv.description}
                </p>

                {/* Details */}
                <div className="mt-3 pt-3 border-t border-blue-900/80 space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1 text-amber-300 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>Time: {srv.turnaroundTime}</span>
                  </div>
                  {srv.feeRange && (
                    <div className="font-bold text-emerald-300">
                      Fee: {srv.feeRange}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(`Hello, I want to inquire about ${srv.name}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 w-full py-1.5 px-2 bg-blue-950 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-blue-800 hover:border-emerald-500"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Book Service</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

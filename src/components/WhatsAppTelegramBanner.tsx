import React from 'react';
import { MessageCircle, Send, Sparkles, BellRing, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const WhatsAppTelegramBanner: React.FC = () => {
  const { settings } = useSettings();

  const whatsAppUrl = settings?.whatsAppUrl || 'https://whatsapp.com/channel/0029VbDh3ZP3QxRsUixBEU1P';
  const telegramUrl = settings?.telegramUrl || 'https://telegram.org';

  return (
    <section id="community-join-banner" className="my-4 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* WhatsApp Channel Card */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 rounded-xl p-4 sm:p-5 text-white shadow-md border-2 border-emerald-500 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-emerald-500 rounded-lg text-slate-950 font-bold">
                <MessageCircle className="w-5 h-5 fill-white text-emerald-800" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-600/50">
                Official Updates Channel
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight uppercase">
              JOIN OUR WHATSAPP CHANNEL
            </h3>
            <p className="text-xs text-emerald-100 mt-1 line-clamp-2">
              Get instant notifications for Cyber Cafe Services, Documents, and Sarkari Yojana on WhatsApp.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-emerald-600/40">
            <span className="text-[11px] text-emerald-200 font-semibold flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5 text-amber-300" /> 100% Free & Fast Alerts
            </span>
            <a
              id="whatsapp-channel-cta-btn"
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black uppercase tracking-wider rounded-lg shadow transition-all transform group-hover:translate-x-1"
            >
              <span>FOLLOW NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Telegram Channel Card */}
        <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 rounded-xl p-4 sm:p-5 text-white shadow-md border-2 border-sky-500 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-sky-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-sky-400 rounded-lg text-slate-950 font-bold">
                <Send className="w-5 h-5 fill-white text-sky-800" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-200 bg-sky-900/80 px-2 py-0.5 rounded border border-sky-600/50">
                Official Telegram Group
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight uppercase">
              JOIN OUR TELEGRAM CHANNEL
            </h3>
            <p className="text-xs text-sky-100 mt-1 line-clamp-2">
              Download Government Exam Syllabus PDFs, Previous Year Question Papers & Official Notifications.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-sky-600/40">
            <span className="text-[11px] text-sky-200 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Daily PDF & Results
            </span>
            <a
              id="telegram-channel-cta-btn"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-300 hover:bg-sky-200 text-slate-950 text-xs font-black uppercase tracking-wider rounded-lg shadow transition-all transform group-hover:translate-x-1"
            >
              <span>FOLLOW NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Building2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHead } from '../components/SEOHead';
import { useSettings } from '../context/SettingsContext';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Online Form Assistance');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const whatsAppPhone = settings?.whatsAppNumber ? settings.whatsAppNumber.replace(/[^0-9]/g, '') : '919956078419';
  const contactPhone = settings?.contactNumber || '+91 99560 78419';
  const contactEmail = settings?.contactEmail || 'mohdshahnawaz.afaque@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Send directly to WhatsApp
    const waMsg = `*New Inquiry from Website Contact Page*\n*Name:* ${name}\n*Phone:* ${phone}\n*Subject:* ${subject}\n*Message:* ${message || 'N/A'}`;
    const waUrl = `https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');
    setIsSent(true);
  };

  return (
    <div id="contact-page-container" className="pb-16">
      <SEOHead 
        title="Contact Us & Center Location | Shahnawaz Computer Center"
        description="Get in touch with Shahnawaz Computer Center for government job application assistance, admit cards, online form filling, and more. Visit our physical center."
        keywords="Contact Shahnawaz Computer Center, CSC center near me, Online form filling center, Job application help, Cyber cafe"
        canonicalUrl={window.location.origin + '/contact'}
      />
      <Breadcrumbs items={[{ label: 'Contact Us & Center Location' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="bg-[#0B2545] text-white rounded-2xl p-6 sm:p-10 shadow-lg border-b-4 border-red-600">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              Get In Touch
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Contact Shahnawaz Computer Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Reach out for government job alerts, application inquiries, digital certificate services, or visit our center directly.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: WhatsApp & Phone */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Direct WhatsApp & Call</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Connect directly for instant form filling queries, document submission, or fees info.
              </p>
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-900 dark:text-white">Phone: {contactPhone}</p>
                <p className="font-bold text-emerald-700">WhatsApp: {settings?.whatsAppNumber || contactPhone}</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${whatsAppPhone}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Card 2: Center Address & Timing */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B2545] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Center Location</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {settings?.address || 'Shahnawaz Computer Center, Tambour, District Sitapur, Uttar Pradesh, India'}
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{settings?.timing || 'Mon - Sat: 8:00 AM to 8:30 PM'}</span>
                </div>
              </div>
            </div>
            <a
              href={`tel:${contactPhone}`}
              className="w-full py-2 bg-[#0B2545] hover:bg-slate-800 text-white rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Center</span>
            </a>
          </div>

          {/* Card 3: Email & Social */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Email & Channels</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Official support email and daily alerts broadcast channels.
              </p>
              <div className="space-y-1.5 text-xs text-slate-800 dark:text-slate-100">
                <p className="font-semibold truncate">Email: {contactEmail}</p>
                <p className="text-slate-500 dark:text-slate-400">Fast response within 24 hours</p>
              </div>
            </div>
            {settings?.telegramUrl && (
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Join Telegram Channel</span>
              </a>
            )}
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-[#0B2545] uppercase">
                Send an Online Inquiry
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Fill the form below and we will get back to you immediately on WhatsApp or Phone
              </p>
            </div>

            {isSent && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Inquiry forwarded to WhatsApp. Our staff will assist you shortly!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Mobile / WhatsApp No. *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9956078419"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Service or Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Online Form Assistance">Online Form Assistance (SSC, Police, Railway)</option>
                  <option value="Admit Card / Result Query">Admit Card / Result Query</option>
                  <option value="UP Scholarship Form">UP Scholarship / NSP Application</option>
                  <option value="PAN Card Application">PAN Card (New / Correction)</option>
                  <option value="PVC Card Printing">Smart PVC Card Printing</option>
                  <option value="Print / Resume Making">Resume / Printout Service</option>
                  <option value="Other Query">Other General Query</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Your Message / Query</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide exam name, registration number or any specific requirement..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>

        {/* Disclaimer subtext */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Notice:</strong> Shahnawaz Computer Center is an independent service center and digital information portal. We provide third-party digital assistance and guidance. We do not represent any government department officially.
          </p>
        </div>
      </div>
    </div>
  );
};

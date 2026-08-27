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
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Monitor,
  Check,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ServicesFAQSection } from '../components/ServicesFAQSection';
import { SarkariYojanaSection } from '../components/SarkariYojanaSection';
import { FarmerRegistrySection } from '../components/FarmerRegistrySection';
import { useSettings } from '../context/SettingsContext';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { services, settings } = useSettings();

  const whatsAppPhone = settings?.whatsAppNumber ? settings.whatsAppNumber.replace(/[^0-9]/g, '') : '919956078419';
  const callPhone = settings?.contactNumber || '+91 99560 78419';

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Printer':
        return <Printer className="w-6 h-6" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6" />;
      case 'Camera':
        return <Camera className="w-6 h-6" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-6 h-6" />;
      default:
        return <Monitor className="w-6 h-6" />;
    }
  };

  return (
    <div id="services-page-container" className="pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: 'Computer Center Services' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Hero Header */}
        <div className="bg-[#0B2545] text-white rounded-2xl p-6 sm:p-10 shadow-lg border-b-4 border-amber-400 relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950">
              <Sparkles className="w-3.5 h-3.5" /> Fast • Accurate • Trusted Center
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight">
              SHAHNAWAZ COMPUTER CENTER SERVICES
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              We provide professional online form filling, government scheme applications, instant laser printing, smart PVC card printing, photo making, and document verification services.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent('Hello Shahnawaz Computer Center, I want to inquire about your digital services.')}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Consultation</span>
              </a>

              <a
                href={`tel:${callPhone}`}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-[#0B2545] font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>Call: {callPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Why Choose Our Center */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Zero Mistakes Form Filling',
              desc: 'Double verification of applicant details, DOB, and category to prevent form rejections.',
            },
            {
              title: 'Fast Turnaround Time',
              desc: 'Instant delivery for printouts, PVC cards, photos, and priority exam submissions.',
            },
            {
              title: 'Transparent Pricing',
              desc: 'Official examination fee + standard minimal center service charge only.',
            },
            {
              title: 'Remote WhatsApp Service',
              desc: 'Submit documents via WhatsApp and receive final PDF confirmation slip at home.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5"
            >
              <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Full Services Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B2545] uppercase tracking-tight">
                Our Complete Service Catalog
              </h2>
              <p className="text-xs text-slate-500">
                Click any service to book directly via WhatsApp or call our center
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((srv) => (
              <div
                key={srv.id}
                id={`catalog-service-${srv.id}`}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B2545] group-hover:bg-[#0B2545] group-hover:text-amber-400 flex items-center justify-center transition-colors">
                      {getServiceIcon(srv.icon)}
                    </div>
                    {srv.isPopular && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white tracking-wider">
                        Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0B2545]">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Time:
                      </span>
                      <span className="font-bold text-slate-900">{srv.turnaroundTime}</span>
                    </div>

                    {srv.feeRange && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-medium">Fee:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {srv.feeRange}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <a
                    href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(`Hello Shahnawaz Computer Center, I want to book: ${srv.name}. Please provide details.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 bg-[#0B2545] group-hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire / Book on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SARKARI YOJANA & ONLINE GOVERNMENT SERVICES DIRECTORY */}
        <FarmerRegistrySection isStandalonePage={true} />
        <SarkariYojanaSection isStandalonePage={true} />

        {/* FAQ Section with Accordion Interface */}
        <ServicesFAQSection />

        {/* Operating Hours & Location Callout */}
        <div className="bg-slate-100 rounded-2xl p-6 border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-black text-[#0B2545] text-base uppercase">
              Visiting Shahnawaz Computer Center in Person?
            </h3>
            <p className="text-xs text-slate-600">
              Open <strong>{settings?.timing || 'Mon-Sat 8:00 AM - 8:30 PM'}</strong> at {settings?.address || 'Shahnawaz Computer Center, Tambour, District Sitapur, Uttar Pradesh, India'}.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/contact')}
            className="px-5 py-2.5 bg-[#0B2545] hover:bg-slate-800 text-white font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>View Address & Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  FileCheck2,
  Printer,
  FileText,
  CreditCard,
  MessageCircle,
  Phone,
  Sparkles,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface FAQItem {
  id: string;
  category: 'form_filling' | 'results_admit_card' | 'documentation' | 'center_policies';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
}

export const ServicesFAQSection: React.FC = () => {
  const { settings } = useSettings();
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-4']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const whatsAppPhone = settings?.whatsAppNumber
    ? settings.whatsAppNumber.replace(/[^0-9]/g, '')
    : '919956078419';

  const faqData: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'form_filling',
      categoryLabel: 'Online Form Filling',
      question: 'What documents are required to fill out an online government exam form?',
      answer:
        'To ensure seamless and accurate online form submission, please bring or send the following documents:\n1. 10th & 12th Marksheets & Passing Certificates (for exact spelling of name, father’s name & DOB).\n2. Graduation / Technical Diploma / Degree certificates (if applicable).\n3. Aadhaar Card or valid Government ID Proof.\n4. Recent Passport Size Photograph (with clear background) & Signature on plain white paper.\n5. Category Certificate (OBC-NCL / EWS / SC / ST) and Domicile Certificate (Niwas Praman Patra).\n6. Active Mobile Number and Email ID for OTP verification.',
      highlights: ['10th/12th Marksheet', 'Aadhaar Card', 'Photo & Signature', 'Caste/EWS Certificate', 'Active Mobile & Email'],
    },
    {
      id: 'faq-2',
      category: 'form_filling',
      categoryLabel: 'Online Form Filling',
      question: 'Can I apply for online forms remotely via WhatsApp without visiting the center?',
      answer:
        'Yes! You can take clear photos or scanned copies of your documents and send them to our official WhatsApp number (+91 99560 78419). Our operators will fill out the application, send you a preview draft for verification, submit the fee securely, and send you the final confirmation PDF / acknowledgment receipt.',
      highlights: ['Send documents via WhatsApp', 'Draft preview before final submit', 'Secure fee payment', 'Instant PDF receipt'],
    },
    {
      id: 'faq-3',
      category: 'form_filling',
      categoryLabel: 'Online Form Filling',
      question: 'What happens if a mistake occurs in the online application form?',
      answer:
        'At Shahnawaz Computer Center, our team conducts a mandatory two-step verification of your details (Name, DOB, Category, Marks, Roll Number) before final fee submission. If a correction window is provided by the examination commission (e.g. SSC, UPPSC, NTA), we will help you make corrections within the official schedule.',
      highlights: ['Double verification system', 'Official correction window support', 'Zero rejection guarantee on guidelines'],
    },
    {
      id: 'faq-4',
      category: 'results_admit_card',
      categoryLabel: 'Results & Admit Cards',
      question: 'How do I download or print my Admit Card / Hall Ticket if I forgot my Registration ID or Roll Number?',
      answer:
        'Do not worry! We can recover your lost Registration Number or Roll Number using your registered Name, Father’s Name, Mother’s Name, Date of Birth, and the Mobile/Email used during application. Once retrieved, we can print high-resolution laminated or standard admit cards with all exam instructions and self-declaration forms.',
      highlights: ['Lost Registration ID recovery', 'High-res laser printing', 'Exam day instruction sheets included'],
    },
    {
      id: 'faq-5',
      category: 'results_admit_card',
      categoryLabel: 'Results & Admit Cards',
      question: 'Can I check my cutoff marks, merit list ranking, and scorecards at your center?',
      answer:
        'Yes. We maintain live tracking for all Central & State board exams, SSC, Railway, UPSC, UP Police, Banking, and University results. We download official scorecards, compute category-wise cutoffs, and provide physical color or black & white printouts for counseling and document verification.',
      highlights: ['Category cutoffs checking', 'Merit list search', 'DV scorecard printouts'],
    },
    {
      id: 'faq-6',
      category: 'documentation',
      categoryLabel: 'Documentation & Certificates',
      question: 'How do I apply for a new PAN Card or make corrections in an existing PAN?',
      answer:
        'We process both Instant e-PAN (Aadhaar OTP based) and Physical PAN Cards (delivered to your doorstep). For new PAN cards, you only need your Aadhaar Card with linked mobile number. For corrections in name, date of birth, or father’s name, we prepare the supporting affidavits and official change forms.',
      highlights: ['Instant e-PAN via Aadhaar OTP', 'Doorstep physical PAN card', 'Name & DOB corrections'],
    },
    {
      id: 'faq-7',
      category: 'documentation',
      categoryLabel: 'Documentation & Certificates',
      question: 'Do you provide photo resizing, signature compression, and document scanning services for exam uploads?',
      answer:
        'Yes! Government portals enforce strict file size (e.g., 20KB–50KB JPEG) and exact pixel dimensions. We use professional graphic tools to crop, compress, and enhance your photos, thumb impressions, and marksheets so they pass automated portal validation without blurriness.',
      highlights: ['Exact KB & pixel compliance', 'Background cleaning & lighting fix', 'Multi-page PDF merging'],
    },
    {
      id: 'faq-8',
      category: 'documentation',
      categoryLabel: 'Documentation & Certificates',
      question: 'What is Smart PVC Card printing for Aadhaar, Ayushman Bharat, and Driving Licenses?',
      answer:
        'Smart PVC cards are durable, waterproof plastic cards with HD color printing, UV protection, and clear QR codes. They replace easily torn paper cards and fit comfortably in your wallet. We print high-quality PVC cards for Aadhaar, Voter ID (EPIC), Ayushman Bharat Health Cards, E-Shram, and PAN Cards.',
      highlights: ['Waterproof & tear-proof plastic', 'HD color with sharp QR codes', 'Aadhaar, Voter ID, Ayushman & PAN'],
    },
    {
      id: 'faq-9',
      category: 'center_policies',
      categoryLabel: 'Center Policies & Fees',
      question: 'What are your center service charges and accepted payment modes?',
      answer:
        'All our guidance and online form filling assistance services are provided absolutely free of cost to help the community.',
      highlights: ['Transparent government fees', 'Minimal center service charges', 'All UPI & Cash accepted'],
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(faqData.map((f) => f.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.highlights &&
        faq.highlights.some((h) =>
          h.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="services-faq-section"
      className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-10 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0B2545] uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Essential guidelines on online exam application forms, admit cards, document specifications, and cyber cafe services at Shahnawaz Computer Center.
          </p>
        </div>

        {/* Quick Expand/Collapse Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0B2545] px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0B2545] px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'form_filling', label: '📝 Form Filling' },
              { id: 'results_admit_card', label: '🪪 Admit Cards & Results' },
              { id: 'documentation', label: '💳 PAN & Documentation' },
              { id: 'center_policies', label: '🛡️ Fees & Policies' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-[#0B2545] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 divide-y divide-slate-100">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">No matching questions found</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Try changing your search query or select another category above.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-blue-700 hover:underline pt-1"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);

            return (
              <div
                key={faq.id}
                id={faq.id}
                className="pt-3 first:pt-0 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/70 hover:bg-slate-100 dark:bg-slate-800/50/90 border border-slate-200 dark:border-slate-700/80 transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md inline-block">
                      {faq.categoryLabel}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-900 transition-colors leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 bg-blue-50 text-blue-700' : 'group-hover:translate-y-0.5'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Answer Body */}
                {isOpen && (
                  <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800 border-x border-b border-slate-200 dark:border-slate-700 rounded-b-2xl -mt-1 space-y-3 animate-in fade-in-50 duration-150">
                    <p className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>

                    {faq.highlights && faq.highlights.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                          Key Points:
                        </span>
                        {faq.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{h}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Still Have Questions CTA */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133A6B] text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm sm:text-base font-black uppercase tracking-wide flex items-center gap-2 justify-center sm:justify-start">
            <span>Still Have Questions or Need Custom Assistance?</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h4>
          <p className="text-xs text-slate-200">
            Talk directly to our operators on WhatsApp or visit Shahnawaz Computer Center, Tambour.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent('Hello Shahnawaz Computer Center, I have a specific question regarding your form filling and document services.')}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};

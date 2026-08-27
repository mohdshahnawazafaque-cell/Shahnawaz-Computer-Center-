import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  CreditCard,
  Key,
  BookOpen,
  HelpCircle,
  FileText,
  MessageCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Post, PostType } from '../types';
import { JobCard } from '../components/JobCard';
import { SEOHead } from '../components/SEOHead';
import { ComputerServicesSection } from '../components/ComputerServicesSection';
import { ServicesFAQSection } from '../components/ServicesFAQSection';
import { SarkariYojanaSection } from '../components/SarkariYojanaSection';
import { FarmerRegistrySection } from '../components/FarmerRegistrySection';
import { AdPlacement } from '../components/AdPlacement';
import { AISectionUI } from '../components/AISectionUI';
import { CyberCafeSectionUI } from '../components/CyberCafeSectionUI';
import { PromotionsCarousel } from '../components/PromotionsCarousel';
import { useSettings } from '../context/SettingsContext';
import { getClientPosts, getClientPromotions } from '../utils/clientStorage';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectPost: (slug: string, type: PostType) => void;
  onOpenSearch: () => void;
  onOpenTools?: (tab?: 'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectPost,
  onOpenSearch,
  onOpenTools,
}) => {
  const { settings } = useSettings();
  const [posts, setPosts] = useState<Post[]>(() => getClientPosts());
  const [promotions, setPromotions] = useState(() => getClientPromotions());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch promotions
    fetch('/api/promotions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPromotions(data);
        }
      })
      .catch(() => console.warn('Offline mode: Using local promotions data.'));

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts?limit=100');
        if (res.ok) {
          const data = await res.json();
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts);
          }
        }
      } catch (err) {
        // use local storage
      }
    };
    fetchPosts();
  }, []);

  // Filter posts by category
  const resultPosts = posts.filter((p) => p.type === 'result');
  const admitCardPosts = posts.filter((p) => p.type === 'admit_card' || p.type === 'exam_date' || p.type === 'exam_city');
  const jobPosts = posts.filter((p) => p.type === 'job' || p.type === 'online_form');
  const answerKeyPosts = posts.filter((p) => p.type === 'answer_key');
  const documentPosts = posts.filter((p) => p.type === 'sarkari_yojana' || p.type === 'scholarship' || p.type === 'notice');
  const admissionPosts = posts.filter((p) => p.type === 'admission');

  // Realistic fallback sample items matching screenshots if list is short
  const fallbackResults = [
    { title: 'UPSC CAPF AC Result 2026 - Out', slug: 'upsc-capf-ac-result-2026', type: 'result' as PostType },
    { title: 'SSC Stenographer C, D 2025 Final Result - Out', slug: 'ssc-steno-final-result-2025', type: 'result' as PostType },
    { title: 'RRB NTPC 10+2 UG CBT-I Result 2026 - Out', slug: 'rrb-ntpc-ug-cbt1-result-2026', type: 'result' as PostType },
    { title: 'RBI Officer Grade-B Phase-II Result 2026 - Updated', slug: 'rbi-grade-b-phase2-result-2026', type: 'result' as PostType },
    { title: 'SBI Apprentice Result 2026 - Out', slug: 'sbi-apprentice-result-2026', type: 'result' as PostType },
    { title: 'UPSSSC Lower PCS Answer Key & Result 2026', slug: 'upsssc-lower-pcs-result-2026', type: 'result' as PostType },
    { title: 'UPSSSC Female Health Worker Result 2026 - Out', slug: 'upsssc-anm-result-2026', type: 'result' as PostType },
    { title: 'Patliputra University PPUP UG 4th Merit List 2026', slug: 'ppup-ug-merit-list-2026', type: 'result' as PostType },
    { title: 'IOCL Administrative Officer 2025 Score Card', slug: 'iocl-ao-score-card-2025', type: 'result' as PostType },
    { title: 'RPSC Auditor Pre Result 2026 - Out', slug: 'rpsc-auditor-pre-result-2026', type: 'result' as PostType },
    { title: 'Haryana HTET Score Card 2026 - Out', slug: 'haryana-htet-score-card-2026', type: 'result' as PostType },
    { title: 'UPSC CDS-II Final Result With Marks 2026', slug: 'upsc-cds-2-final-result-2026', type: 'result' as PostType },
    { title: 'IISc JAM Final Result 2026', slug: 'iisc-jam-final-result-2026', type: 'result' as PostType },
    { title: 'SSC JE Engineer Final Result / Marks 2026 - Out', slug: 'ssc-je-final-result-2026', type: 'result' as PostType },
    { title: 'Delhi DSSSB Various Post Result 2026', slug: 'dsssb-various-post-result-2026', type: 'result' as PostType },
    { title: 'RPSC School Lecturer PGT Result 2026 - Updated', slug: 'rpsc-pgt-result-2026', type: 'result' as PostType },
    { title: 'UP DELED 2026 Allotment Result', slug: 'up-deled-allotment-result-2026', type: 'result' as PostType },
    { title: 'UPSSSC Junior Assistant 08/2022 Final Result - Out', slug: 'upsssc-ja-final-result-2022', type: 'result' as PostType },
    { title: 'HPSC PGT Computer Science Final Result 2026', slug: 'hpsc-pgt-cs-result-2026', type: 'result' as PostType },
    { title: 'NEET UG 2026 1st Round Allotment Result - Out', slug: 'neet-ug-allotment-result-2026', type: 'result' as PostType },
    { title: 'UPSSSC Pharmacist Final Answer Key 2026 - Out', slug: 'upsssc-pharmacist-result-2026', type: 'result' as PostType },
    { title: 'RPSC Rajasthan Police SI Telecom Final Result 2026 - Out', slug: 'rpsc-si-telecom-result-2026', type: 'result' as PostType },
    { title: 'NTA SWAYAM Result / Score Card 2026 - Out', slug: 'nta-swayam-result-2026', type: 'result' as PostType },
    { title: 'Bihar Police Prohibition Constable Result 2026 - Out', slug: 'bihar-police-prohibition-result-2026', type: 'result' as PostType },
    { title: 'Bihar Police CSBC Constable Operator Result 2026 - Out', slug: 'bihar-police-csbc-result-2026', type: 'result' as PostType },
  ];

  const fallbackAdmitCards = [
    { title: 'RPSC APO Exam City Details 2026', slug: 'rpsc-apo-exam-city-2026', type: 'admit_card' as PostType },
    { title: 'NEET PG 2026 Admit Card', slug: 'neet-pg-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'Railway RRB ALP Application Status 2026 - Out', slug: 'rrb-alp-app-status-2026', type: 'admit_card' as PostType },
    { title: 'UPSSSC Pharmacist Ayurvedic Mains Exam Fee Payment 2026', slug: 'upsssc-ayurvedic-mains-2026', type: 'admit_card' as PostType },
    { title: 'UPSSSC Excise Constable Mains Exam Fee Payment 2026', slug: 'upsssc-excise-constable-2026', type: 'admit_card' as PostType },
    { title: 'UPCGUB UP Co-operative Bank Various Post Exam Date 2026', slug: 'upcgub-exam-date-2026', type: 'admit_card' as PostType },
    { title: 'Railway RRB Group D Exam City / Admit Card 2026', slug: 'rrb-group-d-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'DSSSB Various Post Exam Date 2026', slug: 'dsssb-exam-date-2026', type: 'admit_card' as PostType },
    { title: 'AIIMS CRE 5th Group B, C Re-Exam City Details 2026', slug: 'aiims-cre-city-details-2026', type: 'admit_card' as PostType },
    { title: 'RPSC Statistical Officer Exam City Details 2026', slug: 'rpsc-statistical-officer-city-2026', type: 'admit_card' as PostType },
    { title: 'ONGC Geologists and Engineers E1 Admit Card 2026', slug: 'ongc-e1-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'SSC Delhi Police HC (Ministerial) PE & MT Admit Card 2026 - Out', slug: 'ssc-dp-hc-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'SSC Delhi Police Constable (Executive) PE & MT Notice 2026', slug: 'ssc-dp-constable-notice-2026', type: 'admit_card' as PostType },
    { title: 'SSC Selection Phase 14 Exam Date 2026 - Out', slug: 'ssc-phase-14-exam-date-2026', type: 'admit_card' as PostType },
    { title: 'UPSSSC Stenographer 09/2023 Skill Test Exam Date Notice', slug: 'upsssc-steno-skill-test-2026', type: 'admit_card' as PostType },
    { title: 'UPPSC GIC Lecturer Mains Admit Card 2026 - Out', slug: 'uppsc-gic-mains-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'Cotton Corporation CCI Various Post Admit Card 2026 - Out', slug: 'cci-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'IBPS SO XVI Pre Admit Card 2026 - Out', slug: 'ibps-so-xvi-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'SSC MTS / Havaldar PET / PST Exam Date 2026', slug: 'ssc-mts-pet-exam-date-2026', type: 'admit_card' as PostType },
    { title: 'BSNL Junior Telecom Officer JTO Admit Card 2026 - Out', slug: 'bsnl-jto-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'NICL Assistant Pre Admit Card 2026', slug: 'nicl-assistant-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'BPSSC Bihar Police Havildar Instructor PST Admit Card 2026', slug: 'bpssc-havildar-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'BSF HCM & ASI Steno Admit Card 2026 - Out', slug: 'bsf-hcm-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'NTA AIAPGET Admit Card 2026 - Out', slug: 'nta-aiapget-admit-card-2026', type: 'admit_card' as PostType },
    { title: 'NBEMS Group A, B & C Various Post Exam City Details 2026', slug: 'nbems-city-details-2026', type: 'admit_card' as PostType },
  ];

  const fallbackJobs = [
    { title: 'RRVUNL JE / Junior Assistant Online Form 2026 - Date Extended', slug: 'rrvunl-je-recruitment-2026', type: 'job' as PostType },
    { title: 'UPSSSC PET Online Form 2026', slug: 'upsssc-pet-online-form-2026', type: 'job' as PostType },
    { title: 'CTET September Online Form 2026 - Re-Open', slug: 'ctet-september-online-form-2026', type: 'job' as PostType },
    { title: 'IBPS Clerk (CSA) 16th Online Form 2026 (11,403 Posts)', slug: 'ibps-clerk-csa-2026', type: 'job' as PostType },
    { title: 'Bihar BCECEB BGFC Various Post Online Form 2026', slug: 'bihar-bceceb-bgfc-2026', type: 'job' as PostType },
    { title: 'Bihar BCECEB Sr. Resident Tutor Online Form 2026', slug: 'bihar-bceceb-tutor-2026', type: 'job' as PostType },
    { title: 'MPESB Group 3 Sub Engineer & Other Post Online Form 2026 - Cancelled', slug: 'mpesb-group-3-sub-eng-2026', type: 'job' as PostType },
    { title: 'RCFL Management Trainee MT Online Form 2026 - Date Extend', slug: 'rcfl-mt-online-form-2026', type: 'job' as PostType },
    { title: 'PGCIL Apprentice Online Form 2026', slug: 'pgcil-apprentice-form-2026', type: 'job' as PostType },
    { title: 'RRC ECOR Apprentice Online Form 2026', slug: 'rrc-ecor-apprentice-2026', type: 'job' as PostType },
    { title: 'NTPC NSPCL Various Post Online Form 2026', slug: 'ntpc-nspcl-form-2026', type: 'job' as PostType },
    { title: 'SBI Junior Associates Clerk Online Form 2026 (9124 Posts)', slug: 'sbi-clerk-junior-associates-2026', type: 'job' as PostType },
    { title: 'NTPC Green Energy Limited DGM, AE Online Form 2026', slug: 'ntpc-green-energy-form-2026', type: 'job' as PostType },
    { title: 'UPSC EPFO / APFC Online Form 2026 - Start', slug: 'upsc-epfo-apfc-online-form-2026', type: 'job' as PostType },
    { title: 'SKAU Kurukshetra Non Teaching Post Online Form 2026 - Date Extend', slug: 'skau-non-teaching-form-2026', type: 'job' as PostType },
    { title: 'MPESB Primary and Secondary Teachers MPTET Online Form 2026 - Start', slug: 'mpesb-mptet-online-form-2026', type: 'job' as PostType },
    { title: 'Bank Of Baroda LBO Online Form 2026 (2462 Posts)', slug: 'bob-lbo-online-form-2026', type: 'job' as PostType },
    { title: 'NTPC NGEL Engineer and Executive Post Online Form 2026', slug: 'ntpc-ngel-engineer-2026', type: 'job' as PostType },
    { title: 'UP Anganwadi Bharti Online Form 2026 (Updated)', slug: 'up-anganwadi-bharti-2026', type: 'job' as PostType },
    { title: 'RRB Junior Engineer JE Online Form 2026 (3993 Posts)', slug: 'rrb-je-recruitment-2026', type: 'job' as PostType },
    { title: 'UPPSC Professor & Assistant Professor Online Form 2026', slug: 'uppsc-assistant-prof-2026', type: 'job' as PostType },
    { title: 'BPSC School Teacher TRE 4.0 Online Form 2026 (32,288 Posts)', slug: 'bpsc-teacher-tre-4-online-form-2026', type: 'job' as PostType },
    { title: 'RSSB Junior Engineer Online Form 2026', slug: 'rssb-je-online-form-2026', type: 'job' as PostType },
    { title: 'MP High Court Assistant Grade III Online Form 2026', slug: 'mp-high-court-assistant-2026', type: 'job' as PostType },
    { title: 'Bihar STET Online Form 2026', slug: 'bihar-stet-online-form-2026', type: 'job' as PostType },
  ];

  const fallbackAnswerKeys = [
    { title: 'UPSSSC Lower PCS Answer Key 2026 - Out', slug: 'upsssc-lower-pcs-key-2026', type: 'answer_key' as PostType },
    { title: 'UPSSSC BCG Technician Final Answer Key 2026 - Out', slug: 'upsssc-bcg-tech-key-2026', type: 'answer_key' as PostType },
    { title: 'UPSSSC UP Pollution Control Board Various Post Final Answer Key 2026 - Out', slug: 'upsssc-pollution-key-2026', type: 'answer_key' as PostType },
    { title: 'UPSSSC Pharmacist Final Answer Key 2026 - Out', slug: 'upsssc-pharmacist-key-2026', type: 'answer_key' as PostType },
    { title: 'NTA ICAR AIEEA PG, Ph.D Answer Key 2026', slug: 'nta-icar-aieea-key-2026', type: 'answer_key' as PostType },
    { title: 'NTA CSIR UGC NET June Answer Key 2026 - Out', slug: 'nta-csir-net-key-2026', type: 'answer_key' as PostType },
    { title: 'Bihar BPSC APO Answer Key 2026', slug: 'bihar-bpsc-apo-key-2026', type: 'answer_key' as PostType },
    { title: 'UPSSSC Agriculture Technical Assistant Group-C Answer Key 2026 - Out', slug: 'upsssc-agri-tech-key-2026', type: 'answer_key' as PostType },
  ];

  const fallbackDocuments = [
    { title: 'BPSC Exam Calendar 2026', slug: 'bpsc-calendar-2026', type: 'notice' as PostType },
    { title: 'Delhi Ladli Yojana Form 2026', slug: 'delhi-ladli-yojana-2026', type: 'sarkari_yojana' as PostType },
    { title: 'UP Scholarship Online Form 2026-27', slug: 'up-scholarship-online-form-2026-27', type: 'scholarship' as PostType },
    { title: 'UPSSSC Exam Calendar 2026', slug: 'upsssc-calendar-2026', type: 'notice' as PostType },
    { title: 'SSC Exam Calendar 2026-27', slug: 'ssc-calendar-2026-27', type: 'notice' as PostType },
    { title: 'RPSC Exam Calendar 2026', slug: 'rpsc-calendar-2026', type: 'notice' as PostType },
    { title: 'UP Scholarship Online Form 2025-26', slug: 'up-scholarship-form-2025-26', type: 'scholarship' as PostType },
    { title: 'UP Police OTR Registration 2025', slug: 'up-police-otr-registration-2025', type: 'notice' as PostType },
    { title: 'UP Police SI, ASI Syllabus / Exam Pattern 2025 - Out', slug: 'up-police-si-asi-syllabus-2025', type: 'syllabus' as PostType },
    { title: 'UP Police Recruitment Calendar 2025-26', slug: 'up-police-calendar-2025-26', type: 'notice' as PostType },
    { title: 'PAN Card Registration, Correction & Other Service 2026', slug: 'pan-card-services-2026', type: 'notice' as PostType },
    { title: 'Aadhaar Card Download, Correction...', slug: 'aadhaar-card-download-services-2026', type: 'notice' as PostType },
  ];

  const fallbackAdmissions = [
    { title: 'CTET September Online Form 2026 - Re-Open', slug: 'ctet-sept-online-form-2026', type: 'admission' as PostType },
    { title: 'AIBE 20th Online Form 2026', slug: 'aibe-20th-online-form-2026', type: 'admission' as PostType },
    { title: 'IIT JAM 2027 Online Form', slug: 'iit-jam-2027-form', type: 'admission' as PostType },
    { title: 'SAV Bihar Class 6 Online Form 2027-28 - Date Extend', slug: 'sav-bihar-class-6-form-2027', type: 'admission' as PostType },
    { title: 'Bihar STET Online Form 2026', slug: 'bihar-stet-form-2026', type: 'admission' as PostType },
    { title: 'IIT GATE 2027 Online Form', slug: 'iit-gate-2027-form', type: 'admission' as PostType },
    { title: 'Bihar BSEB DELEd 2026 Common Application Form', slug: 'bseb-deled-form-2026', type: 'admission' as PostType },
    { title: 'CLAT Online Form 2026 - Start', slug: 'clat-online-form-2026', type: 'admission' as PostType },
    { title: 'IIM CAT 2026 Online Form - Start', slug: 'iim-cat-form-2026', type: 'admission' as PostType },
    { title: 'UP Scholarship Online Form 2026-27', slug: 'up-scholarship-form-2026-27', type: 'scholarship' as PostType },
    { title: 'Allahabad University PGAT 2026 Online Counselling', slug: 'au-pgat-counselling-2026', type: 'admission' as PostType },
  ];

  return (
    <div id="sarkari-result-home" className="min-h-screen bg-[#F4F6F9] pb-12 select-none">
      <SEOHead 
        title="SHAHNAWAZ COMPUTER CENTER - Sarkari Naukri, Results, Admit Card & Online Information Portal"
        description="Official Information Portal for Sarkari Naukri, Government Jobs, Admit Card, Results, Answer Key, Syllabus, Sarkari Yojana, UP Scholarship & Online Forms by Shahnawaz Computer Center."
        keywords="Sarkari Naukri, Sarkari Result, Admit Card, Latest Jobs, Answer Key, Syllabus, Shahnawaz Computer Center, Online Form Filling, UP Scholarship"
        canonicalUrl={window.location.origin + '/'}
      />
      <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-4 pt-3">
        
        {/* 1. OFFICIAL WEBSITE TAGLINE & LIVE TEST ALERT */}
        <section className="text-center space-y-2 py-1">
          <p className="text-[13px] sm:text-sm md:text-[14.5px] font-bold text-slate-900 dark:text-white leading-snug max-w-4xl mx-auto">
            {settings?.websiteName || 'SHAHNAWAZ COMPUTER CENTER'} – Get Online Form, Results, Admit Card, Answer Key, Syllabus, Career News, Government Schemes, Scholarship, Notification etc.{' '}
            <span className="inline-flex items-center gap-1 bg-[#007BFF] text-white text-xs px-2 py-0.5 rounded font-bold ml-1">
              🪪 Standardized & Admissions Tests
            </span>{' '}
            <span className="inline-block px-1.5 py-0.2 border border-slate-900 text-[10px] font-black uppercase rounded-full tracking-wider">
              LIVE
            </span>
          </p>

          {/* Green WhatsApp Channel Pill Button & Tools Link */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <a
              href={settings?.whatsAppUrl || 'https://whatsapp.com/channel/0029VbDh3ZP3QxRsUixBEU1P'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-2 bg-[#00C853] hover:bg-[#00B048] text-white font-black text-xs sm:text-sm rounded-lg shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
            >
              Join WhatsApp Channel
            </a>

            <button
              onClick={() => onOpenTools?.('salary')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#800000] hover:bg-red-800 text-white font-black text-xs sm:text-sm rounded-lg shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <span>💰 In-Hand Salary Calculator</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1 py-0.2 rounded font-black">7th CPC</span>
            </button>

            <button
              onClick={() => onOpenTools?.('image')}
              className="text-[#0000CC] hover:text-[#990000] underline font-black text-xs sm:text-sm tracking-tight cursor-pointer px-2 py-1"
            >
              Candidate Tools (Photo / Age / CV)
            </button>
          </div>
        </section>

        {/* PROMOTIONS & ADVERTISEMENTS SECTION */}
        <PromotionsCarousel promotions={promotions} />

        {/* 2. ICONIC 8 MULTI-COLORED RECRUITMENT BLOCKS GRID (Exact match to screenshot Capture777.JPG) */}
        <section className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 sm:gap-1.5 text-center">
            {/* Box 1: Bright Red */}
            <div
              onClick={() => onNavigate('/category/admit-card')}
              className="bg-[#D32F2F] hover:bg-[#C2185B] text-white p-2.5 sm:p-3 font-black text-[13px] sm:text-sm leading-snug cursor-pointer transition-colors shadow-2xs flex items-center justify-center min-h-[58px]"
            >
              RRB Group D Exam City / Admit Card 2026
            </div>

            {/* Box 2: Orange */}
            <div
              onClick={() => onNavigate('/category/latest-jobs')}
              className="bg-[#E65100] hover:bg-[#EF6C00] text-white p-2.5 sm:p-3 font-black text-[13px] sm:text-sm leading-snug cursor-pointer transition-colors shadow-2xs flex items-center justify-center min-h-[58px]"
            >
              Daily 5 Minutes Meditation & Crack Exams
            </div>

            {/* Box 3: Purple / Magenta */}
            <div
              onClick={() => onNavigate('/category/latest-jobs')}
              className="bg-[#7B1FA2] hover:bg-[#8E24AA] text-white p-2.5 sm:p-3 font-black text-[13px] sm:text-sm leading-snug cursor-pointer transition-colors shadow-2xs flex items-center justify-center min-h-[58px]"
            >
              SBI Clerk Online Form 2026 (9124 Posts)
            </div>

            {/* Box 4: Navy Blue */}
            <div
              onClick={() => onNavigate('/category/latest-jobs')}
              className="bg-[#0D47A1] hover:bg-[#1565C0] text-white p-2.5 sm:p-3 font-black text-[13px] sm:text-sm leading-snug cursor-pointer transition-colors shadow-2xs flex items-center justify-center min-h-[58px]"
            >
              Rajasthan Safai Karmchari (24,752 Posts)
            </div>

            {/* Box 5: Olive Green */}
            <div
              onClick={() => onNavigate('/category/latest-jobs')}
              className="bg-[#689F38] hover:bg-[#558B2F] text-white p-2.5 sm:p-3 font-black text-[13px] sm:text-sm leading-snug cursor-pointer transition-colors shadow-2xs flex items-center justify-center min-h-[58px]"
            >
              IBPS Clerk 16th Form (11403 Posts)
            </div>

            {/* Box 6: Sky Blue */}
            <div
              onClick={() => onNavigate('/category/latest-jobs')}
              className="bg-[#0288D1] hover:bg-[#039BE5] text-white p-2.5 sm:p-3 font-black text-[13px] sm:text-sm leading-snug cursor-pointer transition-colors shadow-2xs flex items-center justify-center min-h-[58px]"
            >
              UPSSSC PET Online Form 2026
            </div>

            {/* Box 7: Dark Brown / Maroon */}
            <div
              onClick={() => onNavigate('/category/latest-jobs')}
              className="bg-[#4E342E] hover:bg-[#5D4037] text-white p-2.5 sm:p-3 font-black text-[13px] sm:text-sm leading-snug cursor-pointer transition-colors shadow-2xs flex items-center justify-center min-h-[58px]"
            >
              RRVUNL JE / Other Post Form (2005 Posts)
            </div>

            {/* Box 8: Dark Emerald Green */}
            <div
              onClick={() => onNavigate('/category/latest-jobs')}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white p-2.5 sm:p-3 font-black text-[13px] sm:text-sm leading-snug cursor-pointer transition-colors shadow-2xs flex items-center justify-center min-h-[58px]"
            >
              RRB JE Online Form 2026 (3993 Posts)
            </div>
          </div>
        </section>

        {/* AI Promotion Section */}
        <AISectionUI />

        {/* Cyber Cafe Dashboard UI */}
        <CyberCafeSectionUI onNavigate={onNavigate} />

        {/* 3. ROW 1: THE 3 SARKARI TABLES: RESULTS | ADMIT CARDS | LATEST JOBS (Exact match to screenshot 2.JPG) */}
        <main className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            
            {/* TABLE 1: RESULTS */}
            <section id="table-results" className="bg-white dark:bg-slate-800 border border-[#990000] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="bg-[#990000] text-white py-2 px-3 text-center border-b border-[#880000]">
                  <h2 className="text-base sm:text-lg font-black tracking-wide uppercase">
                    Results
                  </h2>
                </div>

                <div className="divide-y divide-slate-200/80">
                  {/* Active Dynamic Posts or Fallbacks */}
                  {resultPosts.length > 0
                    ? resultPosts.slice(0, 25).map((p) => (
                        <JobCard
                          key={p.id}
                          post={p}
                          layout="sarkari_list"
                          onClick={() => onSelectPost(p.slug, p.type)}
                        />
                      ))
                    : fallbackResults.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onSelectPost(item.slug, item.type)}
                          className="px-2.5 py-1.5 hover:bg-red-50/60 border-b border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer flex items-start gap-1.5"
                        >
                          <span className="text-slate-800 dark:text-slate-100 font-black text-sm leading-tight select-none">•</span>
                          <span className="text-[12.5px] font-semibold text-[#0000CC] hover:underline hover:text-[#990000] leading-tight">
                            {item.title}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              {/* Blue View More Button at Bottom Right (Exact match to screenshot) */}
              <div className="p-2.5 flex justify-end bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => onNavigate('/category/result')}
                  className="px-4 py-1 bg-[#007BFF] hover:bg-[#0069D9] text-white text-xs font-black rounded cursor-pointer shadow-2xs transition-colors"
                >
                  View More
                </button>
              </div>
            </section>

            {/* TABLE 2: ADMIT CARDS */}
            <section id="table-admit-cards" className="bg-white dark:bg-slate-800 border border-[#990000] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="bg-[#990000] text-white py-2 px-3 text-center border-b border-[#880000]">
                  <h2 className="text-base sm:text-lg font-black tracking-wide uppercase">
                    Admit Cards
                  </h2>
                </div>

                <div className="divide-y divide-slate-200/80">
                  {admitCardPosts.length > 0
                    ? admitCardPosts.slice(0, 25).map((p) => (
                        <JobCard
                          key={p.id}
                          post={p}
                          layout="sarkari_list"
                          onClick={() => onSelectPost(p.slug, p.type)}
                        />
                      ))
                    : fallbackAdmitCards.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onSelectPost(item.slug, item.type)}
                          className="px-2.5 py-1.5 hover:bg-red-50/60 border-b border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer flex items-start gap-1.5"
                        >
                          <span className="text-slate-800 dark:text-slate-100 font-black text-sm leading-tight select-none">•</span>
                          <span className="text-[12.5px] font-semibold text-[#0000CC] hover:underline hover:text-[#990000] leading-tight">
                            {item.title}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              {/* Blue View More Button at Bottom Right */}
              <div className="p-2.5 flex justify-end bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => onNavigate('/category/admit-card')}
                  className="px-4 py-1 bg-[#007BFF] hover:bg-[#0069D9] text-white text-xs font-black rounded cursor-pointer shadow-2xs transition-colors"
                >
                  View More
                </button>
              </div>
            </section>

            {/* TABLE 3: LATEST JOBS */}
            <section id="table-latest-jobs" className="bg-white dark:bg-slate-800 border border-[#990000] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="bg-[#990000] text-white py-2 px-3 text-center border-b border-[#880000]">
                  <h2 className="text-base sm:text-lg font-black tracking-wide uppercase">
                    Latest Jobs
                  </h2>
                </div>

                <div className="divide-y divide-slate-200/80">
                  {jobPosts.length > 0
                    ? jobPosts.slice(0, 25).map((p) => (
                        <JobCard
                          key={p.id}
                          post={p}
                          layout="sarkari_list"
                          onClick={() => onSelectPost(p.slug, p.type)}
                        />
                      ))
                    : fallbackJobs.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onSelectPost(item.slug, item.type)}
                          className="px-2.5 py-1.5 hover:bg-red-50/60 border-b border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer flex items-start gap-1.5"
                        >
                          <span className="text-slate-800 dark:text-slate-100 font-black text-sm leading-tight select-none">•</span>
                          <span className="text-[12.5px] font-semibold text-[#0000CC] hover:underline hover:text-[#990000] leading-tight">
                            {item.title}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              {/* Blue View More Button at Bottom Right */}
              <div className="p-2.5 flex justify-end bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => onNavigate('/category/latest-jobs')}
                  className="px-4 py-1 bg-[#007BFF] hover:bg-[#0069D9] text-white text-xs font-black rounded cursor-pointer shadow-2xs transition-colors"
                >
                  View More
                </button>
              </div>
            </section>
          </div>
        </main>

        {/* 4. ROW 2: SECONDARY 3 SARKARI TABLES: ANSWER KEY | DOCUMENTS | ADMISSION (Exact match to screenshot 2.JPG) */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            
            {/* TABLE 4: ANSWER KEY */}
            <div id="table-answer-key" className="bg-white dark:bg-slate-800 border border-[#990000] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="bg-[#990000] text-white py-2 px-3 text-center border-b border-[#880000]">
                  <h3 className="text-base font-black tracking-wide uppercase">
                    Answer Key
                  </h3>
                </div>

                <div className="divide-y divide-slate-200/80">
                  {answerKeyPosts.length > 0
                    ? answerKeyPosts.slice(0, 15).map((p) => (
                        <JobCard
                          key={p.id}
                          post={p}
                          layout="sarkari_list"
                          onClick={() => onSelectPost(p.slug, p.type)}
                        />
                      ))
                    : fallbackAnswerKeys.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onSelectPost(item.slug, item.type)}
                          className="px-2.5 py-1.5 hover:bg-red-50/60 border-b border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer flex items-start gap-1.5"
                        >
                          <span className="text-slate-800 dark:text-slate-100 font-black text-sm leading-tight select-none">•</span>
                          <span className="text-[12.5px] font-semibold text-[#0000CC] hover:underline hover:text-[#990000] leading-tight">
                            {item.title}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              <div className="p-2.5 flex justify-end bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => onNavigate('/category/answer-key')}
                  className="px-4 py-1 bg-[#007BFF] hover:bg-[#0069D9] text-white text-xs font-black rounded cursor-pointer shadow-2xs transition-colors"
                >
                  View More
                </button>
              </div>
            </div>

            {/* TABLE 5: DOCUMENTS / CERTIFICATE VERIFICATION */}
            <div id="table-documents" className="bg-white dark:bg-slate-800 border border-[#990000] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="bg-[#990000] text-white py-2 px-3 text-center border-b border-[#880000]">
                  <h3 className="text-base font-black tracking-wide uppercase">
                    Documents
                  </h3>
                </div>

                <div className="divide-y divide-slate-200/80">
                  {documentPosts.length > 0
                    ? documentPosts.slice(0, 15).map((p) => (
                        <JobCard
                          key={p.id}
                          post={p}
                          layout="sarkari_list"
                          onClick={() => onSelectPost(p.slug, p.type)}
                        />
                      ))
                    : fallbackDocuments.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onSelectPost(item.slug, item.type)}
                          className="px-2.5 py-1.5 hover:bg-red-50/60 border-b border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer flex items-start gap-1.5"
                        >
                          <span className="text-slate-800 dark:text-slate-100 font-black text-sm leading-tight select-none">•</span>
                          <span className="text-[12.5px] font-semibold text-[#0000CC] hover:underline hover:text-[#990000] leading-tight">
                            {item.title}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              <div className="p-2.5 flex justify-end bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => onNavigate('/category/sarkari-yojana')}
                  className="px-4 py-1 bg-[#007BFF] hover:bg-[#0069D9] text-white text-xs font-black rounded cursor-pointer shadow-2xs transition-colors"
                >
                  View More
                </button>
              </div>
            </div>

            {/* TABLE 6: ADMISSION */}
            <div id="table-admission" className="bg-white dark:bg-slate-800 border border-[#990000] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="bg-[#990000] text-white py-2 px-3 text-center border-b border-[#880000]">
                  <h3 className="text-base font-black tracking-wide uppercase">
                    Admission
                  </h3>
                </div>

                <div className="divide-y divide-slate-200/80">
                  {admissionPosts.length > 0
                    ? admissionPosts.slice(0, 15).map((p) => (
                        <JobCard
                          key={p.id}
                          post={p}
                          layout="sarkari_list"
                          onClick={() => onSelectPost(p.slug, p.type)}
                        />
                      ))
                    : fallbackAdmissions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onSelectPost(item.slug, item.type)}
                          className="px-2.5 py-1.5 hover:bg-red-50/60 border-b border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer flex items-start gap-1.5"
                        >
                          <span className="text-slate-800 dark:text-slate-100 font-black text-sm leading-tight select-none">•</span>
                          <span className="text-[12.5px] font-semibold text-[#0000CC] hover:underline hover:text-[#990000] leading-tight">
                            {item.title}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              <div className="p-2.5 flex justify-end bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => onNavigate('/category/admission')}
                  className="px-4 py-1 bg-[#007BFF] hover:bg-[#0069D9] text-white text-xs font-black rounded cursor-pointer shadow-2xs transition-colors"
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placement */}
        <AdPlacement placement="home_middle" onActionClick={() => onNavigate('/services')} />

        {/* SARKARI YOJANA & DIRECT ONLINE SERVICES DIRECTORY */}
        <FarmerRegistrySection isStandalonePage={false} />
        <SarkariYojanaSection isStandalonePage={false} />

        {/* CYBER CAFE & COMPUTER CENTER SERVICES */}
        <ComputerServicesSection onNavigateToContact={() => onNavigate('/contact')} />

        {/* FREQUENTLY ASKED QUESTIONS */}
        <ServicesFAQSection />

        {/* RECRUITMENT BOARDS & OFFICIAL DIRECTORY */}
        <section className="bg-white dark:bg-slate-800 p-4 border border-slate-300 dark:border-slate-600 shadow-2xs space-y-3">
          <h3 className="text-sm font-black text-[#990000] uppercase tracking-tight">
            Official Recruitment Boards & Quick Links 2026
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            {[
              { name: 'SSC Portal', path: '/category/latest-jobs' },
              { name: 'UPSC Board', path: '/category/latest-jobs' },
              { name: 'UPSSSC Portal', path: '/category/latest-jobs' },
              { name: 'Railway RRB', path: '/category/latest-jobs' },
              { name: 'BPSC Board', path: '/category/latest-jobs' },
              { name: 'NTA Exam Portal', path: '/category/admit-card' },
              { name: 'Indian Army', path: '/category/latest-jobs' },
              { name: 'Air Force Agniveer', path: '/category/latest-jobs' },
              { name: 'Navy Recruitment', path: '/category/latest-jobs' },
              { name: 'IBPS Banking', path: '/category/latest-jobs' },
              { name: 'SBI Careers', path: '/category/latest-jobs' },
              { name: 'UP Police Board', path: '/category/admit-card' },
            ].map((link) => (
              <button
                key={link.name}
                onClick={() => onNavigate(link.path)}
                className="p-1.5 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 hover:text-red-700 text-slate-800 dark:text-slate-100 font-bold border border-slate-200 dark:border-slate-700 transition-colors text-center truncate"
              >
                {link.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

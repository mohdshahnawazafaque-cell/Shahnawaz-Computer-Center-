import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Eye,
  Save,
  CheckCircle2,
  Link as LinkIcon,
  Calendar,
  Building2,
  DollarSign,
  Users,
  FileText,
  Sparkles,
  HelpCircle,
  Award,
  CreditCard,
  Key,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Post, PostType, PostStatus, ComputedStatus, ImportantLink, VacancyItem } from '../types';
import { calculatePostStatus, getStatusBadgeConfig } from '../utils/statusCalculator';
import { ImportantLinksTable } from './ImportantLinksTable';
import { getClientPosts, saveClientPosts } from '../utils/clientStorage';

interface UniversalPostBuilderProps {
  initialPost?: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (post: Post) => void;
  token: string;
}

export const UniversalPostBuilder: React.FC<UniversalPostBuilderProps> = ({
  initialPost,
  isOpen,
  onClose,
  onSaved,
  token,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [type, setType] = useState<PostType>(initialPost?.type || 'job');
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [shortDescription, setShortDescription] = useState(initialPost?.shortDescription || '');
  const [category, setCategory] = useState(initialPost?.category || 'Sarkari Naukri');
  const [department, setDepartment] = useState(initialPost?.department || '');
  const [organization, setOrganization] = useState(initialPost?.organization || '');
  const [state, setState] = useState(initialPost?.state || 'All India');
  const [status, setStatus] = useState<PostStatus>(initialPost?.status || 'published');
  const [manualStatusOverride, setManualStatusOverride] = useState<ComputedStatus | ''>(
    initialPost?.manualStatusOverride || ''
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(initialPost?.isFeatured || false);
  const [isPinned, setIsPinned] = useState<boolean>(initialPost?.isPinned || false);

  // Dates
  const [startDate, setStartDate] = useState(initialPost?.startDate || '');
  const [lastDate, setLastDate] = useState(initialPost?.lastDate || '');
  const [feeLastDate, setFeeLastDate] = useState(initialPost?.feeLastDate || '');
  const [correctionDate, setCorrectionDate] = useState(initialPost?.correctionDate || '');
  const [examDate, setExamDate] = useState(initialPost?.examDate || '');
  const [admitCardDate, setAdmitCardDate] = useState(initialPost?.admitCardDate || '');
  const [resultDate, setResultDate] = useState(initialPost?.resultDate || '');
  const [answerKeyDate, setAnswerKeyDate] = useState(initialPost?.answerKeyDate || '');
  const [objectionStartDate, setObjectionStartDate] = useState(initialPost?.objectionStartDate || '');
  const [objectionLastDate, setObjectionLastDate] = useState(initialPost?.objectionLastDate || '');

  // Details
  const [totalVacancy, setTotalVacancy] = useState(initialPost?.totalVacancy || '');
  const [salaryPayScale, setSalaryPayScale] = useState(initialPost?.salaryPayScale || '');
  const [educationalQualification, setEducationalQualification] = useState(
    initialPost?.educationalQualification || ''
  );
  const [examPattern, setExamPattern] = useState(initialPost?.examPattern || '');
  const [syllabus, setSyllabus] = useState(initialPost?.syllabus || '');
  const [examCity, setExamCity] = useState(initialPost?.examCity || '');
  const [examCenterInfo, setExamCenterInfo] = useState(initialPost?.examCenterInfo || '');
  const [cutOffInfo, setCutOffInfo] = useState(initialPost?.cutOffInfo || '');
  const [meritListInfo, setMeritListInfo] = useState(initialPost?.meritListInfo || '');
  const [objectionFee, setObjectionFee] = useState(initialPost?.objectionFee || '');
  const [whoCanApply, setWhoCanApply] = useState(initialPost?.whoCanApply || '');

  // Lists (multi-line or array)
  const [selectionProcessText, setSelectionProcessText] = useState(
    initialPost?.selectionProcess?.join('\n') ||
      'Written Examination / CBT\nSkill Test / Typing Test\nDocument Verification\nMedical Examination'
  );
  const [requiredDocsText, setRequiredDocsText] = useState(
    initialPost?.requiredDocuments?.join('\n') ||
      'Recent Passport Size Photo with white background\nSignature on white paper\n10th Marksheet & Certificate\n12th & Graduation Certificates\nCaste / EWS Certificate (if applicable)\nPhoto ID Proof (Aadhaar / Voter ID)'
  );
  const [importantInstructionsText, setImportantInstructionsText] = useState(
    initialPost?.importantInstructions?.join('\n') ||
      'Read official notification thoroughly before filling the online form.\nKeep all required documents ready in proper scanned size.\nVerify all details like Name, Father Name, and DOB before final submission.\nTake a printout of the final submitted application form.'
  );
  const [benefitsText, setBenefitsText] = useState(initialPost?.benefits?.join('\n') || '');
  const [eligibilityCriteriaText, setEligibilityCriteriaText] = useState(
    initialPost?.eligibilityCriteria?.join('\n') || ''
  );
  const [howToApplyStepsText, setHowToApplyStepsText] = useState(
    initialPost?.howToApplySteps?.join('\n') || ''
  );

  // Fee Structure
  const [feeGeneral, setFeeGeneral] = useState(initialPost?.feeStructure?.general || '₹100/-');
  const [feeObc, setFeeObc] = useState(initialPost?.feeStructure?.obc || '₹100/-');
  const [feeEws, setFeeEws] = useState(initialPost?.feeStructure?.ews || '₹100/-');
  const [feeSc, setFeeSc] = useState(initialPost?.feeStructure?.sc || '₹0/-');
  const [feeSt, setFeeSt] = useState(initialPost?.feeStructure?.st || '₹0/-');
  const [feeFemale, setFeeFemale] = useState(initialPost?.feeStructure?.female || '₹0/-');
  const [feeOther, setFeeOther] = useState(initialPost?.feeStructure?.phOrOther || '₹0/-');
  const [paymentMode, setPaymentMode] = useState(
    initialPost?.feeStructure?.paymentMode || 'Debit Card, Credit Card, Net Banking, UPI or Bank Challan'
  );

  // Age Limit
  const [minAge, setMinAge] = useState(initialPost?.ageLimit?.minAge || '18 Years');
  const [maxAge, setMaxAge] = useState(initialPost?.ageLimit?.maxAge || '27 - 30 Years');
  const [asOnDate, setAsOnDate] = useState(initialPost?.ageLimit?.asOnDate || '01/08/2026');
  const [ageRelaxation, setAgeRelaxation] = useState(
    initialPost?.ageLimit?.ageRelaxation || 'OBC: 3 Years | SC/ST: 5 Years | PwD: 10 Years as per rules'
  );

  // Vacancy Items
  const [vacancies, setVacancies] = useState<VacancyItem[]>(
    initialPost?.vacancies && initialPost.vacancies.length > 0
      ? initialPost.vacancies
      : [
          {
            id: 'v1',
            postName: 'Primary Executive Post',
            total: '1000',
            general: '450',
            obc: '270',
            ews: '100',
            sc: '120',
            st: '60',
            qualification: 'Bachelor Degree in any stream',
          },
        ]
  );

  // Important Links
  const [links, setLinks] = useState<ImportantLink[]>(
    initialPost?.importantLinks && initialPost.importantLinks.length > 0
      ? initialPost.importantLinks
      : [
          {
            id: 'l1',
            name: 'Apply Online',
            btnText: 'CLICK HERE',
            url: 'https://gov.in',
            type: 'apply',
            displayOrder: 1,
            enabled: true,
            openInNewTab: true,
          },
          {
            id: 'l2',
            name: 'Download Official Notification',
            btnText: 'CLICK HERE',
            url: 'https://gov.in',
            type: 'notification',
            displayOrder: 2,
            enabled: true,
            openInNewTab: true,
          },
          {
            id: 'l3',
            name: 'Download Syllabus',
            btnText: 'CLICK HERE',
            url: 'https://gov.in',
            type: 'syllabus',
            displayOrder: 3,
            enabled: true,
            openInNewTab: true,
          },
          {
            id: 'l4',
            name: 'Official Website',
            btnText: 'CLICK HERE',
            url: 'https://gov.in',
            type: 'official',
            displayOrder: 4,
            enabled: true,
            openInNewTab: true,
          },
        ]
  );

  // Official Source & SEO
  const [officialWebsiteName, setOfficialWebsiteName] = useState(
    initialPost?.officialSource?.websiteName || 'Official Board / Department Portal'
  );
  const [officialWebsiteUrl, setOfficialWebsiteUrl] = useState(
    initialPost?.officialSource?.websiteUrl || 'https://gov.in'
  );
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription || '');
  const [keywordsText, setKeywordsText] = useState(initialPost?.keywords?.join(', ') || '');
  const [ogImage, setOgImage] = useState(initialPost?.ogImage || initialPost?.featuredImage || '');
  const [ogTitle, setOgTitle] = useState(initialPost?.ogTitle || '');
  const [ogDescription, setOgDescription] = useState(initialPost?.ogDescription || '');
  const [twitterCard, setTwitterCard] = useState<'summary' | 'summary_large_image'>(
    (initialPost?.twitterCard as any) || 'summary_large_image'
  );
  const [twitterTitle, setTwitterTitle] = useState(initialPost?.twitterTitle || '');
  const [twitterDescription, setTwitterDescription] = useState(initialPost?.twitterDescription || '');
  const [twitterImage, setTwitterImage] = useState(initialPost?.twitterImage || '');
  const [twitterSite, setTwitterSite] = useState(initialPost?.twitterSite || '@shahnawazcc');
  const [twitterCreator, setTwitterCreator] = useState(initialPost?.twitterCreator || '@mohdshahnawaz');
  const [canonicalUrl, setCanonicalUrl] = useState(initialPost?.canonicalUrl || '');
  const [robotsIndex, setRobotsIndex] = useState(initialPost?.robotsIndex || 'index, follow');
  const [schemaType, setSchemaType] = useState(initialPost?.schemaType || 'JobPosting');

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialPost) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      if (!seoTitle) setSeoTitle(val);
    }
  };

  const handleAddVacancy = () => {
    setVacancies([
      ...vacancies,
      {
        id: `v-${Date.now()}`,
        postName: 'New Post Name',
        total: '100',
        general: '50',
        obc: '27',
        ews: '10',
        sc: '10',
        st: '3',
        qualification: 'Degree / 12th Pass',
      },
    ]);
  };

  const handleRemoveVacancy = (id: string) => {
    setVacancies(vacancies.filter((v) => v.id !== id));
  };

  const handleAddLink = () => {
    setLinks([
      ...links,
      {
        id: `l-${Date.now()}`,
        name: 'New Important Link',
        btnText: 'CLICK HERE',
        url: 'https://',
        type: 'other',
        displayOrder: links.length + 1,
        enabled: true,
        openInNewTab: true,
      },
    ]);
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const constructPostData = (): Partial<Post> => {
    const splitLines = (txt: string) =>
      txt
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

    return {
      type,
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: shortDescription.trim(),
      category: category.trim(),
      department: department.trim(),
      organization: organization.trim(),
      state: state.trim(),
      status,
      manualStatusOverride: manualStatusOverride ? (manualStatusOverride as ComputedStatus) : undefined,
      isFeatured,
      isPinned,
      startDate: startDate || undefined,
      lastDate: lastDate || undefined,
      feeLastDate: feeLastDate || undefined,
      correctionDate: correctionDate || undefined,
      examDate: examDate || undefined,
      admitCardDate: admitCardDate || undefined,
      resultDate: resultDate || undefined,
      answerKeyDate: answerKeyDate || undefined,
      objectionStartDate: objectionStartDate || undefined,
      objectionLastDate: objectionLastDate || undefined,
      totalVacancy: totalVacancy || undefined,
      vacancies,
      feeStructure: {
        general: feeGeneral,
        obc: feeObc,
        ews: feeEws,
        sc: feeSc,
        st: feeSt,
        female: feeFemale,
        phOrOther: feeOther,
        paymentMode,
      },
      ageLimit: {
        minAge,
        maxAge,
        asOnDate,
        ageRelaxation,
      },
      educationalQualification: educationalQualification || undefined,
      selectionProcess: splitLines(selectionProcessText),
      salaryPayScale: salaryPayScale || undefined,
      examPattern: examPattern || undefined,
      syllabus: syllabus || undefined,
      requiredDocuments: splitLines(requiredDocsText),
      importantInstructions: splitLines(importantInstructionsText),
      examCity: examCity || undefined,
      examCenterInfo: examCenterInfo || undefined,
      cutOffInfo: cutOffInfo || undefined,
      meritListInfo: meritListInfo || undefined,
      objectionFee: objectionFee || undefined,
      benefits: splitLines(benefitsText),
      eligibilityCriteria: splitLines(eligibilityCriteriaText),
      whoCanApply: whoCanApply || undefined,
      howToApplySteps: splitLines(howToApplyStepsText),
      importantLinks: links,
      officialSource: {
        websiteName: officialWebsiteName || 'Official Website',
        websiteUrl: officialWebsiteUrl || 'https://gov.in',
      },
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || shortDescription,
      keywords: keywordsText
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      ogTitle: ogTitle || seoTitle || title,
      ogDescription: ogDescription || metaDescription || shortDescription,
      ogImage: ogImage || undefined,
      ogType: 'article',
      twitterCard: twitterCard || 'summary_large_image',
      twitterTitle: twitterTitle || ogTitle || seoTitle || title,
      twitterDescription: twitterDescription || ogDescription || metaDescription || shortDescription,
      twitterImage: twitterImage || ogImage || undefined,
      twitterSite: twitterSite || '@shahnawazcc',
      twitterCreator: twitterCreator || '@mohdshahnawaz',
      featuredImage: ogImage || undefined,
      canonicalUrl: canonicalUrl || undefined,
      robotsIndex,
      schemaType,
    };
  };

  const handleSave = async (publishStatus?: PostStatus) => {
    if (!title.trim()) {
      setErrorMsg('Please enter a valid Post Title');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const dataToSave = constructPostData();
      if (publishStatus) {
        dataToSave.status = publishStatus;
      }

      const url = initialPost ? `/api/admin/posts/${initialPost.id}` : '/api/admin/posts';
      const method = initialPost ? 'PUT' : 'POST';

      let saved: Post | null = null;

      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSave),
        });

        if (res.ok) {
          saved = await res.json();
        }
      } catch {}

      if (!saved) {
        // Fallback for static host / Netlify
        const all = getClientPosts();
        if (initialPost) {
          const updatedPost: Post = {
            ...dataToSave,
            id: initialPost.id,
            views: initialPost.views || 0,
            createdAt: initialPost.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Post;
          const updatedList = all.map((p) => (p.id === initialPost.id ? updatedPost : p));
          saveClientPosts(updatedList);
          saved = updatedPost;
        } else {
          const newPost: Post = {
            ...dataToSave,
            id: `post-${Date.now()}`,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Post;
          saveClientPosts([newPost, ...all]);
          saved = newPost;
        }
      }

      if (saved) {
        onSaved(saved);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewPost = constructPostData() as Post;
  previewPost.id = initialPost?.id || 'preview-temp';
  previewPost.views = initialPost?.views || 0;
  previewPost.createdAt = initialPost?.createdAt || new Date().toISOString();
  previewPost.updatedAt = new Date().toISOString();

  return (
    <div
      id="universal-post-builder-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-[#0B2545] text-white p-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-red-600 rounded-lg text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight">
                {initialPost ? 'EDIT POST / RECRUITMENT' : '+ UNIVERSAL POST BUILDER'}
              </h2>
              <p className="text-xs text-blue-200 font-medium">
                Sarkari Naukri, Admit Card, Result, Answer Key, Syllabus, Yojana & Form Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-blue-950 p-1 rounded-lg flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  activeTab === 'form' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Form Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded font-bold flex items-center gap-1 transition-all ${
                  activeTab === 'preview' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 text-red-800 text-xs font-bold border-b border-red-200 flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {activeTab === 'form' ? (
            <div className="space-y-6">
              {/* Type & Basic Classification */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase text-[#0B2545] tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-red-600" />
                  <span>1. Select Post Type & Category</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {[
                    { label: 'Job / Naukri', val: 'job' },
                    { label: 'Admit Card', val: 'admit_card' },
                    { label: 'Result', val: 'result' },
                    { label: 'Answer Key', val: 'answer_key' },
                    { label: 'Sarkari Yojana', val: 'sarkari_yojana' },
                    { label: 'Scholarship', val: 'scholarship' },
                    { label: 'Admission', val: 'admission' },
                    { label: 'Syllabus', val: 'syllabus' },
                    { label: 'Online Form', val: 'online_form' },
                    { label: 'Exam Date / City', val: 'exam_date' },
                    { label: 'Important Notice', val: 'notice' },
                  ].map((t) => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setType(t.val as PostType)}
                      className={`p-2.5 rounded-lg text-xs font-black uppercase border text-center transition-all ${
                        type === t.val
                          ? 'bg-[#0B2545] text-white border-[#0B2545] shadow'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. SSC Jobs, UP Police, PM Schemes..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department / Board</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Staff Selection Commission (SSC)"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State / Scope</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="All India">All India</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Title & Short Description */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase text-[#0B2545] tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>2. Title, Slug & Summary</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Post Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. SSC CGL 2026 Notification, Apply Online for 14582 Posts"
                    className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">SEO URL Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. ssc-cgl-recruitment-2026"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Vacancies / Capacity</label>
                    <input
                      type="text"
                      value={totalVacancy}
                      onChange={(e) => setTotalVacancy(e.target.value)}
                      placeholder="e.g. 14,582 Posts or 60,244 Posts"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-semibold text-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Description / Key Highlights</label>
                  <textarea
                    rows={3}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief 2-3 sentence overview of this notification..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700"
                  />
                </div>
              </div>

              {/* Important Dates */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase text-[#0B2545] tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>3. Important Dates Matrix</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Application Start</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-red-700">Last Date to Apply</label>
                    <input
                      type="date"
                      value={lastDate}
                      onChange={(e) => setLastDate(e.target.value)}
                      className="w-full p-2 border border-red-300 rounded-lg bg-red-50/50 font-bold text-red-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fee Last Date</label>
                    <input
                      type="date"
                      value={feeLastDate}
                      onChange={(e) => setFeeLastDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Correction Date</label>
                    <input
                      type="text"
                      value={correctionDate}
                      onChange={(e) => setCorrectionDate(e.target.value)}
                      placeholder="e.g. 05-08 Oct 2026"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-blue-800">Exam Date</label>
                    <input
                      type="text"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      placeholder="e.g. 15 Nov 2026"
                      className="w-full p-2 border border-blue-300 rounded-lg bg-blue-50/50 font-bold text-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-amber-800">Admit Card Date</label>
                    <input
                      type="text"
                      value={admitCardDate}
                      onChange={(e) => setAdmitCardDate(e.target.value)}
                      placeholder="e.g. 05 Nov 2026"
                      className="w-full p-2 border border-amber-300 rounded-lg bg-amber-50/50 font-bold text-amber-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Result Date</label>
                    <input
                      type="text"
                      value={resultDate}
                      onChange={(e) => setResultDate(e.target.value)}
                      placeholder="e.g. Dec 2026"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Answer Key Date</label>
                    <input
                      type="text"
                      value={answerKeyDate}
                      onChange={(e) => setAnswerKeyDate(e.target.value)}
                      placeholder="e.g. 20 Nov 2026"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Application Fee & Age Limits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fee Structure */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="text-xs font-black uppercase text-[#0B2545] tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Application Fee</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">General</label>
                      <input
                        type="text"
                        value={feeGeneral}
                        onChange={(e) => setFeeGeneral(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">OBC / EWS</label>
                      <input
                        type="text"
                        value={feeObc}
                        onChange={(e) => setFeeObc(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">SC / ST / PH</label>
                      <input
                        type="text"
                        value={feeSc}
                        onChange={(e) => setFeeSc(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600">Payment Modes</label>
                      <input
                        type="text"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Age Limits */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="text-xs font-black uppercase text-[#0B2545] tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Age Limit & Relaxation</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">Minimum Age</label>
                      <input
                        type="text"
                        value={minAge}
                        onChange={(e) => setMinAge(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">Maximum Age</label>
                      <input
                        type="text"
                        value={maxAge}
                        onChange={(e) => setMaxAge(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">As On Date</label>
                      <input
                        type="text"
                        value={asOnDate}
                        onChange={(e) => setAsOnDate(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600">Age Relaxation</label>
                      <input
                        type="text"
                        value={ageRelaxation}
                        onChange={(e) => setAgeRelaxation(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vacancies Matrix */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-black uppercase text-[#0B2545] tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>4. Vacancy Details Table</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddVacancy}
                    className="px-2.5 py-1 text-xs bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1 hover:bg-emerald-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {vacancies.map((v, i) => (
                    <div
                      key={v.id || i}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-6 gap-2 text-xs items-center"
                    >
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500">Post Name</label>
                        <input
                          type="text"
                          value={v.postName}
                          onChange={(e) => {
                            const updated = [...vacancies];
                            updated[i].postName = e.target.value;
                            setVacancies(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Total Posts</label>
                        <input
                          type="text"
                          value={v.total}
                          onChange={(e) => {
                            const updated = [...vacancies];
                            updated[i].total = e.target.value;
                            setVacancies(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded font-bold text-emerald-700"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500">Qualification</label>
                        <input
                          type="text"
                          value={v.qualification || ''}
                          onChange={(e) => {
                            const updated = [...vacancies];
                            updated[i].qualification = e.target.value;
                            setVacancies(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded"
                        />
                      </div>
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVacancy(v.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications, Selection, Syllabus, Instructions */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase text-[#0B2545] tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>5. Qualifications & Detailed Sections</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Educational Qualification</label>
                    <textarea
                      rows={3}
                      value={educationalQualification}
                      onChange={(e) => setEducationalQualification(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Salary / Pay Scale</label>
                    <textarea
                      rows={3}
                      value={salaryPayScale}
                      onChange={(e) => setSalaryPayScale(e.target.value)}
                      placeholder="e.g. Level 4 (₹25,500 - ₹81,100)"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selection Process (1 per line)</label>
                    <textarea
                      rows={4}
                      value={selectionProcessText}
                      onChange={(e) => setSelectionProcessText(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Required Documents (1 per line)</label>
                    <textarea
                      rows={4}
                      value={requiredDocsText}
                      onChange={(e) => setRequiredDocsText(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exam Pattern Summary</label>
                    <textarea
                      rows={3}
                      value={examPattern}
                      onChange={(e) => setExamPattern(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Important Instructions (1 per line)</label>
                    <textarea
                      rows={3}
                      value={importantInstructionsText}
                      onChange={(e) => setImportantInstructionsText(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* SOME USEFUL IMPORTANT LINKS BUILDER */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-red-600 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h3 className="text-sm font-black uppercase text-red-700 tracking-wider flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      <span>6. SOME USEFUL IMPORTANT LINKS (2-Column Table)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Add links like Apply Online, Notification, Admit Card, Result, Official Portal
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-3 py-1.5 text-xs bg-red-600 text-white font-black uppercase rounded-lg flex items-center gap-1 hover:bg-red-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {links.map((lnk, i) => (
                    <div
                      key={lnk.id || i}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-300 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-600">Link Name</label>
                        <input
                          type="text"
                          value={lnk.name}
                          onChange={(e) => {
                            const updated = [...links];
                            updated[i].name = e.target.value;
                            setLinks(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600">Button Text</label>
                        <input
                          type="text"
                          value={lnk.btnText}
                          onChange={(e) => {
                            const updated = [...links];
                            updated[i].btnText = e.target.value;
                            setLinks(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded font-black text-red-600 text-center"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-600">Target URL</label>
                        <input
                          type="text"
                          value={lnk.url}
                          onChange={(e) => {
                            const updated = [...links];
                            updated[i].url = e.target.value;
                            setLinks(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded font-mono text-[11px]"
                        />
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(lnk.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Source & SEO */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-black uppercase text-[#0B2545] tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>7. Official Source & SEO Meta Tags</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const yr = '2026';
                      setSeoTitle(`${title} ${yr}: Apply Online, Eligibility & Notification | Shahnawaz Computer Center`.slice(0, 70));
                      setMetaDescription(`${title} online application form is active. Check eligibility, age limit, fee structure, and direct apply link at Shahnawaz Computer Center.`.slice(0, 160));
                      if (!keywordsText) {
                        setKeywordsText(`${title}, Sarkari Result, Apply Online, Sarkari Naukri, Shahnawaz Computer Center`);
                      }
                      if (!ogImage) {
                        setOgImage('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80');
                      }
                    }}
                    className="text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>Auto-Fill SEO</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Website Name</label>
                    <input
                      type="text"
                      value={officialWebsiteName}
                      onChange={(e) => setOfficialWebsiteName(e.target.value)}
                      placeholder="e.g. Staff Selection Commission"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Website URL</label>
                    <input
                      type="text"
                      value={officialWebsiteUrl}
                      onChange={(e) => setOfficialWebsiteUrl(e.target.value)}
                      placeholder="https://ssc.gov.in"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-slate-700">SEO / Meta Title (&lt;title&gt;)</label>
                      <span className="text-[10px] text-slate-400 font-mono">{seoTitle.length}/60 chars</span>
                    </div>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Leave empty to use Post Title"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-slate-700">Meta Description (&lt;meta name="description"&gt;)</label>
                      <span className="text-[10px] text-slate-400 font-mono">{metaDescription.length}/160 chars</span>
                    </div>
                    <textarea
                      rows={2}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Leave empty to use Short Description"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Meta Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={keywordsText}
                      onChange={(e) => setKeywordsText(e.target.value)}
                      placeholder="SSC CGL 2026, Apply Online SSC, Sarkari Naukri, Sarkari Result"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Social Card Image (og:image URL)</label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => {
                        setOgImage(e.target.value);
                        if (!twitterImage) setTwitterImage(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Twitter Card Format</label>
                    <select
                      value={twitterCard}
                      onChange={(e) => setTwitterCard(e.target.value as any)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold"
                    >
                      <option value="summary_large_image">summary_large_image (Large Hero Banner)</option>
                      <option value="summary">summary (Compact Square Thumbnail)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Twitter Account (@site)</label>
                    <input
                      type="text"
                      value={twitterSite}
                      onChange={(e) => setTwitterSite(e.target.value)}
                      placeholder="@shahnawazcc"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Robots Indexing</label>
                    <select
                      value={robotsIndex}
                      onChange={(e) => setRobotsIndex(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold"
                    >
                      <option value="index, follow">index, follow (Allow Search Indexing)</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Publishing Controls */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-black uppercase text-[#0B2545] tracking-wider border-b border-slate-200 pb-2">
                  8. Post Status & Visibility
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Post Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PostStatus)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="unpublished">Unpublished</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Manual Status Override</label>
                    <select
                      value={manualStatusOverride}
                      onChange={(e) => setManualStatusOverride(e.target.value as ComputedStatus | '')}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">Auto Calculated from Dates</option>
                      <option value="APPLY NOW">APPLY NOW</option>
                      <option value="CLOSING SOON">CLOSING SOON</option>
                      <option value="APPLICATION CLOSED">APPLICATION CLOSED</option>
                      <option value="ADMIT CARD AVAILABLE">ADMIT CARD AVAILABLE</option>
                      <option value="RESULT AVAILABLE">RESULT AVAILABLE</option>
                      <option value="ANSWER KEY OUT">ANSWER KEY OUT</option>
                      <option value="EXAM UPCOMING">EXAM UPCOMING</option>
                      <option value="UPCOMING">UPCOMING</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="isFeaturedCb"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <label htmlFor="isFeaturedCb" className="font-bold text-slate-800">
                      Feature on Homepage
                    </label>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="isPinnedCb"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600"
                    />
                    <label htmlFor="isPinnedCb" className="font-bold text-red-800">
                      Pin to Top of Lists
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Live Preview Tab */
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 font-bold text-center">
                👀 Live Post Preview — Exact rendering as normal visitors will see on Shahnawaz Computer Center
              </div>

              {/* Title & Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {(() => {
                    const st = calculatePostStatus(previewPost);
                    const b = getStatusBadgeConfig(st);
                    return (
                      <span className={`px-2.5 py-1 rounded text-xs font-black border ${b.bgClass} ${b.borderClass}`}>
                        {b.label}
                      </span>
                    );
                  })()}
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700">
                    {previewPost.category}
                  </span>
                  {previewPost.state && (
                    <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-800">
                      {previewPost.state}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] leading-tight">
                  {previewPost.title || 'Untitled Post Title'}
                </h1>
                {previewPost.shortDescription && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {previewPost.shortDescription}
                  </p>
                )}
              </div>

              {/* Dates & Fee preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-red-700 uppercase tracking-wider border-b border-slate-200 pb-1">
                    IMPORTANT DATES
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Application Begin:</span>
                      <span className="font-bold">{previewPost.startDate || 'Announced'}</span>
                    </div>
                    <div className="flex justify-between text-red-700 font-bold">
                      <span>Last Date to Apply:</span>
                      <span>{previewPost.lastDate || 'Check Notification'}</span>
                    </div>
                    {previewPost.examDate && (
                      <div className="flex justify-between text-blue-900 font-bold">
                        <span>Exam Date:</span>
                        <span>{previewPost.examDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-emerald-700 uppercase tracking-wider border-b border-slate-200 pb-1">
                    APPLICATION FEE
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">General / OBC / EWS:</span>
                      <span className="font-bold">{previewPost.feeStructure?.general}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">SC / ST / Female:</span>
                      <span className="font-bold">{previewPost.feeStructure?.sc}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vacancies table preview */}
              {previewPost.vacancies && previewPost.vacancies.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-[#0B2545] text-white">
                      <tr>
                        <th className="p-2.5">Post Name</th>
                        <th className="p-2.5 text-center">Total</th>
                        <th className="p-2.5">Eligibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {previewPost.vacancies.map((v, i) => (
                        <tr key={i}>
                          <td className="p-2.5 font-bold">{v.postName}</td>
                          <td className="p-2.5 text-center font-bold text-emerald-700">{v.total}</td>
                          <td className="p-2.5 text-slate-600">{v.qualification}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Important Links Preview */}
              <ImportantLinksTable
                links={previewPost.importantLinks}
                postId={previewPost.id}
                postTitle={previewPost.title}
              />
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('draft')}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('published')}
              className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Publish Post Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

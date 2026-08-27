import React, { useState } from 'react';
import {
  X,
  FileText,
  Image as ImageIcon,
  Calculator,
  Calendar,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Type,
  FileDown,
  Layers,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { SalaryCalculatorTab } from './SalaryCalculatorTab';

export interface SarkariToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter';
}

export const SarkariToolsModal: React.FC<SarkariToolsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'salary',
}) => {
  const [activeTab, setActiveTab] = useState<'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter'>(initialTab);

  // 1. Image Resizer / KB Compressor State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState('candidate-photo');
  const [targetKb, setTargetKb] = useState<number>(30); // 20KB - 50KB default
  const [targetWidth, setTargetWidth] = useState<number>(350);
  const [targetHeight, setTargetHeight] = useState<number>(450);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedSizeKb, setCompressedSizeKb] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // 2. Age Calculator State
  const [dob, setDob] = useState<string>('2000-01-01');
  const [asOnDate, setAsOnDate] = useState<string>('2026-07-01');
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  // 3. Name & Date on Photo State
  const [candName, setCandName] = useState<string>('RAHUL KUMAR');
  const [photoDate, setPhotoDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [photoWithDateUrl, setPhotoWithDateUrl] = useState<string | null>(null);

  // 4. Resume Builder State
  const [resumeData, setResumeData] = useState({
    name: 'Suresh Kumar',
    email: 'suresh.kumar@email.com',
    phone: '+91 98765 43210',
    address: 'Varanasi, Uttar Pradesh - 221001',
    fatherName: 'Rameshwar Prasad',
    dob: '15/08/1999',
    gender: 'Male',
    maritalStatus: 'Unmarried',
    nationality: 'Indian',
    objective: 'To secure a challenging position in a reputable government/private organization to utilize my skills and contribute towards organizational growth.',
    qualification: '10th (UP Board - 78%), 12th (UP Board - 82%), B.Sc Computer Science (BHU - 76%)',
    computerSkills: 'CCC, DCA, MS Office (Word, Excel, PPT), Internet & English/Hindi Typing',
    experience: '1 Year experience in Computer Operator & Data Entry at Common Service Center (CSC)',
    declaration: 'I hereby declare that all the information mentioned above is true and correct to the best of my knowledge.',
  });

  // Handle Photo Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSourceImage(result);
      processImageCompression(result, targetKb, targetWidth, targetHeight);
    };
    reader.readAsDataURL(file);
  };

  // Compress / Resize Image to Target KB
  const processImageCompression = (dataUrl: string, maxKb: number, width: number, height: number) => {
    setIsCompressing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Binary search quality to hit target KB
      let minQ = 0.05;
      let maxQ = 0.95;
      let bestDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      let bestSizeKb = Math.round((bestDataUrl.length * 3) / 4 / 1024);

      for (let i = 0; i < 6; i++) {
        const midQ = (minQ + maxQ) / 2;
        const currentData = canvas.toDataURL('image/jpeg', midQ);
        const currentKb = Math.round((currentData.length * 3) / 4 / 1024);
        bestDataUrl = currentData;
        bestSizeKb = currentKb;

        if (currentKb > maxKb) {
          maxQ = midQ;
        } else {
          minQ = midQ;
        }
      }

      setCompressedImage(bestDataUrl);
      setCompressedSizeKb(bestSizeKb);
      setIsCompressing(false);
    };
    img.src = dataUrl;
  };

  // Generate Photo with Name & Date Strip at Bottom
  const generatePhotoWithNameDate = () => {
    if (!sourceImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = 350;
      const h = 450;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw Main Photo
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h - 70);

      // Draw Bottom White Strip for Name & Date (SSC / NTA format)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, h - 70, w, 70);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, h - 69, w - 2, 68);

      // Draw Text
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(candName.toUpperCase(), w / 2, h - 42);

      ctx.font = 'bold 14px sans-serif';
      const formattedDate = photoDate.split('-').reverse().join('-');
      ctx.fillText(`DOP: ${formattedDate}`, w / 2, h - 18);

      setPhotoWithDateUrl(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = sourceImage;
  };

  // Calculate Age
  const handleCalculateAge = () => {
    if (!dob || !asOnDate) return;
    const birth = new Date(dob);
    const target = new Date(asOnDate);

    if (target < birth) {
      alert('Target "As on date" must be after Date of Birth!');
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setAgeResult({ years, months, days, totalDays });
  };

  // Print / Save Resume
  const handlePrintResume = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Curriculum Vitae - ${resumeData.name}</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 40px; color: #111; line-height: 1.5; }
          .header { text-align: center; border-bottom: 2px solid #800000; padding-bottom: 15px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; color: #800000; text-transform: uppercase; }
          .header p { margin: 4px 0; font-size: 13px; color: #444; }
          .section-title { font-size: 14px; font-weight: bold; color: #800000; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 18px; margin-bottom: 8px; }
          .info-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 12px; }
          .info-table td { padding: 4px 6px; vertical-align: top; }
          .info-table td.label { font-weight: bold; width: 160px; color: #222; }
          .content-box { font-size: 13px; margin-bottom: 12px; }
          .declaration { margin-top: 25px; font-size: 12px; font-style: italic; }
          .footer-sign { margin-top: 40px; display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${resumeData.name}</h1>
          <p>Email: ${resumeData.email} | Mobile: ${resumeData.phone}</p>
          <p>Address: ${resumeData.address}</p>
        </div>

        <div class="section-title">Career Objective</div>
        <div class="content-box">${resumeData.objective}</div>

        <div class="section-title">Academic & Educational Qualifications</div>
        <div class="content-box">${resumeData.qualification}</div>

        <div class="section-title">Technical / Computer Skills</div>
        <div class="content-box">${resumeData.computerSkills}</div>

        <div class="section-title">Work Experience</div>
        <div class="content-box">${resumeData.experience}</div>

        <div class="section-title">Personal Details</div>
        <table class="info-table">
          <tr><td class="label">Father's Name:</td><td>${resumeData.fatherName}</td></tr>
          <tr><td class="label">Date of Birth:</td><td>${resumeData.dob}</td></tr>
          <tr><td class="label">Gender:</td><td>${resumeData.gender}</td></tr>
          <tr><td class="label">Marital Status:</td><td>${resumeData.maritalStatus}</td></tr>
          <tr><td class="label">Nationality:</td><td>${resumeData.nationality}</td></tr>
        </table>

        <div class="section-title">Declaration</div>
        <div class="declaration">${resumeData.declaration}</div>

        <div class="footer-sign" style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div>Date: ........................<br/>Place: ........................</div>
          <div style="text-align: right;">( ${resumeData.name} )<br/>Signature</div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div
        id="sarkari-tools-modal"
        className="bg-white text-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#800000] via-[#A00000] to-[#800000] text-white px-5 py-4 flex items-center justify-between border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg tracking-wide uppercase">
                  Candidate & Student Online Tools Portal
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  Free Utility
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium">
                In-Hand Salary Calculator (7th CPC), Photo & Sign Resizer, DOB Age Calculator, Resume/CV Maker & Name on Photo Generator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS SELECTOR */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'salary', label: '💰 In-Hand Salary Calculator', icon: Wallet },
            { id: 'image', label: '📷 Photo & Sign Resizer (KB)', icon: ImageIcon },
            { id: 'photo_name', label: '🏷️ Name & Date on Photo', icon: Type },
            { id: 'age', label: '🎂 DOB Age Calculator', icon: Calculator },
            { id: 'resume', label: '📄 Online Resume / CV Maker', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#800000] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* SCROLLABLE TOOL WORKSPACE */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6">
          {/* TAB 0: IN-HAND SALARY CALCULATOR */}
          {activeTab === 'salary' && <SalaryCalculatorTab />}

          {/* 1. PHOTO & SIGN RESIZER TAB */}
          {activeTab === 'image' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">📌 Sarkari Form Instruction:</span> Most central & state recruitment forms (SSC, UPSC, UPSSSC, Railway, BPSC) require Passport Photo between <span className="font-bold">20KB to 50KB</span> (350x450 px) and Signature between <span className="font-bold">10KB to 20KB</span> (250x150 px). Upload your file below to resize instantly.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Settings & Upload */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-red-700" />
                    <span>1. Upload Candidate Photo or Signature</span>
                  </h4>

                  <label className="border-2 border-dashed border-slate-300 hover:border-red-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-red-50/50 transition-colors text-center">
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">Choose Image File (JPG, PNG)</span>
                    <span className="text-[10px] text-slate-400 mt-1">Drag & Drop or Click to Browse</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Preset Presets */}
                  <div>
                    <span className="text-xs font-bold text-slate-600 block mb-1.5">Quick Exam Presets:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setTargetKb(40);
                          setTargetWidth(350);
                          setTargetHeight(450);
                          if (sourceImage) processImageCompression(sourceImage, 40, 350, 450);
                        }}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-800 font-bold border border-slate-200 text-left"
                      >
                        <div>📷 Passport Photo</div>
                        <div className="text-[10px] text-slate-500 font-normal">20-50 KB (350x450px)</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetKb(15);
                          setTargetWidth(250);
                          setTargetHeight(120);
                          if (sourceImage) processImageCompression(sourceImage, 15, 250, 120);
                        }}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-800 font-bold border border-slate-200 text-left"
                      >
                        <div>✍️ Signature</div>
                        <div className="text-[10px] text-slate-500 font-normal">10-20 KB (250x120px)</div>
                      </button>
                    </div>
                  </div>

                  {/* Custom Controls */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Target File Size:</span>
                        <span className="text-red-700">{targetKb} KB</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={targetKb}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTargetKb(val);
                          if (sourceImage) processImageCompression(sourceImage, val, targetWidth, targetHeight);
                        }}
                        className="w-full accent-red-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Width (px)</label>
                        <input
                          type="number"
                          value={targetWidth}
                          onChange={(e) => setTargetWidth(Number(e.target.value))}
                          className="w-full p-2 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Height (px)</label>
                        <input
                          type="number"
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(Number(e.target.value))}
                          className="w-full p-2 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Preview & Download */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between items-center text-center space-y-4">
                  <h4 className="font-bold text-sm text-slate-800 w-full text-left flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>2. Output Preview & File Size</span>
                  </h4>

                  <div className="w-full min-h-[220px] bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center p-4">
                    {compressedImage ? (
                      <div className="space-y-2">
                        <img
                          src={compressedImage}
                          alt="Compressed Output"
                          className="max-h-56 mx-auto rounded shadow-sm border border-slate-300 bg-white"
                        />
                        <div className="text-xs font-bold text-slate-700">
                          Final File Size: <span className="text-emerald-700 font-extrabold">{compressedSizeKb} KB</span> (Target: {targetKb} KB)
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">
                        Upload an image on the left to see compressed preview
                      </div>
                    )}
                  </div>

                  {compressedImage && (
                    <a
                      href={compressedImage}
                      download={`${imageFileName}-resized-${targetKb}kb.jpg`}
                      className="w-full py-3 bg-[#800000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resized Image ({compressedSizeKb} KB)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. NAME & DATE ON PHOTO TAB */}
          {activeTab === 'photo_name' && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 leading-relaxed">
                <span className="font-bold">📌 SSC / NTA Mandate:</span> For SSC CGL, CHSL, GD, UP Police & NEET/JEE application forms, passport photos must have the candidate&apos;s Full Name and Date of Photo (DOP) printed clearly at the bottom on a white strip.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-700" />
                    <span>Candidate Name & Date of Photo</span>
                  </h4>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Candidate Full Name (Capital Letters)</label>
                    <input
                      type="text"
                      value={candName}
                      onChange={(e) => setCandName(e.target.value)}
                      placeholder="e.g. AMIT KUMAR"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Date of Photo (DOP)</label>
                    <input
                      type="date"
                      value={photoDate}
                      onChange={(e) => setPhotoDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Select Passport Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={generatePhotoWithNameDate}
                    className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Name & Date Photo</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between items-center text-center space-y-4">
                  <h4 className="font-bold text-sm text-slate-800 w-full text-left">
                    Generated Photo Preview (SSC Format)
                  </h4>

                  <div className="w-full min-h-[240px] bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center p-4">
                    {photoWithDateUrl ? (
                      <img
                        src={photoWithDateUrl}
                        alt="Photo with Name & Date"
                        className="max-h-64 mx-auto rounded shadow-md border-2 border-slate-400 bg-white"
                      />
                    ) : (
                      <div className="text-xs text-slate-400">
                        Upload photo and click &quot;Generate Name & Date Photo&quot; to see result
                      </div>
                    )}
                  </div>

                  {photoWithDateUrl && (
                    <a
                      href={photoWithDateUrl}
                      download={`ssc-photo-${candName.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                      className="w-full py-3 bg-[#800000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download SSC Photo with Name & Date</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. DOB AGE CALCULATOR TAB */}
          {activeTab === 'age' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 leading-relaxed">
                <span className="font-bold">🎂 Official Age Eligibility Check:</span> Calculate your exact completed Age in Years, Months, and Days as of the crucial &quot;Age Reckoning Date&quot; mentioned in official recruitment notifications (e.g. 01/01/2026 or 01/07/2026).
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Enter Birth & Reckoning Dates</span>
                  </h4>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Date of Birth (DOB as per 10th Matric Certificate)</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Age as on Date (Cut-off Date from Notification)</label>
                    <input
                      type="date"
                      value={asOnDate}
                      onChange={(e) => setAsOnDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>

                  {/* Preset Cutoff Date buttons */}
                  <div>
                    <span className="text-xs font-bold text-slate-500 block mb-1">Quick Cutoff Presets:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAsOnDate('2026-01-01')}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded font-bold"
                      >
                        01 Jan 2026
                      </button>
                      <button
                        type="button"
                        onClick={() => setAsOnDate('2026-07-01')}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded font-bold"
                      >
                        01 July 2026
                      </button>
                      <button
                        type="button"
                        onClick={() => setAsOnDate('2026-08-01')}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded font-bold"
                      >
                        01 Aug 2026
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCalculateAge}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Calculate Completed Age</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-center items-center text-center space-y-4">
                  <h4 className="font-bold text-sm text-slate-800 w-full text-left">
                    Age Calculation Result
                  </h4>

                  {ageResult ? (
                    <div className="w-full space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                          <div className="text-2xl sm:text-3xl font-black text-emerald-800">{ageResult.years}</div>
                          <div className="text-xs font-bold text-emerald-950">Years</div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                          <div className="text-2xl sm:text-3xl font-black text-emerald-800">{ageResult.months}</div>
                          <div className="text-xs font-bold text-emerald-950">Months</div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                          <div className="text-2xl sm:text-3xl font-black text-emerald-800">{ageResult.days}</div>
                          <div className="text-xs font-bold text-emerald-950">Days</div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 text-left">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Date of Birth:</span>
                          <span className="font-bold text-slate-800">{dob}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Age Reckoned As On:</span>
                          <span className="font-bold text-slate-800">{asOnDate}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1">
                          <span className="text-slate-500">Total Age in Days:</span>
                          <span className="font-bold text-emerald-700">{ageResult.totalDays.toLocaleString('en-IN')} Days</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-xs text-slate-400">
                      Select DOB and Cutoff date, then click &quot;Calculate Completed Age&quot;
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. ONLINE RESUME / CV MAKER TAB */}
          {activeTab === 'resume' && (
            <div className="space-y-5">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold">📄 Standard Formatted Biodata & Resume Maker:</span> Fill your personal, academic, and computer skill details below to instantly generate and print/download a standard PDF Curriculum Vitae.
                </div>
                <button
                  type="button"
                  onClick={handlePrintResume}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Print / Save CV</span>
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.name}
                      onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.email}
                      onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      value={resumeData.phone}
                      onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-600 block mb-1">Full Permanent Address</label>
                    <input
                      type="text"
                      value={resumeData.address}
                      onChange={(e) => setResumeData({ ...resumeData, address: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Father&apos;s Name</label>
                    <input
                      type="text"
                      value={resumeData.fatherName}
                      onChange={(e) => setResumeData({ ...resumeData, fatherName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Date of Birth</label>
                    <input
                      type="text"
                      value={resumeData.dob}
                      onChange={(e) => setResumeData({ ...resumeData, dob: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Gender</label>
                    <input
                      type="text"
                      value={resumeData.gender}
                      onChange={(e) => setResumeData({ ...resumeData, gender: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Marital Status</label>
                    <input
                      type="text"
                      value={resumeData.maritalStatus}
                      onChange={(e) => setResumeData({ ...resumeData, maritalStatus: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Academic & Educational Qualifications</label>
                  <textarea
                    rows={2}
                    value={resumeData.qualification}
                    onChange={(e) => setResumeData({ ...resumeData, qualification: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Technical / Computer Skills</label>
                  <input
                    type="text"
                    value={resumeData.computerSkills}
                    onChange={(e) => setResumeData({ ...resumeData, computerSkills: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Work Experience</label>
                  <input
                    type="text"
                    value={resumeData.experience}
                    onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            SarkariResult.com.cm Online Utility Tools • 100% Client-Side Private & Free
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors ml-auto cursor-pointer"
          >
            Close Tools
          </button>
        </div>
      </div>
    </div>
  );
};

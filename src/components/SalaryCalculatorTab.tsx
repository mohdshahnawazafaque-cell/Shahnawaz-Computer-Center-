import React, { useState, useMemo } from 'react';
import {
  Calculator,
  IndianRupee,
  Building2,
  Percent,
  CheckCircle2,
  Download,
  Copy,
  Printer,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight,
  Info,
  Check,
  Zap,
} from 'lucide-react';

interface PayLevelPreset {
  level: string;
  levelNumber: number;
  gradePay: number;
  entryBasic: number;
  group: string;
  defaultTaHigher: number;
  defaultTaOther: number;
  cghs: number;
  cgegis: number;
  popularPosts: string;
}

const PAY_LEVELS: PayLevelPreset[] = [
  {
    level: 'Level 1',
    levelNumber: 1,
    gradePay: 1800,
    entryBasic: 18000,
    group: 'Group C',
    defaultTaHigher: 1350,
    defaultTaOther: 900,
    cghs: 250,
    cgegis: 30,
    popularPosts: 'MTS, Peon, Track Maintainer, Helper',
  },
  {
    level: 'Level 2',
    levelNumber: 2,
    gradePay: 1900,
    entryBasic: 19900,
    group: 'Group C',
    defaultTaHigher: 1350,
    defaultTaOther: 900,
    cghs: 250,
    cgegis: 30,
    popularPosts: 'LDC, Junior Clerk, Accounts Clerk',
  },
  {
    level: 'Level 3',
    levelNumber: 3,
    gradePay: 2000,
    entryBasic: 21700,
    group: 'Group C',
    defaultTaHigher: 3600,
    defaultTaOther: 1800,
    cghs: 250,
    cgegis: 30,
    popularPosts: 'Police Constable, Steno Grade D, CISF/CRPF',
  },
  {
    level: 'Level 4',
    levelNumber: 4,
    gradePay: 2400,
    entryBasic: 25500,
    group: 'Group C',
    defaultTaHigher: 3600,
    defaultTaOther: 1800,
    cghs: 250,
    cgegis: 30,
    popularPosts: 'UDC, Tax Assistant, Postal Assistant, Forest Guard',
  },
  {
    level: 'Level 5',
    levelNumber: 5,
    gradePay: 2800,
    entryBasic: 29200,
    group: 'Group C',
    defaultTaHigher: 3600,
    defaultTaOther: 1800,
    cghs: 250,
    cgegis: 30,
    popularPosts: 'Auditor, Accountant, Sub-Inspector (State Police)',
  },
  {
    level: 'Level 6',
    levelNumber: 6,
    gradePay: 4200,
    entryBasic: 35400,
    group: 'Group B (Non-Gazetted)',
    defaultTaHigher: 3600,
    defaultTaOther: 1800,
    cghs: 450,
    cgegis: 60,
    popularPosts: 'ASO (CSS), Sub-Inspector (CPO/Delhi Police), Primary Teacher (PRT)',
  },
  {
    level: 'Level 7',
    levelNumber: 7,
    gradePay: 4600,
    entryBasic: 44900,
    group: 'Group B (Non-Gazetted)',
    defaultTaHigher: 3600,
    defaultTaOther: 1800,
    cghs: 650,
    cgegis: 60,
    popularPosts: 'Inspector (GST, IT, Central Excise, CBI), TGT, Section Officer',
  },
  {
    level: 'Level 8',
    levelNumber: 8,
    gradePay: 4800,
    entryBasic: 47600,
    group: 'Group B (Gazetted)',
    defaultTaHigher: 3600,
    defaultTaOther: 1800,
    cghs: 650,
    cgegis: 60,
    popularPosts: 'Assistant Accounts Officer (AAO CAG), PGT Teacher',
  },
  {
    level: 'Level 9',
    levelNumber: 9,
    gradePay: 5400,
    entryBasic: 53100,
    group: 'Group B (Gazetted)',
    defaultTaHigher: 7200,
    defaultTaOther: 3600,
    cghs: 650,
    cgegis: 60,
    popularPosts: 'Section Officer, Vice Principal, Senior Superintendent',
  },
  {
    level: 'Level 10',
    levelNumber: 10,
    gradePay: 5400,
    entryBasic: 56100,
    group: 'Group A (Gazetted)',
    defaultTaHigher: 7200,
    defaultTaOther: 3600,
    cghs: 650,
    cgegis: 120,
    popularPosts: 'UPSC CSE (IAS, IPS, IRS), Assistant Professor, SDM, DSP',
  },
  {
    level: 'Level 11',
    levelNumber: 11,
    gradePay: 6600,
    entryBasic: 67700,
    group: 'Group A (Gazetted)',
    defaultTaHigher: 7200,
    defaultTaOther: 3600,
    cghs: 650,
    cgegis: 120,
    popularPosts: 'Under Secretary, Executive Engineer, Joint Director',
  },
  {
    level: 'Level 12',
    levelNumber: 12,
    gradePay: 7600,
    entryBasic: 78800,
    group: 'Group A (Gazetted)',
    defaultTaHigher: 7200,
    defaultTaOther: 3600,
    cghs: 1000,
    cgegis: 120,
    popularPosts: 'Deputy Secretary, Director, Associate Professor',
  },
];

const POPULAR_JOB_SHORTCUTS = [
  { label: '🏛️ SSC CGL - Inspector (L-7)', level: 'Level 7', basic: 44900, city: 'X', role: 'Inspector (Central Excise / GST)' },
  { label: '💻 SSC CGL - ASO (L-6)', level: 'Level 6', basic: 35400, city: 'X', role: 'Assistant Section Officer (CSS)' },
  { label: '👮 Delhi Police SI (L-6)', level: 'Level 6', basic: 35400, city: 'X', role: 'Sub-Inspector (Executive)' },
  { label: '📝 SSC CHSL - LDC (L-2)', level: 'Level 2', basic: 19900, city: 'Y', role: 'Lower Division Clerk (LDC)' },
  { label: '🎖️ UPSC IAS/IPS (L-10)', level: 'Level 10', basic: 56100, city: 'X', role: 'Civil Services Officer' },
  { label: '🚂 Railway NTPC SM (L-6)', level: 'Level 6', basic: 35400, city: 'Y', role: 'Station Master / Traffic Apprentice' },
  { label: '🛡️ State Constable (L-3)', level: 'Level 3', basic: 21700, city: 'Y', role: 'Police Constable' },
  { label: '👨‍🏫 Primary Teacher (L-6)', level: 'Level 6', basic: 35400, city: 'Z', role: 'Primary Assistant Teacher' },
];

export const SalaryCalculatorTab: React.FC = () => {
  // State
  const [selectedLevelId, setSelectedLevelId] = useState<string>('Level 7');
  const [basicPay, setBasicPay] = useState<number>(44900);
  const [daPercent, setDaPercent] = useState<number>(50); // Current standard 7th CPC DA rate
  const [cityClass, setCityClass] = useState<'X' | 'Y' | 'Z' | 'NONE' | 'CUSTOM'>('X');
  const [customHraPercent, setCustomHraPercent] = useState<number>(30);
  const [tptaCityType, setTptaCityType] = useState<'higher' | 'other' | 'custom'>('higher');
  const [customTa, setCustomTa] = useState<number>(3600);
  const [otherAllowances, setOtherAllowances] = useState<number>(0);

  // Deductions State
  const [cghsAmount, setCghsAmount] = useState<number>(650);
  const [cgegisAmount, setCgegisAmount] = useState<number>(60);
  const [profTaxAmount, setProfTaxAmount] = useState<number>(200);
  const [monthlyTds, setMonthlyTds] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // Metadata for Salary Slip
  const [employeeName, setEmployeeName] = useState<string>('Candidate Name');
  const [designation, setDesignation] = useState<string>('Inspector (GST & Central Excise)');
  const [department, setDepartment] = useState<string>('Ministry of Finance / Central Govt');
  const [copied, setCopied] = useState<boolean>(false);

  // Active Level Preset
  const activeLevelPreset = useMemo(() => {
    return PAY_LEVELS.find((p) => p.level === selectedLevelId) || PAY_LEVELS[6];
  }, [selectedLevelId]);

  // Handler for changing level preset
  const handleLevelChange = (levelStr: string) => {
    setSelectedLevelId(levelStr);
    const preset = PAY_LEVELS.find((p) => p.level === levelStr);
    if (preset) {
      setBasicPay(preset.entryBasic);
      setCghsAmount(preset.cghs);
      setCgegisAmount(preset.cgegis);
      setCustomTa(tptaCityType === 'higher' ? preset.defaultTaHigher : preset.defaultTaOther);
    }
  };

  // Handler for Quick Job Shortcut
  const applyJobShortcut = (shortcut: typeof POPULAR_JOB_SHORTCUTS[0]) => {
    setSelectedLevelId(shortcut.level);
    setBasicPay(shortcut.basic);
    setCityClass(shortcut.city as any);
    setDesignation(shortcut.role);
    const preset = PAY_LEVELS.find((p) => p.level === shortcut.level);
    if (preset) {
      setCghsAmount(preset.cghs);
      setCgegisAmount(preset.cgegis);
      setCustomTa(shortcut.city === 'X' ? preset.defaultTaHigher : preset.defaultTaOther);
    }
  };

  // Calculations
  const daAmount = useMemo(() => {
    return Math.round((basicPay * daPercent) / 100);
  }, [basicPay, daPercent]);

  const effectiveHraPercent = useMemo(() => {
    if (cityClass === 'X') return 30; // Revised from 27% to 30% when DA crossed 50%
    if (cityClass === 'Y') return 20; // Revised from 18% to 20%
    if (cityClass === 'Z') return 10; // Revised from 9% to 10%
    if (cityClass === 'NONE') return 0;
    return customHraPercent;
  }, [cityClass, customHraPercent]);

  const hraAmount = useMemo(() => {
    return Math.round((basicPay * effectiveHraPercent) / 100);
  }, [basicPay, effectiveHraPercent]);

  const effectiveTa = useMemo(() => {
    if (tptaCityType === 'higher') return activeLevelPreset.defaultTaHigher;
    if (tptaCityType === 'other') return activeLevelPreset.defaultTaOther;
    return customTa;
  }, [tptaCityType, activeLevelPreset, customTa]);

  const daOnTaAmount = useMemo(() => {
    return Math.round((effectiveTa * daPercent) / 100);
  }, [effectiveTa, daPercent]);

  // Gross Salary
  const grossMonthlySalary = useMemo(() => {
    return basicPay + daAmount + hraAmount + effectiveTa + daOnTaAmount + otherAllowances;
  }, [basicPay, daAmount, hraAmount, effectiveTa, daOnTaAmount, otherAllowances]);

  // Standard NPS 10% (Basic + DA)
  const npsTier1Amount = useMemo(() => {
    return Math.round(((basicPay + daAmount) * 10) / 100);
  }, [basicPay, daAmount]);

  // Government Matching NPS Contribution 14%
  const govtNps14Amount = useMemo(() => {
    return Math.round(((basicPay + daAmount) * 14) / 100);
  }, [basicPay, daAmount]);

  // Total Deductions
  const totalMonthlyDeductions = useMemo(() => {
    return npsTier1Amount + cghsAmount + cgegisAmount + profTaxAmount + monthlyTds + otherDeductions;
  }, [npsTier1Amount, cghsAmount, cgegisAmount, profTaxAmount, monthlyTds, otherDeductions]);

  // Net In-Hand Salary
  const netInHandSalary = useMemo(() => {
    return Math.max(0, grossMonthlySalary - totalMonthlyDeductions);
  }, [grossMonthlySalary, totalMonthlyDeductions]);

  // Annual Totals
  const annualInHand = netInHandSalary * 12;
  const annualGross = grossMonthlySalary * 12;
  const annualCtcWithGovtNps = (grossMonthlySalary + govtNps14Amount) * 12;

  // Percentage shares for visual bar
  const basicShare = Math.round((basicPay / (grossMonthlySalary || 1)) * 100);
  const daShare = Math.round((daAmount / (grossMonthlySalary || 1)) * 100);
  const hraShare = Math.round((hraAmount / (grossMonthlySalary || 1)) * 100);
  const taShare = Math.round(((effectiveTa + daOnTaAmount) / (grossMonthlySalary || 1)) * 100);

  // Copy breakdown to clipboard
  const handleCopyBreakdown = () => {
    const text = `💰 SARKARI IN-HAND SALARY ESTIMATE (7th CPC)
----------------------------------------
📌 Post/Role: ${designation}
🏛️ Pay Scale: ${selectedLevelId} (Grade Pay: ₹${activeLevelPreset.gradePay})
📍 City Posting: Class ${cityClass} (${effectiveHraPercent}% HRA)
📊 DA Rate: ${daPercent}%

💵 MONTHLY EARNINGS (GROSS):
• Basic Pay: ₹${basicPay.toLocaleString('en-IN')}
• Dearness Allowance (DA @ ${daPercent}%): ₹${daAmount.toLocaleString('en-IN')}
• House Rent Allowance (HRA @ ${effectiveHraPercent}%): ₹${hraAmount.toLocaleString('en-IN')}
• Transport Allowance (TA + DA on TA): ₹${(effectiveTa + daOnTaAmount).toLocaleString('en-IN')}
${otherAllowances > 0 ? `• Other Allowances: ₹${otherAllowances.toLocaleString('en-IN')}\n` : ''}👉 GROSS SALARY: ₹${grossMonthlySalary.toLocaleString('en-IN')}/month

🔻 MONTHLY DEDUCTIONS:
• NPS Tier-1 (10% of BP+DA): ₹${npsTier1Amount.toLocaleString('en-IN')}
• CGHS (Health Scheme): ₹${cghsAmount.toLocaleString('en-IN')}
• CGEGIS (Group Insurance): ₹${cgegisAmount.toLocaleString('en-IN')}
• Professional Tax (PT): ₹${profTaxAmount.toLocaleString('en-IN')}
${monthlyTds > 0 ? `• Income Tax / TDS: ₹${monthlyTds.toLocaleString('en-IN')}\n` : ''}👉 TOTAL DEDUCTIONS: ₹${totalMonthlyDeductions.toLocaleString('en-IN')}/month

========================================
🎉 NET IN-HAND TAKE-HOME SALARY: ₹${netInHandSalary.toLocaleString('en-IN')}/Month
📈 ANNUAL IN-HAND: ₹${annualInHand.toLocaleString('en-IN')}/Year
💼 ANNUAL TOTAL CTC (with Govt 14% NPS): ₹${annualCtcWithGovtNps.toLocaleString('en-IN')}/Year
----------------------------------------
Calculated via SarkariResult Tools Portal`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Print Salary Slip Handler
  const handlePrintSalarySlip = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Estimated Salary Slip - ${employeeName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 30px; color: #111; font-size: 13px; }
          .slip-container { border: 2px solid #800000; padding: 20px; border-radius: 8px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #800000; padding-bottom: 12px; margin-bottom: 15px; }
          .header h2 { margin: 0; font-size: 20px; color: #800000; text-transform: uppercase; letter-spacing: 0.5px; }
          .header p { margin: 3px 0; font-size: 12px; color: #555; }
          .header .badge { display: inline-block; background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; margin-top: 4px; }
          
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; background: #fdfdfd; }
          .meta-table td { padding: 6px 10px; border: 1px solid #e0e0e0; font-size: 12px; }
          .meta-table .label { font-weight: bold; color: #444; width: 25%; background: #f9f9f9; }
          
          .salary-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .salary-table th { background: #800000; color: white; padding: 8px 10px; text-align: left; font-size: 12px; text-transform: uppercase; border: 1px solid #800000; }
          .salary-table td { padding: 7px 10px; border: 1px solid #ddd; font-size: 12px; }
          .salary-table .amount { text-align: right; font-family: monospace; font-weight: bold; }
          .salary-table .total-row { background: #f2f2f2; font-weight: bold; }
          
          .net-box { background: #e8f5e9; border: 2px solid #2e7d32; padding: 12px 20px; border-radius: 6px; text-align: center; margin: 15px 0; }
          .net-box h3 { margin: 0; font-size: 18px; color: #1b5e20; }
          .net-box p { margin: 4px 0 0 0; font-size: 12px; color: #388e3c; }
          
          .footer-note { font-size: 11px; color: #777; margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 10px; line-height: 1.4; }
        </style>
      </head>
      <body>
        <div class="slip-container">
          <div class="header">
            <h2>Government of India / State Government</h2>
            <p><strong>ESTIMATED MONTHLY SALARY STATEMENT (7th PAY COMMISSION)</strong></p>
            <span class="badge">For Candidate Reference & Planning</span>
          </div>

          <table class="meta-table">
            <tr>
              <td class="label">Employee Name:</td>
              <td><strong>${employeeName}</strong></td>
              <td class="label">Pay Matrix Level:</td>
              <td><strong>${selectedLevelId} (Grade Pay ₹${activeLevelPreset.gradePay})</strong></td>
            </tr>
            <tr>
              <td class="label">Designation / Post:</td>
              <td>${designation}</td>
              <td class="label">Group / Cadre:</td>
              <td>${activeLevelPreset.group}</td>
            </tr>
            <tr>
              <td class="label">Department / Ministry:</td>
              <td>${department}</td>
              <td class="label">Posting City Class:</td>
              <td>Class ${cityClass} (${effectiveHraPercent}% HRA)</td>
            </tr>
            <tr>
              <td class="label">Dearness Allowance (DA):</td>
              <td>${daPercent}% of Basic Pay</td>
              <td class="label">Pension Scheme:</td>
              <td>NPS Tier-1 (10% BP+DA)</td>
            </tr>
          </table>

          <table class="salary-table">
            <thead>
              <tr>
                <th style="width: 50%;">Earnings (Allowances)</th>
                <th style="width: 50%;">Deductions (Govt & Tax)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td>Basic Pay (BP):</td><td class="amount">₹${basicPay.toLocaleString('en-IN')}</td></tr>
                    <tr><td>Dearness Allowance (DA @ ${daPercent}%):</td><td class="amount">₹${daAmount.toLocaleString('en-IN')}</td></tr>
                    <tr><td>House Rent Allowance (HRA @ ${effectiveHraPercent}%):</td><td class="amount">₹${hraAmount.toLocaleString('en-IN')}</td></tr>
                    <tr><td>Transport Allowance (TA):</td><td class="amount">₹${effectiveTa.toLocaleString('en-IN')}</td></tr>
                    <tr><td>DA on Transport Allowance:</td><td class="amount">₹${daOnTaAmount.toLocaleString('en-IN')}</td></tr>
                    ${otherAllowances > 0 ? `<tr><td>Other Special Allowances:</td><td class="amount">₹${otherAllowances.toLocaleString('en-IN')}</td></tr>` : ''}
                  </table>
                </td>
                <td style="vertical-align: top;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td>NPS Tier-1 Employee (10%):</td><td class="amount">₹${npsTier1Amount.toLocaleString('en-IN')}</td></tr>
                    <tr><td>CGHS (Health Insurance):</td><td class="amount">₹${cghsAmount.toLocaleString('en-IN')}</td></tr>
                    <tr><td>CGEGIS (Group Insurance):</td><td class="amount">₹${cgegisAmount.toLocaleString('en-IN')}</td></tr>
                    <tr><td>Professional Tax (PT):</td><td class="amount">₹${profTaxAmount.toLocaleString('en-IN')}</td></tr>
                    ${monthlyTds > 0 ? `<tr><td>Income Tax / TDS:</td><td class="amount">₹${monthlyTds.toLocaleString('en-IN')}</td></tr>` : ''}
                    ${otherDeductions > 0 ? `<tr><td>Other Deductions:</td><td class="amount">₹${otherDeductions.toLocaleString('en-IN')}</td></tr>` : ''}
                  </table>
                </td>
              </tr>
              <tr class="total-row">
                <td>
                  <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                    <span>GROSS EARNINGS (A):</span>
                    <span class="amount" style="color: #800000;">₹${grossMonthlySalary.toLocaleString('en-IN')}</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                    <span>TOTAL DEDUCTIONS (B):</span>
                    <span class="amount" style="color: #c62828;">₹${totalMonthlyDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="net-box">
            <h3>NET TAKE-HOME / IN-HAND SALARY: ₹${netInHandSalary.toLocaleString('en-IN')} / month</h3>
            <p>Annual In-Hand Total: <strong>₹${annualInHand.toLocaleString('en-IN')}</strong> | Annual CTC (with ₹${(govtNps14Amount * 12).toLocaleString('en-IN')} Govt 14% NPS): <strong>₹${annualCtcWithGovtNps.toLocaleString('en-IN')}</strong></p>
          </div>

          <div class="footer-note">
            * <strong>Disclaimer:</strong> This is a computer-generated estimate computed using standard 7th Central Pay Commission guidelines, prevailing DA rates, and standard statutory deductions. Actual in-hand take-home salary may vary marginally based on state-specific professional taxes, individual income tax slabs, and department allowances.
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Informative Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-[#800000] to-red-900 text-white p-4 sm:p-5 rounded-2xl border border-red-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                7th CPC Standard Engine
              </span>
              <span className="text-xs text-amber-200 font-bold">
                Updated DA: 50% & Revised HRA (30%/20%/10%)
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black uppercase tracking-tight">
              Sarkari In-Hand Salary Calculator
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
              Calculate exact monthly in-hand take-home pay, allowances (DA, HRA, TA), and statutory deductions (NPS, CGHS, CGEGIS, Professional Tax) for any Central or State Government job post.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={handlePrintSalarySlip}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Salary Slip</span>
            </button>
            <button
              type="button"
              onClick={handleCopyBreakdown}
              className="px-3.5 py-2 bg-white dark:bg-slate-800/10 hover:bg-white dark:bg-slate-800/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick 1-Click Job Preset Shortcuts */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> 1-Click Popular Sarkari Job Presets:
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Click to auto-configure Pay Level & Basic Pay
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {POPULAR_JOB_SHORTCUTS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyJobShortcut(item)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-red-50/70 border border-slate-200 dark:border-slate-700 hover:border-[#800000] text-slate-800 dark:text-slate-100 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#800000] truncate">
                {item.label}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Basic ₹{item.basic.toLocaleString('en-IN')} • City {item.city}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Inputs & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Configurations (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Pay Scale & Basic Pay Card */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#800000] flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Pay Matrix Level & Basic Pay
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">7th Central Pay Commission Matrix Scale</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Select Pay Matrix Level:
                </label>
                <select
                  value={selectedLevelId}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
                >
                  {PAY_LEVELS.map((lvl) => (
                    <option key={lvl.level} value={lvl.level}>
                      {lvl.level} (Grade Pay ₹{lvl.gradePay} - {lvl.group})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic line-clamp-1">
                  Ex: {activeLevelPreset.popularPosts}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Monthly Basic Pay (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={basicPay}
                    onChange={(e) => setBasicPay(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
                  />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Entry Level: ₹{activeLevelPreset.entryBasic.toLocaleString('en-IN')} (editable for increments)
                </div>
              </div>
            </div>

            {/* Dearness Allowance Slider */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>Dearness Allowance (DA %):</span>
                <span className="text-[#800000] font-black">{daPercent}% (= ₹{daAmount.toLocaleString('en-IN')})</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={daPercent}
                onChange={(e) => setDaPercent(Number(e.target.value))}
                className="w-full accent-[#800000]"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span className="text-[#800000] font-bold">Current 7th CPC Standard: 50%</span>
                <span>80%</span>
              </div>
            </div>
          </div>

          {/* 2. City Class & Allowances Card */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  City Posting & House Rent Allowance (HRA)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">HRA rates revised to 30%, 20%, 10% after 50% DA</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'X', label: 'Class X (30%)', sub: 'Delhi, Mumbai, Metro' },
                { id: 'Y', label: 'Class Y (20%)', sub: 'State Capitals, Tier-2' },
                { id: 'Z', label: 'Class Z (10%)', sub: 'Rural, Small Towns' },
                { id: 'NONE', label: 'Govt Quarter (0%)', sub: 'HRA Not Applicable' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCityClass(c.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    cityClass === c.id
                      ? 'bg-red-50 border-[#800000] text-[#800000] font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="font-bold">{c.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">{c.sub}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Transport Allowance (TPTA):
                </label>
                <select
                  value={tptaCityType}
                  onChange={(e) => setTptaCityType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100"
                >
                  <option value="higher">
                    Higher TPTA City (₹{activeLevelPreset.defaultTaHigher} + DA)
                  </option>
                  <option value="other">
                    Other City / Normal (₹{activeLevelPreset.defaultTaOther} + DA)
                  </option>
                  <option value="custom">Custom Transport Amount</option>
                </select>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  TA: ₹{effectiveTa} + DA on TA (50%): ₹{daOnTaAmount} = <strong className="text-slate-800 dark:text-slate-100">₹{(effectiveTa + daOnTaAmount).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Other / Special Allowances (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={otherAllowances}
                    onChange={(e) => setOtherAllowances(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Uniform, NPA, Risk, Night Duty or Hard Area allowance
                </div>
              </div>
            </div>
          </div>

          {/* 3. Statutory Government Deductions Card */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Standard Statutory Deductions
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">NPS Pension, CGHS Health Scheme & Insurance</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">NPS Tier-1 (10%)</span>
                <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                  ₹{npsTier1Amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400">10% of (BP + DA)</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  CGHS / Medical (₹):
                </label>
                <input
                  type="number"
                  value={cghsAmount}
                  onChange={(e) => setCghsAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  CGEGIS Insurance (₹):
                </label>
                <input
                  type="number"
                  value={cgegisAmount}
                  onChange={(e) => setCgegisAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Professional Tax (₹):
                </label>
                <input
                  type="number"
                  value={profTaxAmount}
                  onChange={(e) => setProfTaxAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Monthly TDS / Tax (₹):
                </label>
                <input
                  type="number"
                  value={monthlyTds}
                  onChange={(e) => setMonthlyTds(Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Other Deductions (₹):
                </label>
                <input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
                />
              </div>
            </div>

            {/* Government 14% NPS Benefit Box */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Govt 14% NPS Share:</strong> Additional <strong className="text-emerald-800">₹{govtNps14Amount.toLocaleString('en-IN')}/mo</strong> deposited directly to your pension account by the government.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: In-Hand Salary Summary & Detailed Pay Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Big In-Hand Take-Home Card */}
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 rounded-2xl shadow-lg border border-emerald-600 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-600/60 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
                  Estimated Take-Home Pay
                </span>
                <h3 className="text-xs text-white/90 font-medium">Monthly Bank Account Credit</h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800/10 flex items-center justify-center font-bold text-emerald-200">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>

            <div className="text-center py-2">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xs">
                ₹{netInHandSalary.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-bold text-emerald-200 mt-1">
                Net In-Hand Salary / Month
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-600/60 text-xs">
              <div className="bg-white dark:bg-slate-800/10 p-3 rounded-xl backdrop-blur-xs">
                <div className="text-[11px] text-emerald-200">Annual In-Hand</div>
                <div className="text-base font-black text-white mt-0.5">
                  ₹{annualInHand.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/10 p-3 rounded-xl backdrop-blur-xs">
                <div className="text-[11px] text-emerald-200">Annual Total CTC</div>
                <div className="text-base font-black text-white mt-0.5">
                  ₹{annualCtcWithGovtNps.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Salary Breakdown Progress Bar */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
            <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-between">
              <span>Gross Salary Composition</span>
              <span className="text-[#800000]">₹{grossMonthlySalary.toLocaleString('en-IN')}</span>
            </div>

            <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${basicShare}%` }}
                className="bg-[#800000] h-full"
                title={`Basic Pay: ${basicShare}%`}
              />
              <div
                style={{ width: `${daShare}%` }}
                className="bg-amber-500 h-full"
                title={`DA: ${daShare}%`}
              />
              <div
                style={{ width: `${hraShare}%` }}
                className="bg-blue-500 h-full"
                title={`HRA: ${hraShare}%`}
              />
              <div
                style={{ width: `${taShare}%` }}
                className="bg-emerald-500 h-full"
                title={`TA: ${taShare}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#800000] shrink-0" />
                <span>Basic: <strong>{basicShare}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>DA (50%): <strong>{daShare}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span>HRA ({effectiveHraPercent}%): <strong>{hraShare}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>TA + DA: <strong>{taShare}%</strong></span>
              </div>
            </div>
          </div>

          {/* Itemized Table Breakdown */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3 text-xs">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight border-b border-slate-100 dark:border-slate-700 pb-2">
              Itemized Earnings & Deductions
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 dark:text-slate-300">Basic Pay</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{basicPay.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 dark:text-slate-300">Dearness Allowance (DA @ {daPercent}%)</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{daAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 dark:text-slate-300">House Rent Allowance (HRA @ {effectiveHraPercent}%)</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{hraAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 dark:text-slate-300">Transport Allowance (TA + DA)</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{(effectiveTa + daOnTaAmount).toLocaleString('en-IN')}</span>
              </div>
              {otherAllowances > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600 dark:text-slate-300">Other Allowances</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{otherAllowances.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 bg-slate-50 dark:bg-slate-700 px-2 rounded-lg font-black text-slate-900 dark:text-white">
                <span>TOTAL GROSS SALARY:</span>
                <span className="text-[#800000]">₹{grossMonthlySalary.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>NPS Deduction (10% BP+DA):</span>
                  <span className="text-red-700 font-semibold">- ₹{npsTier1Amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>CGHS + CGEGIS + PT + Tax:</span>
                  <span className="text-red-700 font-semibold">
                    - ₹{(cghsAmount + cgegisAmount + profTaxAmount + monthlyTds + otherDeductions).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 bg-red-50/70 px-2 rounded-lg font-black text-red-950">
                  <span>TOTAL DEDUCTIONS:</span>
                  <span className="text-red-700">- ₹{totalMonthlyDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Download,
  Trash2,
  ExternalLink,
  Eye,
  Layers,
  Sparkles,
  Search,
  Database,
  ArrowRight,
  HelpCircle,
  Copy,
  Check,
  Globe,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface BulkGovRecordInput {
  title: string;
  organization: string;
  category: 'Vacancy' | 'Admit Card' | 'Result' | string;
  state?: string;
  publishDate?: string;
  lastDate?: string;
  examDate?: string;
  officialNotificationUrl?: string;
  officialApplyUrl?: string;
  officialAdmitCardUrl?: string;
  officialResultUrl?: string;
  sourceUrl?: string;
  status?: 'Active' | 'Closed' | 'Released' | 'Old' | string;
  totalVacancy?: string;
  educationalQualification?: string;
  shortDescription?: string;
}

interface ValidatedRecord extends BulkGovRecordInput {
  _id: string;
  _isValid: boolean;
  _errors: string[];
  _warnings: string[];
  _isDuplicate?: boolean;
}

interface BulkGovernmentDataImportProps {
  onSuccess: () => void;
}

export const BulkGovernmentDataImport: React.FC<BulkGovernmentDataImportProps> = ({ onSuccess }) => {
  const { token } = useAuth();

  const [activeMode, setActiveMode] = useState<'verified' | 'upload' | 'text'>('verified');
  const [rawText, setRawText] = useState('');
  const [parsedRecords, setParsedRecords] = useState<ValidatedRecord[]>([]);
  const [filterPreview, setFilterPreview] = useState<'all' | 'valid' | 'errors'>('all');
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [updateDuplicates, setUpdateDuplicates] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    totalProcessed: number;
    importedCount: number;
    updatedCount: number;
    skippedCount: number;
    errors: string[];
  } | null>(null);

  const [previewSearch, setPreviewSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to validate URL
  const isValidUrl = (url?: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;
    try {
      const parsed = new URL(trimmed);
      return Boolean(parsed.hostname && parsed.hostname.includes('.'));
    } catch {
      return false;
    }
  };

  // Convert raw records to validated records
  const validateRecords = (records: any[]): ValidatedRecord[] => {
    return records.map((rec, idx) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!rec.title || typeof rec.title !== 'string' || !rec.title.trim()) {
        errors.push("Missing required field 'title'.");
      }
      if (!rec.organization || typeof rec.organization !== 'string' || !rec.organization.trim()) {
        warnings.push("Missing 'organization' (defaults to Government Authority).");
      }
      if (!rec.category || typeof rec.category !== 'string') {
        warnings.push("Missing 'category' (defaults to Vacancy).");
      }

      // Validate URLs
      if (rec.officialApplyUrl && !isValidUrl(rec.officialApplyUrl)) {
        errors.push(`Invalid Apply URL format: '${rec.officialApplyUrl}'`);
      }
      if (rec.officialAdmitCardUrl && !isValidUrl(rec.officialAdmitCardUrl)) {
        errors.push(`Invalid Admit Card URL format: '${rec.officialAdmitCardUrl}'`);
      }
      if (rec.officialResultUrl && !isValidUrl(rec.officialResultUrl)) {
        errors.push(`Invalid Result URL format: '${rec.officialResultUrl}'`);
      }
      if (rec.officialNotificationUrl && !isValidUrl(rec.officialNotificationUrl)) {
        errors.push(`Invalid Notification URL format: '${rec.officialNotificationUrl}'`);
      }
      if (rec.sourceUrl && !isValidUrl(rec.sourceUrl)) {
        errors.push(`Invalid Source URL format: '${rec.sourceUrl}'`);
      }

      const hasAnyOfficialUrl =
        isValidUrl(rec.officialApplyUrl) ||
        isValidUrl(rec.officialAdmitCardUrl) ||
        isValidUrl(rec.officialResultUrl) ||
        isValidUrl(rec.officialNotificationUrl) ||
        isValidUrl(rec.sourceUrl);

      if (!hasAnyOfficialUrl) {
        warnings.push('No official URL provided. Website homepage fallback will be used.');
      }

      return {
        ...rec,
        _id: `rec-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        _isValid: errors.length === 0,
        _errors: errors,
        _warnings: warnings,
      };
    });
  };

  // CSV to Objects parser
  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const results: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Regex for CSV with quoted fields
      const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      if (!row || row.length === 0) continue;

      const obj: any = {};
      headers.forEach((h, hIdx) => {
        let val = row[hIdx] ? row[hIdx].trim().replace(/^["']|["']$/g, '') : '';
        obj[h] = val;
      });
      if (obj.title) {
        results.push(obj);
      }
    }
    return results;
  };

  // Handle File Upload (JSON or CSV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;

      try {
        if (file.name.endsWith('.json') || content.trim().startsWith('[') || content.trim().startsWith('{')) {
          const parsed = JSON.parse(content);
          const list = Array.isArray(parsed) ? parsed : [parsed];
          const validated = validateRecords(list);
          setParsedRecords(validated);
          setRawText(JSON.stringify(list, null, 2));
        } else {
          // Assume CSV
          const csvObjects = parseCSV(content);
          const validated = validateRecords(csvObjects);
          setParsedRecords(validated);
          setRawText(content);
        }
      } catch (err: any) {
        alert(`Failed to parse file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Handle Raw Text Parse
  const handleParseText = () => {
    if (!rawText.trim()) return;
    try {
      if (rawText.trim().startsWith('[') || rawText.trim().startsWith('{')) {
        const parsed = JSON.parse(rawText.trim());
        const list = Array.isArray(parsed) ? parsed : [parsed];
        setParsedRecords(validateRecords(list));
      } else {
        const csvObjects = parseCSV(rawText.trim());
        setParsedRecords(validateRecords(csvObjects));
      }
    } catch (err: any) {
      alert(`Invalid JSON format: ${err.message}`);
    }
  };

  // Download Sample JSON
  const downloadSampleJson = () => {
    const sample = [
      {
        title: 'SSC Combined Graduate Level (CGL) 2026',
        organization: 'Staff Selection Commission (SSC)',
        category: 'Vacancy',
        state: 'All India',
        publishDate: '2026-06-15',
        lastDate: '2026-07-24',
        examDate: '2026-09-15 to 2026-09-28',
        officialNotificationUrl: 'https://ssc.gov.in',
        officialApplyUrl: 'https://ssc.gov.in',
        sourceUrl: 'https://ssc.gov.in',
        status: 'Active',
        totalVacancy: '14,582 Posts',
        educationalQualification: 'Graduation in any discipline',
        shortDescription: 'SSC CGL recruitment for Group B & C posts across Central Ministries.',
      },
      {
        title: 'UP Police Constable 2026 Written Exam Admit Card',
        organization: 'UP Police Recruitment and Promotion Board (UPPRPB)',
        category: 'Admit Card',
        state: 'Uttar Pradesh',
        publishDate: '2026-08-16',
        examDate: '2026-08-23 to 2026-08-31',
        officialNotificationUrl: 'https://uppbpb.gov.in',
        officialAdmitCardUrl: 'https://uppbpb.gov.in',
        sourceUrl: 'https://uppbpb.gov.in',
        status: 'Released',
        shortDescription: 'Download official E-Admit Card for UP Police Constable 60,244 posts.',
      },
      {
        title: 'UPSC Civil Services (IAS) 2026 Final Selection Result',
        organization: 'Union Public Service Commission (UPSC)',
        category: 'Result',
        state: 'All India',
        publishDate: '2026-04-16',
        officialNotificationUrl: 'https://upsc.gov.in',
        officialResultUrl: 'https://upsc.gov.in',
        sourceUrl: 'https://upsc.gov.in',
        status: 'Released',
        shortDescription: 'Final recommended list for IAS, IFS, IPS and Central Services.',
      },
    ];

    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'government-data-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Sample CSV
  const downloadSampleCsv = () => {
    const csvContent =
      'title,organization,category,state,publishDate,lastDate,examDate,officialNotificationUrl,officialApplyUrl,officialAdmitCardUrl,officialResultUrl,sourceUrl,status,totalVacancy,shortDescription\n' +
      '"SSC CGL 2026","Staff Selection Commission (SSC)","Vacancy","All India","2026-06-15","2026-07-24","2026-09-15","https://ssc.gov.in","https://ssc.gov.in","","","https://ssc.gov.in","Active","14,582 Posts","SSC CGL Group B & C Vacancies"\n' +
      '"UP Police Constable Admit Card 2026","UPPRPB","Admit Card","Uttar Pradesh","2026-08-16","","2026-08-23","https://uppbpb.gov.in","","https://uppbpb.gov.in","","https://uppbpb.gov.in","Released","60,244 Posts","UP Police Constable Hall Ticket"\n' +
      '"UPSC IAS Final Result 2026","Union Public Service Commission (UPSC)","Result","All India","2026-04-16","","","https://upsc.gov.in","","","https://upsc.gov.in","https://upsc.gov.in","Released","","UPSC CSE Final Merit List"';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'government-data-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Execute Bulk Import to Server API
  const handleExecuteImport = async () => {
    if (parsedRecords.length === 0) {
      alert('Please upload or enter records to import.');
      return;
    }

    const validOnly = parsedRecords.filter((r) => r._isValid);
    if (validOnly.length === 0) {
      alert('No valid records found to import. Please fix the highlighted errors first.');
      return;
    }

    setIsProcessing(true);
    setImportResult(null);

    try {
      const payloadRecords = validOnly.map((r) => {
        const { _id, _isValid, _errors, _warnings, _isDuplicate, ...pureRecord } = r;
        return pureRecord;
      });

      const res = await fetch('/api/admin/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          records: payloadRecords,
          options: {
            skipDuplicates: !updateDuplicates,
            updateDuplicates: updateDuplicates,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setImportResult({
          success: true,
          message: data.message || 'Records imported successfully.',
          totalProcessed: data.totalProcessed || payloadRecords.length,
          importedCount: data.importedCount || 0,
          updatedCount: data.updatedCount || 0,
          skippedCount: data.skippedCount || 0,
          errors: data.errors || [],
        });
        onSuccess();
      } else {
        setImportResult({
          success: false,
          message: data.error || 'Bulk import failed.',
          totalProcessed: payloadRecords.length,
          importedCount: 0,
          updatedCount: 0,
          skippedCount: payloadRecords.length,
          errors: data.errors || [data.error],
        });
      }
    } catch (err: any) {
      setImportResult({
        success: false,
        message: err.message || 'Network error during bulk import.',
        totalProcessed: parsedRecords.length,
        importedCount: 0,
        updatedCount: 0,
        skippedCount: parsedRecords.length,
        errors: [err.message],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Load Verified Pre-built Government Feeds Directly
  const handleLoadVerifiedCatalog = async (forceUpdate: boolean = false) => {
    setIsProcessing(true);
    setImportResult(null);

    try {
      const res = await fetch('/api/admin/bulk-import/verified-defaults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ force: forceUpdate }),
      });

      const data = await res.json();
      if (res.ok) {
        setImportResult({
          success: true,
          message: data.message || 'Verified Government Database updated.',
          totalProcessed: data.totalAvailableInCatalog || 70,
          importedCount: data.importedCount || 0,
          updatedCount: data.updatedCount || 0,
          skippedCount: data.skippedCount || 0,
          errors: data.errors || [],
        });
        onSuccess();
      } else {
        alert(data.error || 'Failed to seed verified government database');
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter preview records
  const filteredPreview = parsedRecords.filter((r) => {
    const matchesFilter =
      filterPreview === 'all' ||
      (filterPreview === 'valid' && r._isValid) ||
      (filterPreview === 'errors' && !r._isValid);

    const matchesSearch =
      !previewSearch.trim() ||
      r.title.toLowerCase().includes(previewSearch.toLowerCase()) ||
      (r.organization && r.organization.toLowerCase().includes(previewSearch.toLowerCase())) ||
      (r.category && r.category.toLowerCase().includes(previewSearch.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const validCount = parsedRecords.filter((r) => r._isValid).length;
  const invalidCount = parsedRecords.length - validCount;

  return (
    <div id="bulk-gov-import-hub" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#133A6B] to-[#0B2545] text-white p-6 rounded-2xl shadow-md border-b-4 border-red-600 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white font-black text-[10px] uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Master Government Data Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
            Bulk Government Data Import & Feeds
          </h2>
          <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
            Import and synchronize verified Central and State Government recruitment records (Vacancies, Admit Cards, and Results) with authentic official government source links.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadSampleJson}
            className="px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>JSON Template</span>
          </button>
          <button
            onClick={downloadSampleCsv}
            className="px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Template</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveMode('verified')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wide whitespace-nowrap ${
            activeMode === 'verified'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>1. Verified Official Feeds (1-Click Sync)</span>
        </button>

        <button
          onClick={() => setActiveMode('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wide whitespace-nowrap ${
            activeMode === 'upload'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>2. Upload JSON / CSV File</span>
        </button>

        <button
          onClick={() => setActiveMode('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wide whitespace-nowrap ${
            activeMode === 'text'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Paste Raw JSON / CSV</span>
        </button>
      </div>

      {/* RESULT FEEDBACK TOAST / CARD */}
      {importResult && (
        <div
          className={`p-5 rounded-2xl border shadow-sm transition-all ${
            importResult.success
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  importResult.success ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {importResult.success ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-wide">
                  {importResult.success ? 'Import Completed Successfully' : 'Import Finished with Warnings'}
                </h3>
                <p className="text-xs font-medium mt-0.5">{importResult.message}</p>
              </div>
            </div>
            <button
              onClick={() => setImportResult(null)}
              className="text-xs font-bold px-2 py-1 bg-white/80 hover:bg-white rounded border border-slate-300"
            >
              Dismiss
            </button>
          </div>

          {/* Detailed metrics breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-200/60">
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Records</span>
              <span className="text-base font-black text-slate-900">{importResult.totalProcessed}</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Newly Added</span>
              <span className="text-base font-black text-emerald-700">+{importResult.importedCount}</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-blue-600 block">Updated Existing</span>
              <span className="text-base font-black text-blue-700">{importResult.updatedCount}</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Skipped / Unchanged</span>
              <span className="text-base font-black text-slate-700">{importResult.skippedCount}</span>
            </div>
          </div>

          {importResult.errors && importResult.errors.length > 0 && (
            <div className="mt-3 bg-white p-3 rounded-xl border border-red-200 text-xs space-y-1">
              <span className="font-bold text-red-700 block">Processing Log Notices:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                {importResult.errors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* MODE 1: VERIFIED OFFICIAL FEEDS */}
      {activeMode === 'verified' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Verified Government Recruitment Catalog
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Synchronize authentic government exam records with official portal domains (ssc.gov.in, upsc.gov.in, rrbcdg.gov.in, ibps.in, nta.ac.in, uppbpb.gov.in, etc.).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={isProcessing}
                onClick={() => handleLoadVerifiedCatalog(false)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Sync Verified Records (Skip Duplicates)</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleLoadVerifiedCatalog(true)}
                className="px-3.5 py-2.5 bg-[#0B2545] hover:bg-[#133A6B] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                title="Force update all records with latest verified links"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Force Overwrite</span>
              </button>
            </div>
          </div>

          {/* Category Feed Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Card 1: Vacancies */}
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded-md">
                  Category 1
                </span>
                <span className="text-xs font-bold text-blue-900">25+ Verified</span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">Vacancies & Latest Jobs</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                SSC CGL, CHSL, GD Constable, MTS, CPO SI, UPSC Civil Services, NDA, CDS, RRB NTPC, ALP, Technicians, IBPS PO/Clerk, SBI PO/Clerk, UP Police 60,244, Bihar CSBC, DSSSB, Agniveer Army/Navy/Airforce.
              </p>
              <div className="text-[11px] font-bold text-blue-700 pt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Includes direct Apply & Notification URLs</span>
              </div>
            </div>

            {/* Card 2: Admit Cards */}
            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-500 text-slate-950 rounded-md">
                  Category 2
                </span>
                <span className="text-xs font-bold text-amber-900">24+ Verified</span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">Admit Cards & Hall Tickets</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                UP Police Constable Re-Exam City Slip & Admit Card, SSC CGL Tier-1 City Slip, CHSL CBT, GD Constable PST/PET, UPSC CSE/NDA/CDS Hall Tickets, RRB ALP City Pass, IBPS Call Letters, CTET, UGC NET.
              </p>
              <div className="text-[11px] font-bold text-amber-800 pt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Includes direct Admit Card Download Links</span>
              </div>
            </div>

            {/* Card 3: Results */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-600 text-white rounded-md">
                  Category 3
                </span>
                <span className="text-xs font-bold text-emerald-900">24+ Verified</span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">Results & Merit Lists</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                UP Police Constable Cutoff & Written Result, SSC CGL Final Merit List, SSC GD Cutoff Percentile, UPSC CSE Toppers List, RRB ALP CBT-1 Scorecard, IBPS PO/Clerk Provisional Allotment, NTA UGC NET.
              </p>
              <div className="text-[11px] font-bold text-emerald-800 pt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Includes direct Result & Scorecard PDF URLs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: UPLOAD JSON / CSV FILE */}
      {activeMode === 'upload' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              Upload Custom Government Data File
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select or drag and drop a <code>.json</code> or <code>.csv</code> file containing recruitment data adhering to the schema.
            </p>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-red-500 bg-slate-50/60 hover:bg-red-50/20 p-8 rounded-2xl text-center cursor-pointer transition-all space-y-3"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,.csv,text/csv,application/json"
              className="hidden"
            />
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                Click to browse or drag and drop your JSON / CSV file
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports standard format with title, organization, category, dates, and official URLs
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: PASTE RAW TEXT (JSON OR CSV) */}
      {activeMode === 'text' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Paste JSON Array or CSV Text
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste bulk records directly into the editor below and click 'Validate & Preview'.
              </p>
            </div>
            <button
              onClick={handleParseText}
              disabled={!rawText.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
            >
              Validate & Preview
            </button>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`[\n  {\n    "title": "SSC CGL 2026",\n    "organization": "Staff Selection Commission",\n    "category": "Vacancy",\n    "state": "All India",\n    "officialApplyUrl": "https://ssc.gov.in",\n    "sourceUrl": "https://ssc.gov.in",\n    "status": "Active"\n  }\n]`}
            rows={10}
            className="w-full text-xs font-mono p-4 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed scrollbar-thin"
          />
        </div>
      )}

      {/* VALIDATION & PREVIEW TABLE SECTION */}
      {parsedRecords.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span>Validation Preview Table</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {parsedRecords.length} Records Loaded
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect records, official URLs, and status before publishing to the live portal database.
              </p>
            </div>

            {/* Quick Status Badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{validCount} Ready to Import</span>
              </span>
              {invalidCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{invalidCount} Errors Found</span>
                </span>
              )}
            </div>
          </div>

          {/* Filter Bar for Preview Table */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={previewSearch}
                onChange={(e) => setPreviewSearch(e.target.value)}
                placeholder="Search in loaded records..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterPreview('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterPreview === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({parsedRecords.length})
              </button>
              <button
                onClick={() => setFilterPreview('valid')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterPreview === 'valid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Valid ({validCount})
              </button>
              {invalidCount > 0 && (
                <button
                  onClick={() => setFilterPreview('errors')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    filterPreview === 'errors'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Errors ({invalidCount})
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-96 scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[10px] sticky top-0 border-b border-slate-200 z-10">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Title & Organization</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Official URLs Verified</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {filteredPreview.map((rec) => (
                  <tr
                    key={rec._id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      !rec._isValid ? 'bg-red-50/40' : ''
                    }`}
                  >
                    {/* Status Badge */}
                    <td className="p-3 whitespace-nowrap">
                      {rec._isValid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          <AlertTriangle className="w-3 h-3" /> Error
                        </span>
                      )}
                    </td>

                    {/* Title & Organization */}
                    <td className="p-3 min-w-[220px]">
                      <div className="font-bold text-slate-900">{rec.title}</div>
                      <div className="text-[11px] text-slate-500">{rec.organization || 'General Govt'}</div>
                      {rec._errors.length > 0 && (
                        <div className="text-[10px] text-red-600 font-semibold mt-1">
                          {rec._errors.join(' ')}
                        </div>
                      )}
                      {rec._warnings.length > 0 && (
                        <div className="text-[10px] text-amber-600 font-medium mt-0.5">
                          {rec._warnings.join(' ')}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[11px]">
                        {rec.category || 'Vacancy'}
                      </span>
                    </td>

                    {/* State */}
                    <td className="p-3 whitespace-nowrap text-slate-700 font-medium">
                      {rec.state || 'All India'}
                    </td>

                    {/* Dates */}
                    <td className="p-3 text-[11px] text-slate-600 whitespace-nowrap">
                      {rec.publishDate && <div>Pub: {rec.publishDate}</div>}
                      {rec.lastDate && <div className="text-red-600 font-bold">Last: {rec.lastDate}</div>}
                      {rec.examDate && <div className="text-blue-600 font-bold">Exam: {rec.examDate}</div>}
                    </td>

                    {/* URLs */}
                    <td className="p-3 text-[11px] space-y-0.5 min-w-[200px]">
                      {rec.officialApplyUrl && (
                        <a
                          href={rec.officialApplyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline truncate max-w-xs font-semibold"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span>Apply: {rec.officialApplyUrl}</span>
                        </a>
                      )}
                      {rec.officialAdmitCardUrl && (
                        <a
                          href={rec.officialAdmitCardUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-amber-700 hover:underline truncate max-w-xs font-semibold"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span>Admit Card: {rec.officialAdmitCardUrl}</span>
                        </a>
                      )}
                      {rec.officialResultUrl && (
                        <a
                          href={rec.officialResultUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-700 hover:underline truncate max-w-xs font-semibold"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span>Result: {rec.officialResultUrl}</span>
                        </a>
                      )}
                      {rec.officialNotificationUrl && (
                        <a
                          href={rec.officialNotificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-slate-600 hover:underline truncate max-w-xs"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span>Notification: {rec.officialNotificationUrl}</span>
                        </a>
                      )}
                      {rec.sourceUrl && (
                        <a
                          href={rec.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-slate-500 hover:underline truncate max-w-xs"
                        >
                          <Globe className="w-3 h-3 shrink-0" />
                          <span>Official Website: {rec.sourceUrl}</span>
                        </a>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setParsedRecords(parsedRecords.filter((p) => p._id !== rec._id));
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove row from import"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Import Publishing Options & Controls */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={updateDuplicates}
                  onChange={(e) => {
                    setUpdateDuplicates(e.target.checked);
                    if (e.target.checked) setSkipDuplicates(false);
                  }}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span>Update / Overwrite duplicates if already present</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipDuplicates}
                  onChange={(e) => {
                    setSkipDuplicates(e.target.checked);
                    if (e.target.checked) setUpdateDuplicates(false);
                  }}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span>Skip duplicate titles</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setParsedRecords([])}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Clear All
              </button>

              <button
                type="button"
                disabled={isProcessing || validCount === 0}
                onClick={handleExecuteImport}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>Publish {validCount} Valid Records to Database</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

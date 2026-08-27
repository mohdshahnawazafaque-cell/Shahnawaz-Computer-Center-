import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
  RefreshCw,
  Layers,
  Radio,
  FileText,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminPushNotificationTab: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<{
    totalSubscribers: number;
    vapidPublicKey?: string;
    recentLogs: any[];
    subscribersSample: any[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('/');
  const [category, setCategory] = useState('all');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/push/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load push stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setStatusMessage({ text: 'Please enter both Title and Message Body', type: 'error' });
      return;
    }

    setIsSending(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/push/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          url: url.trim() || '/',
          category,
          type: 'general',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          text: `🎉 ${data.message || 'Notification broadcasted successfully!'}`,
          type: 'success',
        });
        setTitle('');
        setBody('');
        setUrl('/');
        loadStats();
      } else {
        setStatusMessage({ text: data.error || 'Failed to dispatch push notification', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err?.message || 'Error communicating with server', type: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const applyTemplate = (presetTitle: string, presetBody: string, presetCategory: string) => {
    setTitle(presetTitle);
    setBody(presetBody);
    setCategory(presetCategory);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats ? stats.totalSubscribers : '...'}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Push Subscribers
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.recentLogs ? stats.recentLogs.length : 0}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Broadcasts Sent
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <Key className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
              {stats?.vapidPublicKey ? 'VAPID Connected' : 'Auto Generated'}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Web Push Key Status
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Composer & Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Broadcast Composer */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
              <BellRing className="w-5 h-5 text-[#990000]" />
              <span>Broadcast Instant Push Alert</span>
            </div>
            <button
              type="button"
              onClick={loadStats}
              disabled={isLoading}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:bg-slate-800/50 rounded-lg cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-1">
                Notification Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 🔥 SSC CGL 2026 Tier 1 Result Released!"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#990000]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-1">
                Message Body *
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="e.g., Staff Selection Commission has published the CGL 2026 Tier 1 cut-off and shortlisted candidates list. Check direct link now."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-normal focus:outline-hidden focus:ring-2 focus:ring-[#990000]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-1">
                  Destination URL Path
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/post/ssc-cgl-tier-1-result or /"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#990000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-1">
                  Target Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#990000]"
                >
                  <option value="all">⭐ All Subscribers (Full Broadcast)</option>
                  <option value="job">💼 Latest Jobs & Vacancies</option>
                  <option value="admit_card">🪪 Admit Cards</option>
                  <option value="result">🏆 Results</option>
                  <option value="answer_key">📝 Answer Keys</option>
                  <option value="sarkari_yojana">🏛️ Sarkari Yojana</option>
                </select>
              </div>
            </div>

            <button
              id="admin-send-broadcast-btn"
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-[#990000] hover:bg-[#800000] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Broadcasting to Devices...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Instant Notification Broadcast
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 5 Cols: Fast Templates & Automation Notes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> One-Click Alert Presets
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Click any quick preset below to auto-fill the notification broadcast composer:
            </p>

            <div className="space-y-2">
              {[
                {
                  label: '💼 New Govt Job Vacancy',
                  title: '📢 New Government Recruitment 2026 Live!',
                  body: 'Online application form is now open for new government vacancies. Check eligibility & apply online today.',
                  cat: 'job',
                },
                {
                  label: '🪪 Admit Card Released',
                  title: '🎫 Exam Admit Card Released - Download Hall Ticket',
                  body: 'Hall tickets & exam city slips have been released officially. Download your admit card now.',
                  cat: 'admit_card',
                },
                {
                  label: '🏆 Exam Result Declared',
                  title: '🎯 Official Result & Cut-off Marks Declared!',
                  body: 'Merit list and scorecards are now accessible on the portal. Check your roll number.',
                  cat: 'result',
                },
                {
                  label: '📝 Answer Key Released',
                  title: '📝 Official Answer Key & Objection Link Active',
                  body: 'Official provisional answer key and question paper with responses are available for review.',
                  cat: 'answer_key',
                },
              ].map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyTemplate(tpl.title, tpl.body, tpl.cat)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#990000] bg-slate-50 dark:bg-slate-700 hover:bg-red-50/50 transition-all text-xs cursor-pointer group"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#990000]">
                    {tpl.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{tpl.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Automatic Trigger Explanation */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-1.5 text-xs text-amber-950">
            <strong className="block font-black text-amber-900 uppercase tracking-tight">
              🤖 100% Automated On Publish
            </strong>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              When you create or update any post with status <strong>"Published"</strong> or click <strong>Bulk Import</strong>, the backend system automatically dispatches web push notifications to all matching subscribers instantly!
            </p>
          </div>
        </div>
      </div>

      {/* Broadcast History Logs Table */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Recent Push Broadcast History
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {stats?.recentLogs ? stats.recentLogs.length : 0} recorded alerts
          </span>
        </div>

        {stats?.recentLogs && stats.recentLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Time</th>
                  <th className="p-3">Title & Message</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Delivery Rate</th>
                  <th className="p-3">Target URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentLogs.slice(0, 15).map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-50 dark:bg-slate-700/70">
                    <td className="p-3 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <strong className="block text-slate-900 dark:text-white font-bold">{log.title}</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">{log.body}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 text-[10px] font-bold uppercase">
                        {log.category || 'all'}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="text-emerald-700 font-bold">
                        {log.successCount}/{log.totalSubscribers}
                      </span>{' '}
                      <span className="text-[10px] text-slate-400">delivered</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-[11px] truncate max-w-[150px]">
                      {log.url}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No push broadcasts sent yet. Use the composer above or publish a new post to send one!
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Sparkles,
  Shield,
  Smartphone,
  Check,
  Zap,
  Info,
  Layers,
} from 'lucide-react';
import {
  isPushNotificationSupported,
  getNotificationPermissionState,
  getExistingPushSubscription,
  subscribeUserToPush,
  unsubscribeUserFromPush,
  triggerTestPushNotification,
} from '../utils/pushManager';

interface PushNotificationPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PushNotificationPrompt: React.FC<PushNotificationPromptProps> = ({
  isOpen,
  onClose,
}) => {
  const [isSupported, setIsSupported] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Category Preferences
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'all',
    'job',
    'admit_card',
    'result',
    'answer_key',
    'sarkari_yojana',
  ]);

  useEffect(() => {
    if (!isOpen) return;

    const supported = isPushNotificationSupported();
    setIsSupported(supported);
    setPermission(getNotificationPermissionState());

    if (supported) {
      getExistingPushSubscription().then((sub) => {
        setIsSubscribed(Boolean(sub));
      });
    }

    try {
      const savedCats = localStorage.getItem('sarkari_push_categories');
      if (savedCats) {
        setSelectedCategories(JSON.parse(savedCats));
      }
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCategory = (catId: string) => {
    if (catId === 'all') {
      if (selectedCategories.includes('all')) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(['all', 'job', 'admit_card', 'result', 'answer_key', 'sarkari_yojana']);
      }
      return;
    }

    setSelectedCategories((prev) => {
      const exists = prev.includes(catId);
      let updated = exists ? prev.filter((c) => c !== catId) : [...prev, catId];
      if (exists) {
        updated = updated.filter((c) => c !== 'all');
      }
      return updated;
    });
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await subscribeUserToPush(selectedCategories);
    setIsLoading(false);

    if (result.success) {
      setIsSubscribed(true);
      setPermission('granted');
      setSuccessMessage('🎉 Subscribed successfully! You will receive instant notifications for new jobs & results.');
    } else {
      setErrorMessage(result.error || 'Failed to enable push notifications');
      setPermission(getNotificationPermissionState());
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await unsubscribeUserFromPush();
    setIsLoading(false);

    if (result.success) {
      setIsSubscribed(false);
      setSuccessMessage('You have unsubscribed from notifications.');
    } else {
      setErrorMessage(result.error || 'Failed to unsubscribe');
    }
  };

  const handleSendTest = async () => {
    setTestStatus('sending');
    setErrorMessage(null);
    const res = await triggerTestPushNotification();
    if (res.success) {
      setTestStatus('sent');
      setSuccessMessage('Test notification sent! Check your notification tray.');
      setTimeout(() => setTestStatus(null), 5000);
    } else {
      setTestStatus(null);
      setErrorMessage(res.error || 'Could not send test notification');
    }
  };

  return (
    <div
      id="push-notification-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="push-notification-modal"
        className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Sarkari/Cyber Cafe Red Gradient */}
        <div className="bg-gradient-to-r from-[#990000] via-[#B30000] to-[#800000] text-white px-5 py-4 flex items-center justify-between border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#990000] flex items-center justify-center font-black shadow-md">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg tracking-wide uppercase">
                Instant Recruitment Alerts
              </h2>
              <p className="text-xs text-amber-200 font-medium">
                Real-time updates directly to your screen
              </p>
            </div>
          </div>
          <button
            id="close-push-modal-btn"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white dark:bg-slate-800/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {!isSupported ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Push Notifications Not Supported</strong>
                Your current browser does not support Service Worker push notifications. Please use Google Chrome, Microsoft Edge, or Mozilla Firefox.
              </div>
            </div>
          ) : permission === 'denied' ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-900 text-sm">
              <BellOff className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Notifications Blocked by Browser</strong>
                You previously blocked notifications for this portal. To enable, click the lock icon 🔒 in your browser's address bar and set Notifications to <strong>Allow</strong>.
              </div>
            </div>
          ) : null}

          {/* Messages */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Value Prop Banner */}
          <div className="bg-gradient-to-br from-slate-50 to-amber-50/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#990000] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Never Miss An Important Deadline
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              Get notified the <strong>second</strong> a new Government Vacancy, SSC/UPSC Admit Card, Board Result, or Sarkari Yojana is published. Works in background even when website is closed!
            </p>
          </div>

          {/* Subscription Status Card */}
          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isSubscribed ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Subscription Status: {isSubscribed ? (
                    <span className="text-emerald-700 font-extrabold">Active & Connected</span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">Not Subscribed</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isSubscribed ? 'Service Worker Push active' : 'Click below to enable alerts'}
                </div>
              </div>
            </div>

            {isSubscribed && (
              <button
                id="unsubscribe-push-btn"
                onClick={handleUnsubscribe}
                disabled={isLoading}
                className="text-xs text-red-600 hover:text-red-700 hover:underline font-bold px-2 py-1 cursor-pointer"
              >
                Disable
              </button>
            )}
          </div>

          {/* Category Preferences Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#990000]" /> Select Categories You Want Alerts For:
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'job', label: '💼 Latest Jobs & Vacancies', bg: 'hover:border-blue-300' },
                { id: 'admit_card', label: '🪪 Admit Cards & Hall Tickets', bg: 'hover:border-amber-300' },
                { id: 'result', label: '🏆 Exam Results & Merit Lists', bg: 'hover:border-emerald-300' },
                { id: 'answer_key', label: '📝 Answer Keys & Solutions', bg: 'hover:border-purple-300' },
                { id: 'sarkari_yojana', label: '🏛️ Sarkari Yojana & Schemes', bg: 'hover:border-teal-300' },
                { id: 'all', label: '⭐ All Notifications (Recommended)', bg: 'hover:border-red-300' },
              ].map((item) => {
                const isSelected = selectedCategories.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCategory(item.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-50 border-[#990000] text-[#990000] font-bold shadow-2xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-700'
                    }`}
                  >
                    <span className="truncate pr-1">{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#990000] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy & Zero Spam Guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              100% Free & No spam. You can change preferences or unsubscribe anytime in 1-click.
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-slate-50 dark:bg-slate-700 px-5 py-3.5 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          {isSubscribed ? (
            <button
              id="send-test-push-alert-btn"
              onClick={handleSendTest}
              disabled={testStatus === 'sending'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              {testStatus === 'sending' ? 'Dispatching...' : 'Send Test Notification'}
            </button>
          ) : (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Requires browser notification permission
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="cancel-push-modal-btn"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-100 dark:bg-slate-800/50 cursor-pointer"
            >
              Close
            </button>

            {!isSubscribed && (
              <button
                id="enable-push-alerts-btn"
                onClick={handleSubscribe}
                disabled={isLoading || !isSupported || permission === 'denied'}
                className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#990000] hover:bg-[#7a0000] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>Connecting...</>
                ) : (
                  <>
                    <Bell className="w-4 h-4" /> Enable Instant Alerts
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

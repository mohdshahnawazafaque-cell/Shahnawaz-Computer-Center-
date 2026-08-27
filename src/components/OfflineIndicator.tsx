import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, X } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsDismissed(false);
      setShowOnlineToast(true);
      const timer = setTimeout(() => {
        setShowOnlineToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false);
      setShowOnlineToast(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  // If back online toast is active
  if (showOnlineToast) {
    return (
      <div
        id="online-notification-toast"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-bounce"
      >
        <Wifi className="w-4 h-4 text-emerald-300 shrink-0" />
        <span>Back Online! Live portal sync restored.</span>
      </div>
    );
  }

  // If offline and not dismissed
  if (!isOnline && !isDismissed) {
    return (
      <div
        id="offline-notification-banner"
        className="bg-amber-600 text-white px-3 py-2 text-xs font-semibold shadow-md sticky top-0 z-40 border-b border-amber-700"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-700/80 flex items-center justify-center shrink-0">
              <WifiOff className="w-3.5 h-3.5 text-amber-100" />
            </div>
            <p className="leading-tight">
              <strong className="font-extrabold uppercase tracking-wide">Offline Mode Active:</strong>{' '}
              <span className="hidden sm:inline">No active internet. </span>
              Previously opened posts, notifications, and portal sections remain accessible via local cache.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReload}
              className="inline-flex items-center gap-1 bg-amber-800 hover:bg-amber-900 text-amber-100 px-2.5 py-1 rounded text-[11px] font-bold transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss offline banner"
              className="text-amber-200 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

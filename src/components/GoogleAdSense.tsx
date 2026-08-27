import React, { useEffect } from 'react';

interface GoogleAdSenseProps {
  client?: string;
  slot?: string;
  format?: string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({
  client = 'ca-pub-6516980434501091', // Fallback to the one from index.html
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = { display: 'block' },
}) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Delay push to ensure the container has a non-zero width (solves availableWidth=0 error)
    timeoutId = setTimeout(() => {
      try {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e: any) {
        if (e && e.message && (e.message.includes('already have ads') || e.message.includes('No slot size') || e.message.includes('availableWidth=0'))) {
          // Ignore the benign errors often caused by React StrictMode duplicate renders or zero-width containers
          return;
        }
        console.error('Google AdSense initialization error:', e.message || e);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={`google-adsense-container w-full overflow-hidden my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      ></ins>
    </div>
  );
};

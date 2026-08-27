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
    try {
      // Push empty object to initialize the ad
      // @ts-ignore
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e: any) {
      if (e && e.message && e.message.includes('already have ads')) {
        // Ignore the benign error often caused by React StrictMode duplicate renders
        return;
      }
      console.error('Google AdSense initialization error:', e);
    }
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

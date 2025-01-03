import { useEffect } from 'react';

export default function AdSense({ adClient, adSlot, adFormat = "auto", style = {}, fullWidthResponsive = true }) {
  useEffect(() => {
    // Dynamically load the AdSense script once the component mounts
    const script = document.createElement('script');
    script.async = true;
    script.src = import.meta.env.VITE_ADSENSE_SCRIPT_URL;
    script.onload = () => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };
    document.body.appendChild(script);

    // Cleanup function to remove the script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="adsense-container" style={{ textAlign: 'center', ...style }}>
      
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      ></ins>
    </div>
  );
}

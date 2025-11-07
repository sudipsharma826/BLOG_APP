import React from 'react';
import AdSense from './AdSense';

const AdSpaceContainer = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="relative w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden">
        <p
          className="text-sm font-semibold absolute top-2 right-2 px-2 py-1 rounded"
          style={{
            background: 'linear-gradient(to right, red, blue)',
            color: 'white',
            ...(document.body.classList.contains('dark')
              ? { background: 'linear-gradient(to right, #444, #888)' }
              : {}),
          }}
        >
          Ad Space
        </p>
        <AdSense
          adClient={import.meta.env.VITE_ADSENSE_CLIENT}
          adSlot={import.meta.env.VITE_ADSENSE_SLOT}
          style={{ display: 'block' }}
          adFormat="auto"
          fullWidthResponsive={true}
        />
      </div>
    </div>
  );
};

export default AdSpaceContainer;
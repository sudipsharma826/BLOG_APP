import React from 'react';
import {
  Database,
  Globe,
  Layout,
  Server,
  Smartphone,
  Code,
  Cloud
} from 'lucide-react';
import AdSense from '../blog/AdSense';

const technologies = [
  { icon: Database, name: 'Databases' },
  { icon: Globe, name: 'Web Dev' },
  { icon: Layout, name: 'UI/UX' },
  { icon: Server, name: 'Backend' },
  { icon: Smartphone, name: 'Mobile' },
  { icon: Code, name: 'Programming' },
  { icon: Cloud, name: 'Cloud' }
];

const TechStack = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white dark:from-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 dark:text-white">
          Technologies I Write About
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {technologies.map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-4 bg-purple-50 rounded-full mb-4 group-hover:bg-purple-100">
                <Icon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            </div>
          ))}
        
        {/* AdSense Box */}
        <div className="relative w-full h-full bg-gray-200  rounded-lg flex items-center justify-center">
          {/* Ad Space Label */}
          <p
            className="absolute top-2 right-2 text-sm font-semibold px-2 py-1 rounded"
            style={{
              background: 'linear-gradient(to right, red, blue)', // Gradient background
              color: 'white', // Text color
              ...(document.body.classList.contains('dark')
                ? {
                    background: 'linear-gradient(to right, #444, #888)' // Dark mode gradient
                  }
                : {})
              }}
              >
            Ad Space
          </p>
          
          {/* AdSense Component */}
          <AdSense
            adClient={import.meta.env.VITE_ADSENSE_CLIENT}
            adSlot={import.meta.env.VITE_ADSENSE_SLOT}
            style={{ display: 'block' }}
            adFormat="auto"
            fullWidthResponsive={true}
          />
            </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;

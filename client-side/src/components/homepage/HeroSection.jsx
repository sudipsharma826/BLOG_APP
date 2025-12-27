import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function HeroSection() {
  return (
    <div className="relative w-full aspect-[2.2/1] md:aspect-[2.8/1] min-h-[60vw] md:min-h-[40vw] max-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Banner Image - Large and Clear */}
      <img
        src="/images/image.png"
        alt="TechKnows Banner"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-95 select-none pointer-events-none"
        style={{ minHeight: '100%', maxHeight: '100%', maxWidth: '100%' }}
        draggable={false}
      />
      {/* Overlay for better text/button visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10"></div>
    </div>
  );
}

// Add the button and follow section after the image container
export function HeroSectionWithFooter() {
  return (
    <>
      <HeroSection />
      <div className="w-full flex flex-col items-center justify-center mt-[-3rem] md:mt-[-4rem] z-30 relative">
        {/* Explore Blog Article Button */}
        <a
          href="/posts"
          className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 mb-4"
          style={{backdropFilter: 'blur(2px)'}}
        >
          Explore Blog Article
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-2 duration-300">
            <ArrowRight size={22} />
          </span>
        </a>
        {/* Follow Me Section */}
        <div className="flex flex-col items-center">
          <span className="text-gray-900 text-base font-semibold">Follow Me</span>
          <div className="flex gap-5 items-center">
            {/* GitHub */}
            <a href="https://github.com/sudipsharma826" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <FaGithub size={28} className="text-gray-900" />
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com/in/sudipsharmanp" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <FaLinkedin size={28} className="text-blue-700" />
            </a>
            {/* Portfolio */}
            <a href="https://sudipsharma.info.np" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <img src="/images/logo.png" alt="Portfolio" className="w-7 h-7 rounded-full border-2 border-gray-900 bg-white object-contain" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// New ExploreAndFollow component
export function ExploreAndFollow() {
  return (
    <div className="w-full flex flex-col items-center justify-center mb-8">
      <a
        href="/posts"
        className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 mb-2"
        style={{backdropFilter: 'blur(2px)'}}
      >
        Explore Blog Article
        <span className="ml-2 inline-block transition-transform group-hover:translate-x-2 duration-300">
          <ArrowRight size={22} />
        </span>
      </a>
      {/* Follow Me Section: only text and icons, no box */}
      <div className="flex items-center gap-3 mt-1">
        <span className="text-gray-700 text-sm font-medium tracking-wide">Follow Me</span>
        <a href="https://github.com/sudipsharma826" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
          <FaGithub size={22} className="text-gray-800" />
        </a>
        <a href="https://linkedin.com/in/sudipsharmanp" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
          <FaLinkedin size={22} className="text-blue-600" />
        </a>
        <a href="https://sudipsharma.info.np" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
          <img src="/images/logo.png" alt="Portfolio" className="w-6 h-6 rounded-full border border-gray-300 bg-white object-contain" />
        </a>
      </div>
    </div>
  );
}
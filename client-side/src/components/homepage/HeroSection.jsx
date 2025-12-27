import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-[260px] sm:min-h-[320px] md:min-h-[40vw] max-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900 pt-16 sm:pt-0">
      {/* Banner Image - Large and Clear */}
      <img
        src="/images/image.png"
        alt="TechKnows Banner"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none"
        style={{ minHeight: '260px', maxHeight: '100%', maxWidth: '100%' }}
        draggable={false}
      />
      {/* Overlay for better text/button visibility, lighter on mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70 z-10 md:from-black/60 md:via-black/30 md:to-black/80"></div>
      {/* Overlay button and follow section for mobile */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center z-20 pb-4 sm:pb-8">
        <a
          href="/posts"
          className="group flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 mb-2"
          style={{backdropFilter: 'blur(2px)'}}
        >
          Explore Blog Article
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-2 duration-300">
            <ArrowRight size={18} />
          </span>
        </a>
        <div className="flex gap-3 items-center">
          <span className="text-gray-900 text-sm font-semibold mb-1">Follow Me</span>
          <a href="https://github.com/sudipsharma826" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <FaGithub size={22} className="text-gray-900" />
          </a>
          <a href="https://linkedin.com/in/sudipsharmanp" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <FaLinkedin size={22} className="text-blue-700" />
          </a>
          <a href="https://sudipsharma.info.np" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <img src="/images/logo.png" alt="Portfolio" className="w-6 h-6 rounded-full border-2 border-gray-900 bg-white object-contain" />
          </a>
        </div>
      </div>
    </div>
  );
}

// Add the button and follow section after the image container
export function HeroSectionWithFooter() {
  return (
    <>
      <HeroSection />
      <div className="w-full flex flex-col items-center justify-center mt-[-0.5rem] md:mt-[-2.5rem] z-30 relative">
        {/* Explore Blog Article Button */}
        <a
          href="/posts"
          className="group flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 mb-2"
          style={{backdropFilter: 'blur(2px)'}}
        >
          Explore Blog Article
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-2 duration-300">
            <ArrowRight size={18} />
          </span>
        </a>
        {/* Follow Me Section */}
        <div className="flex flex-col items-center mt-1">
          <span className="text-gray-900 text-sm font-semibold mb-1">Follow Me</span>
          <div className="flex gap-3 items-center">
            {/* GitHub */}
            <a href="https://github.com/sudipsharma826" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <FaGithub size={22} className="text-gray-900" />
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com/in/sudipsharmanp" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <FaLinkedin size={22} className="text-blue-700" />
            </a>
            {/* Portfolio */}
            <a href="https://sudipsharma.info.np" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <img src="/images/logo.png" alt="Portfolio" className="w-6 h-6 rounded-full border-2 border-gray-900 bg-white object-contain" />
            </a>
          </div>
        </div>
      </div>
      {/* Add spacing below hero section for mobile comfort */}
      <div className="h-6 md:h-8"></div>
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
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdSense from './AdSense';

export default function TableOfContents({ content }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tocItems, setTocItems] = useState([]);

  const extractHeadings = (content) => {
    const toc = [];
    const contentElement = document.createElement('div');
    contentElement.innerHTML = content;
    const headings = contentElement.querySelectorAll('h1, h2');

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`; // Ensure an ID is added if not already
      }
      const level = parseInt(heading.tagName.replace('H', ''), 10);
      toc.push({ id: heading.id, title: heading.textContent, level });
    });

    return toc;
  };

  // Ensure tocItems is updated correctly when content changes
  useEffect(() => {
    if (content) {
      const headings = extractHeadings(content);
      setTocItems(headings);
    }
  }, [content]);

  return (
    <div className="toc flex flex-col lg:flex-row gap-8 mb-10">
      {/* TOC Section: 60% width */}
      <div className="lg:w-3/5 w-full">
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white p-6 rounded-lg shadow-lg">
          {/* Always visible title and toggle button */}
          <div
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <h2 className="text-xl font-semibold hover:text-yellow-400 transition-colors">
              Table of Contents
            </h2>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>

          {/* Conditionally show the TOC content */}
          <div
            className={`transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}
          >
            <ul className="space-y-3">
              {tocItems.map((item) => (
                <li
                  key={item.id}
                  className={`${
                    item.level === 2
                      ? 'ml-5 before:content-["•"] before:mr-2 before:text-yellow-400'
                      : 'before:content-["-"] before:mr-2 before:text-yellow-400'
                  }`}
                >
                  <a
                    href={`#${item.id}`}
                    className="text-gray-300 hover:text-white transition-colors duration-200 ease-in-out"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ad Section: 40% width */}
      <div className="adsense lg:w-2/5 w-full flex items-center justify-center border border-gray-300 p-4 rounded-lg relative">
  <p
    className="text-sm font-semibold flex absolute top-2 right-2 px-2 py-1 rounded"
    style={{
      background: 'linear-gradient(to right, red, blue)', // Gradient background for the "Ad Space" label
      color: 'white', // Text color for the label
      // Dynamically adjust the text color for dark mode
      ...(document.body.classList.contains('dark') ? {
        background: 'linear-gradient(to right, #444, #888)', // Darker gradient for dark mode
      } : {}),
    }}
  >
    Ad Space
  </p>
  <AdSense
    adClient={import.meta.env.VITE_ADSENSE_CLIENT}
    adSlot={import.meta.env.VITE_ADSENSE_SLOT}
    style={{ height: '250px' }}
    adFormat="auto"
    fullWidthResponsive={true}
  />
</div>

    </div>
  );
}

import { ChevronDown, ChevronUp, List } from 'lucide-react';
import { useState, useEffect } from 'react';

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

  if (tocItems.length === 0) return null;

  return (
    <section aria-labelledby="table-of-contents">
      <nav 
        aria-labelledby="table-of-contents-heading"
        className="toc mb-8 lg:mb-12"
      >
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl">
        {/* Always visible title and toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="toc-content"
          className="flex items-center justify-between w-full cursor-pointer mb-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 rounded-lg p-2 -m-2 hover:bg-white/10 transition-colors"
        >
          <h2 id="table-of-contents-heading" className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            <List className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            Table of Contents
          </h2>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" aria-hidden="true" />
          )}
        </button>

        {/* Conditionally show the TOC content */}
        <div 
          id="toc-content"
          className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <ul className="space-y-2 sm:space-y-3 mt-3 sm:mt-4" role="list">
            {tocItems.map((item, index) => (
              <li
                key={item.id}
                className={`${
                  item.level === 2
                    ? 'ml-4 sm:ml-6 before:content-["•"] before:mr-2 sm:before:mr-3 before:text-yellow-300'
                    : 'before:content-["→"] before:mr-2 sm:before:mr-3 before:text-yellow-300'
                } flex items-start text-sm sm:text-base`}
              >
                <a 
                  href={`#${item.id}`} 
                  className="text-gray-100 hover:text-white hover:underline transition-all duration-200 ease-in-out 
                    focus:outline-none focus:underline focus:text-yellow-200"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
    </section>
  );
}

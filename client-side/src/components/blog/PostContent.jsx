import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdSense from "./AdSense";

export function PostContent({ content = "" }) {
  const [isLiked, setIsLiked] = useState(false);
  const [processedContent, setProcessedContent] = useState("");

  // Function to add unique IDs to headings
  const addHeadingIds = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const headings = tempDiv.querySelectorAll("h1, h2");
    headings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });

    return tempDiv.innerHTML;
  };

  // Function to add line numbers and highlight first and last lines
  const processCodeBlocks = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const codeBlocks = tempDiv.querySelectorAll(".ql-syntax");
    codeBlocks.forEach((codeBlock) => {
      const lines = codeBlock.innerText.split("\n");
      const lineNumberContainer = document.createElement("div");
      lineNumberContainer.classList.add("line-numbers");

      const codeContentContainer = document.createElement("div");
      codeContentContainer.classList.add("code-content");

      lines.forEach((line, index) => {
        const lineNumber = document.createElement("span");
        lineNumber.textContent = index + 1;
        if (index === 0 || index === lines.length - 1) {
          lineNumber.classList.add("blue-line-number");
        }
        lineNumberContainer.appendChild(lineNumber);

        const codeLine = document.createElement("pre");
        codeLine.textContent = line;
        if (index === 0 || index === lines.length - 1) {
          codeLine.classList.add("light-blue-code-line");
        }
        codeContentContainer.appendChild(codeLine);
      });

      const codeBlockWrapper = document.createElement("div");
      codeBlockWrapper.classList.add("codeblock");

      codeBlockWrapper.appendChild(lineNumberContainer);
      codeBlockWrapper.appendChild(codeContentContainer);

      codeBlock.parentNode.replaceChild(codeBlockWrapper, codeBlock);
    });

    return tempDiv.innerHTML;
  };

  // Function to insert ads after specific paragraphs - DISABLED to avoid content disruption
  const insertAds = (html) => {
    // Ads disabled in main content to improve readability
    return html;
  };

  // Function to enhance images with proper attributes and styling
  const processImages = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    
    const images = tempDiv.querySelectorAll("img");
    images.forEach((img, index) => {
      // Add loading attribute for better performance
      img.setAttribute("loading", "lazy");
      
      // Ensure alt text exists (accessibility)
      if (!img.hasAttribute("alt") || img.getAttribute("alt") === "") {
        img.setAttribute("alt", `Blog content image ${index + 1}`);
      }
      
      // Add title for hover tooltip
      if (img.hasAttribute("alt") && img.getAttribute("alt") !== "") {
        img.setAttribute("title", img.getAttribute("alt"));
      }
      
      // Add class for responsive sizing (will be handled by CSS)
      img.classList.add("blog-content-img");
      
      // Add inline styles for better responsive behavior - NO CROPPING
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.objectFit = "contain";
      img.style.backgroundColor = "#ffffff";
      
      // Add error handling
      img.setAttribute("onerror", "this.style.display='block'; this.style.minHeight='200px'; this.style.background='#f0f0f0'; this.alt='Image failed to load';");
      
      // Wrap single images in figure if not already wrapped
      if (img.parentElement.tagName !== "FIGURE") {
        const figure = document.createElement("figure");
        figure.className = "blog-image-figure";
        
        // Clone and replace
        img.parentNode.insertBefore(figure, img);
        figure.appendChild(img);
        
        // Add caption if image has title or alt
        const captionText = img.getAttribute("title") || img.getAttribute("alt");
        if (captionText && captionText !== `Blog content image ${index + 1}`) {
          const figcaption = document.createElement("figcaption");
          figcaption.textContent = captionText;
          figcaption.style.textAlign = "center";
          figcaption.style.fontSize = "0.875rem";
          figcaption.style.color = "#666";
          figcaption.style.marginTop = "0.5rem";
          figure.appendChild(figcaption);
        }
      }
    });
    
    return tempDiv.innerHTML;
  };

  // Update processed content when content changes
  useEffect(() => {
    const contentWithHeadings = addHeadingIds(content);
    const contentWithCodeBlocks = processCodeBlocks(contentWithHeadings);
    const contentWithImages = processImages(contentWithCodeBlocks);
    const contentWithAds = insertAds(contentWithImages);
    setProcessedContent(contentWithAds);
  }, [content]);

  // Ads disabled in content for better user experience
  useEffect(() => {
    // No in-content ads to avoid disrupting reading flow
  }, [processedContent]);

  return (
    <div className="space-y-8">
      {/* Post Content */}
      <div className="post-content prose prose-lg dark:prose-invert max-w-none 
        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-10
        prose-h2:text-2xl prose-h2:mb-5 prose-h2:mt-8
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-gray-100
        prose-ul:my-6 prose-ol:my-6 prose-li:my-2
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic
        prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
        ">
        {processedContent ? (
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No content available</p>
        )}
      </div>
    </div>
  );
}

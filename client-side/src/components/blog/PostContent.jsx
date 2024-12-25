import { useState, useEffect } from "react";
import { Heart, Share2, Bookmark } from "react-feather"; // Assuming Bookmark is used in SavePostButton
import { SavePostButton } from "./ActionButtons";
import { Link } from "react-router-dom";

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

  // Update processed content when content changes
  useEffect(() => {
    const contentWithHeadings = addHeadingIds(content);
    const contentWithCodeBlocks = processCodeBlocks(contentWithHeadings);
    setProcessedContent(contentWithCodeBlocks);
  }, [content]);

  return (
    <div className="space-y-6">
      {/* Post Content */}
      <div className="post-content prose dark:prose-invert max-w-none">
        {processedContent ? (
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        ) : (
          <p>No content available</p>
        )}
      </div>

      {/* Interaction Buttons */}
      <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t dark:border-gray-700">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"
            }`}
          />
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ url: window.location.href });
            } else {
              alert("Sharing is not supported in this browser.");
            }
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
   


         
        

        <SavePostButton />
      </div>
    </div>
  );
}

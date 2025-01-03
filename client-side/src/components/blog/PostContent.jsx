import { useState, useEffect } from "react";

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

      {/* Action Buttons */}
      
      

    </div>
  );
}

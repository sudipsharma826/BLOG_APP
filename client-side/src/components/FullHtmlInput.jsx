import React, { useState, useRef } from "react";
import DOMPurify from "dompurify";

export default function FullHtmlInput({ value, onChange }) {
  const [copySuccess, setCopySuccess] = useState("");
  const previewRef = useRef(null);

  // Copy the preview (sanitized HTML) as plain text
  const handleCopyPreview = async () => {
    try {
      // Get the text content of the preview div
      const text = previewRef.current?.innerText || "";
      await navigator.clipboard.writeText(text);
      setCopySuccess("Preview copied!");
      setTimeout(() => setCopySuccess(""), 1500);
    } catch {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(""), 1500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Full HTML Input</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {/* HTML Input */}
        <div className="flex-1 flex flex-col">
          <label className="font-semibold mb-1">Paste or type HTML</label>
          <textarea
            className="w-full h-96 border p-4 font-mono text-lg rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type or paste your full HTML content here..."
            value={value}
            onChange={e => onChange(e.target.value)}
            spellCheck={false}
          />
        </div>
        {/* Preview */}
        <div className="flex-1 border p-6 bg-gray-50 rounded shadow min-h-[320px] overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Preview</h3>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              type="button"
              onClick={handleCopyPreview}
            >
              Copy Preview
            </button>
            {copySuccess && <span className="text-green-600 text-sm ml-2">{copySuccess}</span>}
          </div>
          <div
            ref={previewRef}
            style={{ fontSize: '1.15rem', lineHeight: '2' }}
            className="min-h-[100px] prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
          />
        </div>
      </div>
    </div>
  );
}

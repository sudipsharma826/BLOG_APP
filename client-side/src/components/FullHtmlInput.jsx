import React, { useState, useRef } from "react";
import DOMPurify from "dompurify";

export default function FullHtmlInput({ value, onChange }) {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Full HTML Input</h2>
      <div className="w-full">
        <div className="w-full flex flex-col">
          <label className="font-semibold mb-1">Paste or type HTML</label>
          <textarea
            className="w-full h-96 border p-4 font-mono text-lg rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type or paste your full HTML content here..."
            value={value}
            onChange={e => onChange(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

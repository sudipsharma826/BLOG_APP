import { useState } from "react";
import { Subscribe } from "./Subscribe";

// Destructure props inside the function component
export function AuthorInfo({ name, email, image }) {
  const [isLiked, setIsLiked] = useState(false);

  // Fallback handler for image error
  const [imgSrc, setImgSrc] = useState(image || '/images/default-avatar.png');
  const handleImgError = () => setImgSrc('/images/default-avatar.png');

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 
      p-5 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 
      rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Author Info Section */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={imgSrc}
            alt={`${name}'s profile picture`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"
            onError={handleImgError}
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" 
            aria-label="Author is active" 
            title="Active"
          />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
        </div>
      </div>
      
      {/* Subscribe Button Section */}
      <div className="w-full sm:w-auto">
        <Subscribe />
      </div>
    </div>
  );
}
import { useState } from "react";
import { Heart, Share2, Link } from "react-feather"; // Ensure these icons are properly imported
import { SavePostButton } from "./ActionButtons";

// Destructure props inside the function component
export function AuthorInfo({
  name,
  email,
  image,
  }) {
  const [isLiked, setIsLiked] = useState(false);
  

  return (
    <div className="flex items-center justify-between space-x-4 mb-6">
      {/* Author Info Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
         
        </div>
          
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-300"
            }`}
          />
          <span className="dark:text-gray-300">Like</span>
        </button>

        <button
          onClick={() => navigator.share?.({ url: window.location.href })}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="dark:text-gray-300">Share</span>
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Link className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="dark:text-gray-300">Copy Link</span>
        </button>
        <SavePostButton />
      </div>
    </div>
  );
}

import { useState } from "react";
import { Subscribe } from "./Subscribe";



// Destructure props inside the function component
export function AuthorInfo({
  name,
  email,
  image,
  }) {
  const [isLiked, setIsLiked] = useState(false);

  

  // Fallback handler for image error
  const [imgSrc, setImgSrc] = useState(image || '/images/default-avatar.png');
  const handleImgError = () => setImgSrc('/images/default-avatar.png');

  return (
    <div className="flex items-center justify-between space-x-4 mb-6">
      {/* Author Info Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={imgSrc}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
            onError={handleImgError}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
          <p className="text-gray-600 dark:text-gray-400">{email}</p>
        </div>
      </div>
      {/* Buttons Section */}
      <Subscribe />
    </div>
  );
}
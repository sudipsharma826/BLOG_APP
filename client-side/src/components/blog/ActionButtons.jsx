import { useState } from 'react';
import { Bookmark, Star } from 'lucide-react';

// SavePostButton Component
export function SavePostButton() {
  const [isClicked, setIsClicked] = useState(false);
  return (
<button
      onClick={() => setIsClicked(!isClicked)}
      className="focus:outline-none"
    >
      <Bookmark
        className={`w-6 h-6 ${
          isClicked ? 'text-blue-700' : 'text-gray-600'
        } hover:text-blue-700 active:text-blue-700 transition-colors`}
      />
    </button>


  );
}

// RatingSection Component
export function RatingSection() {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex items-center space-x-1 w-1/2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-600'
            } hover:fill-yellow-400 hover:text-yellow-400 transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

// ActionButtons Component
export function ActionButtons() {
  return (
    <div className="flex space-x-4">
      <SavePostButton />
      <RatingSection />
    </div>
  );
}

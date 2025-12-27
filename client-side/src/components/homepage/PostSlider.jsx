
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerSquareDashedIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostSlider = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [posts.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % posts.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <MousePointerSquareDashedIcon className="text-blue-600 dark:text-blue-400 w-7 h-7" />
          Latest Posts
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white transition"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="relative h-[340px] sm:h-[400px] rounded-xl overflow-hidden shadow-lg">
        {posts.map((post, index) => (
          <div
            key={post.id || post._id || index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-col items-center justify-center ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
            />
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl p-6 max-w-xl w-full mx-auto shadow-lg flex flex-col items-center">
                <h3 className="text-lg sm:text-2xl font-bold text-center text-gray-900 dark:text-white mb-2 line-clamp-2" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word'}}>
                  {post.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 text-center mb-3 line-clamp-2" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word'}}>
                  {post.subtitle}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {post.category && post.category.slice(0, 2).map((cat, i) => (
                    <span key={i} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>
                <Link to={`/post/${post.slug}`} className="mt-2">
                  <button className="btn px-6 py-2 text-base font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 gap-2">
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${currentIndex === idx ? 'bg-blue-600 dark:bg-blue-400 scale-125' : 'bg-gray-300 dark:bg-gray-700'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PostSlider;

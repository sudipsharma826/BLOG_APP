import { useState, useEffect } from "react";
import { Clock, Eye, ThumbsUp } from "react-feather";
import { Link } from "react-router-dom";

export function PostHeader({
  category,
  title,
  subtitle,
  readTime,
  updatedAt,
  postViews,
  postLikes,
}) {
  // COUNT THE VIEWS
  const viewsconversion = (numbers) => {
    if (numbers < 1000) {
      return numbers;
    } else if (numbers < 1000000) {
      return (numbers / 1000).toFixed(1) + "K";
    } else {
      return (numbers / 1000000).toFixed(1) + "M";
    }
  }
  
  return (
    <header className="mb-10">
      {/* Post Categories */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <nav aria-label="Post categories" className="flex flex-wrap gap-2">
          {category.map((cat, index) => (
            <Link
              key={index}
              to={`/category/${cat}`}
              className="text-blue-600 hover:no-underline focus:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
            >
              <span
                className="category font-semibold px-4 py-2 rounded-full transition-all duration-200 ease-in-out 
                bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 
                border border-blue-200 dark:border-blue-700 
                hover:bg-blue-200 dark:hover:bg-blue-800 hover:shadow-md
                text-sm"
                role="button"
                tabIndex={-1}
              >
                {cat}
              </span>
            </Link>
          ))}
        </nav>
        
        {/* Post Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {postViews > 100 && (
            <div className="flex items-center gap-1.5" aria-label={`${viewsconversion(postViews)} views`}>
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span>{viewsconversion(postViews)}</span>
            </div>
          )}
          {postLikes > 5 && (
            <div className="flex items-center gap-1.5" aria-label={`${viewsconversion(postLikes)} likes`}>
              <ThumbsUp className="w-4 h-4" aria-hidden="true" />
              <span>{viewsconversion(postLikes)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Title and Subtitle */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-5 leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Read Time and Updated Info */}
      <div className="flex flex-wrap items-center gap-4 text-base text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" aria-hidden="true" />
          <span><span className="font-medium">{readTime}</span> read</span>
        </div>
        <span className="text-gray-400 dark:text-gray-600" aria-hidden="true">•</span>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Updated: </span>
          <time className="font-medium text-gray-700 dark:text-gray-300">{updatedAt}</time>
        </div>
      </div>
    </header>
  );
}

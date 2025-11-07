import { useState, useEffect } from "react";
import { Clock } from "react-feather";
import { Link } from "react-router-dom";

export function PostHeader({
  category,
  title,
  subtitle,
  readTime,
  updatedAt,
  postViews,
  postLikes,
})



 {
 
  
 
  // cOUNT THE VIEWS
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
    <div className="mb-8">
      {/* Post Info */}
      <div className="flex items-center justify-between mb-4">
      <div className="flex flex-wrap gap-1"> {/* Added flex layout with smaller gap */}
  {category.map((category, index) => (
    <Link
      key={index}
      to={`/category/${category}`}  // Link to category page
      className="text-blue-600 hover:no-underline focus:no-underline mr-1" // Removed underline on hover and focus
    >
      <span
        className="category bg-blue-100 text-blue-800  font-semibold px-3 py-1 rounded-full transition-all duration-200 ease-in-out" // Increased font size and transition effect
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#b8dfff")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#cfe8fc")}
      >
        {category} {/* Display category identifier as text */}
      </span>
    </Link>
  ))}
</div>

      <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center space-x-1 dark:text-gray-100">
            <span>{viewsconversion(postViews)} views</span> {/* Corrected from postViwes */}
          </div>
          <div className="flex items-center space-x-1  dark:text-gray-50">
            <span>{viewsconversion(postLikes)} likes</span>
          </div>
        </div>
      </div>

      {/* Title and Subtitle */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-gray-300">{title}</h1>
      <p className="text-xl text-gray-600 mb-6 dark:text-gray-400">{subtitle}</p>

      {/* Read Time and Updated Info */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg text-gray-500 flex items-center space-x-4">
          <div className="flex items-center space-x-2 dark:text-white">
            <Clock className="w-5 h-5" />
            <span>{readTime}</span>
          </div>
          <div className="text-gray-600 font-semibold dark:text-gray-300">Updated: {updatedAt}</div>
        </div>
      </div>
    </div>
  );
}

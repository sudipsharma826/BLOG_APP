import { useState, useEffect } from "react";
import { Clock } from "react-feather";
import { Link } from "react-router-dom";

export function PostHeader({
  category,
  title,
  subtitle,
  readTime,
  updatedAt,
}) {
  return (
    <div className="mb-8">
      {/* Post Info */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/blog/${category}`} className="text-blue-600 hover:underline">
        <span className="category bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {category}
        </span>
        </Link>
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center space-x-1">
            <span>2.5K views</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>142 likes</span>
          </div>
        </div>
      </div>

      {/* Title and Subtitle */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-xl text-gray-600 mb-6">{subtitle}</p>

      {/* Read Time and Updated Info */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg text-gray-500 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
            <span>{readTime} </span>
          </div>
          <div className="text-gray-600 font-semibold">Updated: {updatedAt}</div>
        </div>
      </div>

      
    </div>
  );
}

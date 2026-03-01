import React from 'react';
import { Folder, FileText } from 'lucide-react';

const CategoryCard = ({ category, onClick, isActive }) => {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl border-2 transition-all duration-300 ${
        isActive 
          ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg'
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon/Image */}
        <div className="relative">
          {category.catrgoryImage ? (
            <div className="w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={category.catrgoryImage}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Folder className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
          )}
          
          {/* Post count badge */}
          <div className="absolute -top-2 -right-2 flex items-center justify-center min-w-[32px] h-8 px-2 rounded-full bg-purple-600 text-white font-bold text-xs shadow-md">
            {category.postCount}
          </div>
        </div>
        
        {/* Category info */}
        <div className="space-y-2 w-full">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
            {category.name}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>
              {category.postCount} {category.postCount === 1 ? 'Post' : 'Posts'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
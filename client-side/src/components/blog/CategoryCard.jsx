import React from 'react';

const CategoryCard = ({ category, onClick, isActive }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${
        isActive ? 'ring-2 ring-purple-500' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16">
          <img
            src={category.catrgoryImage}
            alt={category.name}
            className="h-full w-full rounded-full object-cover"
          />
          <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
            {category.postCount}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold dark:text-white">{category.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{category.postCount} Posts</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
import React from 'react';

export default function SkeletonPostCard() {
  return (
    <div className="card overflow-hidden animate-pulse bg-gray-100 dark:bg-gray-800">
      <div className="aspect-video bg-gray-300 dark:bg-gray-700 w-full" />
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3" />
          <div>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
        </div>
        <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2" />
        <div className="flex flex-wrap mt-2 gap-2">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}

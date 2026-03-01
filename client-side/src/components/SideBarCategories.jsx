import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`,
          { withCredentials: true }
        );
        // Sort categories by post count in descending order and limit to top 20
        const sortedCategories = response.data.categories
          .sort((a, b) => b.postCount - a.postCount)
          .slice(0, 20);
        setCategories(sortedCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-6">
        <Tag className="w-10 h-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No categories available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link 
            key={category._id} 
            to={`/category/${category.name}`}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-700/50 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-purple-200 transition-colors">
              {category.name}
            </span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-purple-600 dark:bg-purple-500 text-white rounded-full">
              {category.postCount}
            </span>
          </Link>
        ))}
      </div>
      <Link
        to="/categories"
        className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 py-2.5 px-4 rounded-full border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 hover:scale-105"
      >
        Browse All Categories
        <ChevronDown size={16} className="rotate-90" />
      </Link>
    </div>
  );
}

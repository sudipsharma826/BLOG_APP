import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`,
          { withCredentials: true }
        );
        setCategories(response.data.categories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const displayedCategories = showAll ? categories : categories.slice(0, 19);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      
      <div className="grid grid-cols-2 gap-3">
        {displayedCategories.map((category) => (
          <Link 
            key={category._id} 
            to={`/category/${category.name}`}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="relative">
              <img 
                src={category.catrgoryImage} 
                alt={category.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {category.postCount}
              </span>
            </div>
            <span className="text-sm font-medium group-hover:text-blue-600 transition-colors truncate">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
      {categories.length > 19 && (
        <Link
          to="/categories"
          className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 py-2"
        >
          Show More
          <ChevronDown size={16} />
        </Link>
      )}
    </div>
  );
}

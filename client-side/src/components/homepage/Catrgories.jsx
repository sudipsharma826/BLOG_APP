import React, { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import PostCard from './PostCard'; // Importing the PostCard component

const CategoryList = () => {
  const [categories, setCategories] = useState([]); // Unique categories
  const [posts, setPosts] = useState([]); // All posts
  const [selectedCategory, setSelectedCategory] = useState(null); // Active category

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`, {
          params: { setDirection: -1 },
        });

  const data = Array.isArray(response.data.posts) ? response.data.posts : [];

        // Extract categories and their counts
        const uniqueCategories = Array.from(
          new Set(data.flatMap((post) => post.category))
        ).map((category) => ({
          name: category,
          count: data.filter((post) => post.category.includes(category)).length,
        })).sort((a, b) => b.count - a.count); // Sort by post count descending

        setPosts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort posts by creation date
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter posts based on the selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category.includes(selectedCategory))
    : posts;

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Filter posts by topic</p>
          </div>
        </div>
        <Link
          to="/categories"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
        >
          View All
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All Posts
        </button>
        {categories.slice(0, 12).map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category.name
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
            <span className="ml-1.5 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.slice(0, 6).map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p className="text-gray-600">No posts available for this category.</p>
        )}
      </div>

      {/* Show More Button */}
      {filteredPosts.length > 6 && selectedCategory && (
        <div className="mt-4 text-center">
          <Link
            to={`/category/${selectedCategory}`}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Show More
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryList;

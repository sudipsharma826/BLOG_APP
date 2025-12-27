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
        }));

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
      {/* Category Buttons */}
      <h2 className="ml-5 text-4xl font-bold mb-4 flex items-center">
        <Tag className="mr-3 text-red-800 dark:text-yellow-200" />
        Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-10 px-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full shadow-md font-semibold transition-all duration-200 border ${selectedCategory === null ? 'ring-2 ring-blue-400' : ''} 
            bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200
            dark:from-[#232736] dark:to-[#2d3250] dark:text-blue-200 dark:border-blue-700 dark:hover:from-[#232736]/80 dark:hover:to-[#2d3250]/80`}
        >
          All Posts
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-full shadow-md font-semibold transition-all duration-200 border ${selectedCategory === category.name ? 'ring-2 ring-purple-400' : ''}
              bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:from-purple-200 hover:to-blue-200
              dark:from-[#232736] dark:to-[#2d3250] dark:text-purple-200 dark:border-purple-700 dark:hover:from-[#232736]/80 dark:hover:to-[#2d3250]/80`}
          >
            {category.name} <span className="ml-1 text-xs text-gray-400 dark:text-gray-400">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Render Posts with PostCard */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

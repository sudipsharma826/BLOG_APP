import React, { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import axios from 'axios';
import PostCard from '../components/homepage/PostCard';
import CategoryCard from '../components/blog/CategoryCard';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`, {
            params: { setDirection: -1 }, // Consider making this dynamic if needed
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`),
        ]);

        // Sorting posts by creation date (most recent first)
        const sortedPosts = postsResponse.data.posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(sortedPosts);
        setCategories(categoriesResponse.data.categories || []); // Ensure empty array if no categories
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]); // Consider setting posts as well to an empty array or a default state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Filtering posts based on selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category.includes(selectedCategory))
    : posts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 py-24 relative dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Tag className="h-12 w-12 mx-auto mb-6 text-white" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore Knowledge by Category
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Dive into our curated collection of articles across various tech domains
          </p>
        </div>
      </div>

  {/* Ad spaces removed per user request */}

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.isArray(categories) && categories.map((category) => (
            <div
              key={category.name}
              className={`transition-all duration-200 bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 hover:-translate-y-1 cursor-pointer group ${selectedCategory === category.name ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <CategoryCard
                category={category}
                isActive={selectedCategory === category.name}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-3xl font-bold mb-8 dark:text-white">
          {selectedCategory ? `Posts in "${selectedCategory}"` : 'Latest Posts'}
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="transition-all duration-200 bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 hover:-translate-y-1 cursor-pointer group"
                >
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <p className="text-gray-700 dark:text-gray-300 col-span-full text-center py-12">
                No posts available for this category.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;

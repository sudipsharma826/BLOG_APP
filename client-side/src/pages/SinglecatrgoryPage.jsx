import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SingleCategoryPage = () => {
  const { category: categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch category info based on categorySlug
        const categoryResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategory/${categorySlug}`
        );
        setCategory(categoryResponse.data.category);

        // Fetch posts for this category
        const postsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`,
          {
            params: { category: categorySlug },
          }
        );
        setPosts(postsResponse.data.posts);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-xl text-gray-300">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-xl text-gray-300">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Category Hero with background image */}
      <div
        className="text-center text-white bg-cover bg-center relative"
        style={{ backgroundImage: `url(${category.catrgoryImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-md">{category.name}</h1>
          <p className="text-xl max-w-2xl mx-auto mb-4 text-shadow-md">
            Explore our collection of {category.name.toLowerCase()} articles
          </p>
          <p className="text-lg font-semibold text-shadow-md">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>

  {/* Ad spaces removed per user request */}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post._id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover transition-transform transform hover:scale-105"
              />
              <div className="p-6">
                <span className="text-purple-600 text-sm font-semibold">{category.name}</span>
                <h3 className="mt-2 text-xl font-semibold text-gray-300 hover:text-purple-700 transition-all">{post.title}</h3>
                <h3 className="text-sm font-semibold mb-2 text-gray-400">{post.subtitle}</h3>
                <p className="mt-2 text-gray-300 line-clamp-2">{typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '') : 'No content available'}</p>
                <div className="mt-4 flex items-center">
                  <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-300">{post.author.username}</p>
                    <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">No posts found in this category</p>
          </div>
        )}
      </div>

  {/* Ad spaces removed per user request */}
    </div>
  );
};

export default SingleCategoryPage;

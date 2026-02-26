import React, { useEffect, useState } from 'react';
import SkeletonPostCard from '../components/homepage/SkeletonPostCard';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { SEO } from '../components/blog/SEO';
import NotFound from './NotFound';

const SingleCategoryPage = () => {
  const { category: categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

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
        // Check if 404 error
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || 'Error fetching category data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonPostCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Show NotFound component for 404 errors
  if (notFound || (!category && !loading && !error)) {
    return (
      <div className="pt-20">
        <NotFound 
          resourceType="Category"
          resourceName={categorySlug}
          errorCode="404"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 dark:bg-gray-900 flex items-center justify-center pt-20">
        <div className="max-w-lg text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Error Loading Category</h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8">{error}</p>
          <Link to="/categories" className="text-blue-500 hover:underline">Browse All Categories</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${category?.name || 'Category'} Articles | TechKnows`}
        description={`Explore our collection of ${posts.length} articles about ${category?.name}. In-depth guides, tutorials, and insights on ${category?.name}.`}
        keywords={`${category?.name}, ${category?.name} tutorials, ${category?.name} guides, programming, technology, TechKnows`}
        image={category?.catrgoryImage}
        url={`https://sudipsharma.com.np/category/${categorySlug}`}
        type="website"
        section={category?.name}
      />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-20">
      {/* Category Hero with background image and improved overlay */}
      <div
        className="text-center text-white bg-cover bg-center relative shadow-lg rounded-b-3xl overflow-hidden"
        style={{ backgroundImage: `url(${category.catrgoryImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70"></div>
        <div className="relative z-10 py-20 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{category.name}</h1>
          <p className="text-xl max-w-2xl mx-auto mb-4 drop-shadow-md">
            Explore our collection of {category.name.toLowerCase()} articles
          </p>
          <p className="text-lg font-semibold drop-shadow-md">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>

  {/* Ad spaces removed per user request */}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/post/${post.slug}`}
              className="block"
            >
              <article
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer h-full"
              >
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">{category.name}</span>
                </div>
                <div className="p-6">
                  <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-all line-clamp-2">{post.title}</h3>
                  <p className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400 line-clamp-1">{post.subtitle}</p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">{typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'No content available'}</p>
                  <div className="mt-4 flex items-center">
                    {post.author?.avatar && (
                      <img
                        src={post.author.avatar}
                        alt={post.author.username}
                        className="w-10 h-10 rounded-full border-2 border-purple-500 shadow"
                        loading="lazy"
                      />
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{post.author?.username || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400">No posts found in this category yet.</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
              Browse all posts
            </Link>
          </div>
        )}
      </div>

  {/* Ad spaces removed per user request */}
    </div>
    </>
  );
};

export default SingleCategoryPage;

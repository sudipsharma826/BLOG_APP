import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, MessageSquare, ThumbsUpIcon } from 'lucide-react';

const RelatedPosts = ({ categories }) => {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`,
          {
            params: { categories: currentCategory || categories[0] },
            withCredentials: true,
          }
        );
        const fetchedPosts = Array.isArray(response.data.posts) ? response.data.posts : [];
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentCategory, categories]);

  const displayPosts = showMore ? posts : posts.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-200">
          Related Posts
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setCurrentCategory(category);
                setShowMore(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                currentCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loader spinner-border animate-spin inline-block w-6 h-6 border-3 rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <Link to={`/post/${post.slug}`} className="block">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </Link>
              
              <div className="p-3">
                {console.log(post.slug)}
                <Link to={`/post/${post.slug}`}>
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                {post.category.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {post.category.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-3">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center text-xs text-gray-500">
                      <ThumbsUpIcon className="w-3.5 h-3.5 mr-1 text-blue-500" />
                      {post.usersLikeList.length}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                      <Heart className="w-3.5 h-3.5 mr-1 text-red-500" />
                      {post.usersLoveList.length}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                      <MessageSquare className="w-3.5 h-3.5 mr-1 text-gray-500" />
                      {post.usersCommentList.length}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                      <Bookmark className="w-3.5 h-3.5 mr-1 text-gray-500" />
                      {post.usersSaveList.length}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/post/${post.slug}`}
                  className="block w-full text-center bg-indigo-600 text-white text-sm py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {posts.length > 4 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowMore(!showMore)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
          >
            {showMore ? 'Show Less' : 'Show More Posts'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RelatedPosts;

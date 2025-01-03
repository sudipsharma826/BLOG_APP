import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, Clock, ChevronDown, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`
        );
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('category') || '';

    setSidebarData({
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl,
    });

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getposts?${urlParams.toString()}`
        );
        setPosts(res.data.posts || []);
        setShowMore(res.data.posts.length === 9);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', numberOfPosts);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getposts?${urlParams.toString()}`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      setShowMore(res.data.posts.length === 9);
    } catch (err) {
      console.error('Error fetching more posts:', err);
    }
  };
  console.log(posts);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Search
                  </label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="searchTerm"
                      placeholder="Search posts..."
                      value={sidebarData.searchTerm}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort By
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      id="sort"
                      value={sidebarData.sort}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="desc">Latest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={sidebarData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Search Results
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {posts.length} posts found
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="p-6">
                  {posts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((post) => (
                        <div
                          key={post._id}
                          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200"
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                              {post.category}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="mt-2 text-gray-600 line-clamp-2 text-xl dark:text-gray-300">
                    {/* Remove HTML tags from post.content */}
                    {typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '') : 'No content available'}
                  </p>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={post.author.avatar || 'https://via.placeholder.com/40'}
                                  alt={post.author.username}
                                  className="w-8 h-8 rounded-full"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {post.author.username}
                                </span>
                              </div>
                              <span className="text-xs text-gray-900 dark:text-white">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showMore && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleShowMore}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import PostCard from '../components/homepage/PostCard';
import SkeletonPostCard from '../components/homepage/SkeletonPostCard';
import SearchBar from '../components/homepage/SearchBar';
import axios from 'axios';
import SEOHead from '../components/SEOHead';


const PostsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const observerTarget = useRef(null);

  const fetchPosts = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setStartIndex(0);
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`,
        {
          params: {
            searchTerm: searchQuery,
            setDirection: -1,
            excludeContent: true, // Exclude full content for performance
            startIndex: reset ? 0 : startIndex,
            limit: 12,
          },
        }
      );
      
      const newPosts = response.data.posts || [];
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 12);
      setStartIndex(prev => reset ? 12 : prev + 12);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchPosts(false);
    }
  }, [loadingMore, hasMore, startIndex, searchQuery]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loadingMore, loading]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPosts(true); // Reset posts when search changes
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <>
      <SEOHead
        title={searchQuery ? `Search Results for "${searchQuery}" | TechKnows` : "All Posts | TechKnows - Technology & Programming Articles"}
        description={searchQuery ? `Find articles related to "${searchQuery}" on TechKnows. Browse ${posts.length} results.` : "Browse all technology and programming articles on TechKnows. Find tutorials, guides, and insights on JavaScript, Python, React, Node.js, and more."}
        keywords={`tech articles, programming posts, ${searchQuery || 'technology blog'}, tutorials, coding guides`}
        url="/posts"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "TechKnows Articles",
          "description": "Technology and programming articles",
          "url": "https://sudipsharma.com.np/posts"
        }}
      />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-700 to-purple-700 py-24 dark:from-gray-800 dark:to-gray-900 overflow-hidden shadow-lg rounded-b-3xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Search className="h-14 w-14 mx-auto mb-6 text-white drop-shadow-lg animate-bounce" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Discover Amazing Content
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our latest articles, tutorials, and insights from top creators.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {searchQuery ? 'Search Results' : 'All Posts'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonPostCard key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4V7m0 0V5a2 2 0 10-4 0v2m0 0a2 2 0 104 0v2m0 0v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2z" /></svg>
              <span className="text-2xl text-gray-500 dark:text-gray-400 font-semibold">No posts found.</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="transition-all duration-200 bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 hover:-translate-y-1 cursor-pointer group"
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
              
              {/* Infinite Scroll Trigger */}
              <div ref={observerTarget} className="flex justify-center py-8">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-medium">Loading more posts...</span>
                  </div>
                )}
                {!hasMore && posts.length > 0 && (
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No more posts to load
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default PostsPage;
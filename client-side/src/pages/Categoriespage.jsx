import React, { useEffect, useState, useRef } from 'react';
import { Tag, Folder, TrendingUp, Grid } from 'lucide-react';
import axios from 'axios';
import PostCard from '../components/homepage/PostCard';
import SkeletonPostCard from '../components/homepage/SkeletonPostCard';
import CategoryCard from '../components/blog/CategoryCard';
import SEOHead from '../components/SEOHead';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const postsSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`, {
            params: { 
              setDirection: -1,
              excludeContent: true // Exclude full content for performance
            },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`),
        ]);

        // Sorting posts by creation date (most recent first)
        const sortedPosts = postsResponse.data.posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Sorting categories by post count (most posts first)
        const sortedCategories = (categoriesResponse.data.categories || []).sort(
          (a, b) => b.postCount - a.postCount
        );

        setPosts(sortedPosts);
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtering posts based on selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category.includes(selectedCategory))
    : posts;

  return (
    <>
      <SEOHead
        title="Categories | TechKnows - Browse All Technology Topics"
        description="Browse all technology and programming categories at TechKnows. Find articles on your favorite topics including JavaScript, Python, Web Development, React, Node.js, AI, Machine Learning, and more."
        keywords="tech categories, programming topics, technology articles, web development, coding categories, JavaScript tutorials, Python guides, React tutorials, Node.js articles"
        url="/categories"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Technology Categories",
          "description": "Browse technology and programming categories",
          "url": "https://sudipsharma.com.np/categories",
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": categories.length,
            "itemListElement": categories.slice(0, 10).map((cat, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Thing",
                "name": cat.name,
                "url": `https://sudipsharma.com.np/category/${cat.name}`
              }
            }))
          }
        }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-900 dark:to-purple-950 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
              <Folder className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore by Category
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Discover articles organized by topics that matter to you
            </p>
            
            <div className="flex items-center justify-center gap-12 mt-10">
              <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                <Grid className="h-5 w-5 text-white" />
                <div>
                  <p className="text-2xl font-bold text-white">{categories.length}</p>
                  <p className="text-sm text-white/80">Categories</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-white" />
                <div>
                  <p className="text-2xl font-bold text-white">{posts.length}</p>
                  <p className="text-sm text-white/80">Total Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              All Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a category to filter articles
            </p>
          </div>

          {selectedCategory && (
            <div className="mb-8 flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Filtered by: <span className="text-purple-600 dark:text-purple-400">{selectedCategory}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(categories) && categories.map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                isActive={selectedCategory === category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setTimeout(() => {
                    if (postsSectionRef.current) {
                      postsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
              />
            ))}
          </div>
        </div>

        {/* Posts Section */}
        <div ref={postsSectionRef} className="bg-white dark:bg-gray-800 py-16 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {selectedCategory ? `Posts in "${selectedCategory}"` : 'All Posts'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {loading 
                  ? 'Loading articles...' 
                  : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'article' : 'articles'} found`
                }
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonPostCard key={i} />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="transition-all duration-300 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 hover:-translate-y-2 cursor-pointer group"
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-xl p-16 text-center border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center">
                  <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-6">
                    <Tag className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Articles Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    No posts available in this category yet. Check back soon for new content!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryList;

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
            params: { setDirection: -1 },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`),
        ]);

        // Sorting posts by creation date (most recent first)
        const sortedPosts = postsResponse.data.posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(sortedPosts);
        setCategories(categoriesResponse.data.categories || []);
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 pt-20">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-900 dark:via-pink-900 dark:to-indigo-900 py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')] opacity-10"></div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-10 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-75"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Folder className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Explore by Category
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover articles organized by topics that matter to you
            </p>
            
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Grid className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-3xl font-bold text-white">{categories.length}</p>
                  <p className="text-sm text-white/80">Categories</p>
                </div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-3xl font-bold text-white">{posts.length}</p>
                  <p className="text-sm text-white/80">Total Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Browse Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Select a category to filter articles
            </p>
          </div>

          {selectedCategory && (
            <div className="mb-8 flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filtered by: <span className="text-purple-600 dark:text-purple-400">{selectedCategory}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Clear Filter
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.isArray(categories) && categories.map((category) => (
              <div
                key={category.name}
                className={`transition-all duration-300 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border-2 ${
                  selectedCategory === category.name 
                    ? 'border-purple-500 dark:border-purple-400 ring-4 ring-purple-500/20' 
                    : 'border-gray-200 dark:border-gray-700'
                } hover:-translate-y-2 cursor-pointer group`}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setTimeout(() => {
                    if (postsSectionRef.current) {
                      postsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
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

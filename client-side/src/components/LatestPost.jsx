import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, ThumbsUp, Bookmark, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Separate PostStats component with enhanced styling
function PostStats({ list = [], icon: Icon, color }) {
  const count = list.length;
  if (count === 0) return null;
  
  return (
    <div className={`flex items-center gap-1 ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{count}</span>
    </div>
  );
}

// Separate CategoryTag component with gradient
function CategoryTag({ category }) {
  return (
    <Link
      to={`/category/${category}`}
      className="inline-flex items-center text-xs px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 font-medium border border-blue-200/50 dark:border-blue-700/50"
    >
      {category}
    </Link>
  );
}

// Format relative time
function getRelativeTime(date) {
  const now = new Date();
  const postDate = new Date(date);
  const diffInMs = now - postDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
  return `${Math.floor(diffInDays / 365)}y ago`;
}

// Single Post Card Component - Redesigned
function PostCard({ post, index }) {
  const hasEngagement = (post.usersLikeList?.length + post.usersLoveList?.length + post.usersSaveList?.length) > 10;
  const isTopPost = index < 3;
  
  return (
    <article className="group relative">
      <Link 
        to={`/post/${post.slug}`} 
        className={`flex gap-3.5 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/10 transition-all duration-300 border ${
          isTopPost 
            ? 'border-gray-200/60 dark:border-gray-700/60' 
            : 'border-transparent'
        } hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-lg hover:-translate-y-0.5`}
      >
        {/* Trending Badge for Top Posts */}
        {isTopPost && hasEngagement && (
          <div className="absolute -left-1.5 -top-1.5 z-10">
            <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-orange-400 via-pink-500 to-red-500 rounded-full shadow-lg animate-pulse">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        )}
        
        {/* Image Section */}
        {post.image && (
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 group-hover:to-black/20 transition-all duration-300" />
            {isTopPost && (
              <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-purple-600 dark:text-purple-400 shadow-sm">
                #{index + 1}
              </div>
            )}
          </div>
        )}
        
        {/* Content Section */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Category & Date */}
          <div className="flex items-center gap-2 flex-wrap">
            {post.category?.slice(0, 1).map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Clock className="w-3 h-3" />
              <span>{getRelativeTime(post.createdAt)}</span>
            </div>
          </div>
          
          {/* Title */}
          <h4 className={`font-semibold leading-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${
            isTopPost ? 'text-base' : 'text-sm'
          }`}>
            {post.title}
          </h4>
          
          {/* Subtitle - Only show on top posts */}
          {isTopPost && post.subtitle && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 leading-relaxed">
              {post.subtitle}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 pt-0.5">
            <PostStats 
              list={post.usersLikeList || []} 
              icon={ThumbsUp} 
              color="text-blue-600 dark:text-blue-400"
            />
            <PostStats 
              list={post.usersLoveList || []} 
              icon={Heart} 
              color="text-red-500 dark:text-red-400"
            />
            <PostStats 
              list={post.usersSaveList || []} 
              icon={Bookmark} 
              color="text-green-600 dark:text-green-400"
            />
            {(post.usersCommentList?.length || 0) > 0 && (
              <PostStats 
                list={post.usersCommentList || []} 
                icon={MessageSquare} 
                color="text-purple-600 dark:text-purple-400"
              />
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function LatestPosts({ excludePostId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`,
          { 
            params: { 
              setDirection: -1,
              excludeContent: true // Exclude full content for performance
            },
            withCredentials: true 
          }
        );
        let filteredPosts = response.data.posts;
        if (excludePostId) {
          filteredPosts = filteredPosts.filter(post => post._id !== excludePostId);
        }
        setPosts(filteredPosts.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [excludePostId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 p-3 animate-pulse">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No posts available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {posts.map((post, index) => (
        <React.Fragment key={post._id}>
          <PostCard post={post} index={index} />
          {index < posts.length - 1 && (
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

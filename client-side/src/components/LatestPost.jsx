import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, ThumbsUp, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Separate PostStats component
function PostStats({ list = [], icon: Icon }) {
  return (
    <div className="flex items-center text-gray-500">
      <Icon className="w-3 h-3 mr-1" />
      <span className="text-xs">{list.length}</span>
    </div>
  );
}

// Separate CategoryTag component
function CategoryTag({ category }) {
  return (
    <Link
      to={`/category/${category}`}
      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
    >
      {category}
    </Link>
  );
}

// Single Post Card Component
function PostCard({ post }) {
  return (
    <article className="group border-b last:border-b-0 pb-4 last:pb-0 mb-4 last:mb-0">
      <Link to={`/post/${post.slug}`} className="flex gap-3">
        {post.image && (
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0 overflow-hidden">
          <h4 className="font-medium text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h4>
          <p className="font-medium text-sm text-gray-500 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.subtitle}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {post.category.slice(0, 1).map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2 text-gray-500 text-xl ">
            <PostStats  list={post.usersLikeList} icon={ThumbsUp} />
            <PostStats list={post.usersCommentList} icon={MessageSquare} />
            <PostStats list={post.usersLoveList} icon={Heart} />
            <PostStats list={post.usersSaveList} icon={Bookmark} />
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function LatestPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`,
          { 
            params: { setDirection: -1 },
            withCredentials: true 
          }
        );
        setPosts(response.data.posts.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

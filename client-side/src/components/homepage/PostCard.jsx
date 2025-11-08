import React from 'react';
import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
  <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Post image section */}
      <div className="aspect-video relative">
        {post.image ? (
          <Link to={`/post/${post.slug}`}>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full card-image-cover"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Post details section */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          {/* Author avatar or placeholder */}
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-3">
              <User className="w-5 h-5" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {post.author.username}
            </p>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Post title */}
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {post.title}
          </h3>
        </Link>

        {/* Post subtitle */}
        <Link to={`/post/${post.slug}`}>
          <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
            {post.subtitle}
          </h4>
        </Link>

        {/* Post content */}
        <p className="mt-2 text-gray-700 dark:text-gray-200 line-clamp-2">
          {/* Remove HTML tags from post.content */}
          {typeof post.content === 'string'
            ? post.content.replace(/<[^>]*>/g, '')
            : 'No content available'}
        </p>

        {/* Post categories */}
        <div className="flex flex-wrap mt-2">
          {post.category.map((category, index) => (
            <Link key={index} to={`/category/${category}`}>
              <span className="badge mr-2 mb-2 text-sm px-4 py-1">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

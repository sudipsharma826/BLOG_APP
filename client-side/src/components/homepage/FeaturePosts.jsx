import React from 'react';
import AdSense from '../blog/AdSense';
import { Link } from 'react-router-dom';
import AdSpaceContainer from '../blog/AdSpaceContainer';

export default function FeaturedPosts({ posts }) {
  return (
    <>
    <section className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="ml-10 text-4xl font-bold text-gray-900 mb-8 dark:text-white">Featured Posts</h2>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {posts.map((post) => (
  <article
    key={post.id} // Ensure each article has a unique key
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow dark:bg-gray-700"
  >
    <Link to={`/post/${post.slug}`}>
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
    </Link>
    <div className="p-6">
      <span className=" text-purple-600  font-semibold text-lg dark:text-yellow-400">
        {post.category.map((cat, index) => (
          <Link to={`/category/${cat}`} key={`${cat}-${index}`}> {/* Ensure unique key */}
            <span className='ml-4'>{cat}</span>
          </Link>
        ))}
      </span>
      <Link to={`/post/${post.slug}`}>
        <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
          {post.title}
        </h3>
        <p className="mt-2 text-gray-600 line-clamp-2 text-xl dark:text-gray-300">
          {typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '') : 'No content available'}
        </p>
      </Link>
      <div className="mt-4 flex items-center">
        <img
          src={post.author.avatar}
          alt={post.author.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3 ">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-200">
            {post.author.username}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  </article>

            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No featured posts available.</p>
        )}
      </div>

      {/* AdSense Horizontal */}
      <AdSpaceContainer />
    </section>
    </>
  );
}

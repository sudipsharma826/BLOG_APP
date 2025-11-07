import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerSquareDashedIcon, PoundSterling, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostSlider = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [posts.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % posts.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);

  return (
    <>
    <h2 className="ml-10 text-4xl font-bold mb-4 flex items-center" style={{color: 'var(--color-text)'}}>
      <MousePointerSquareDashedIcon className="mr-3 text-3xl" style={{color: 'var(--color-primary)'}} />
        Latest Posts
      </h2>
    <section className="relative h-[400px]">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover opacity-60"
            />
          </div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50" /> {/* Dark overlay */}
            <div className="relative z-10 text-center text-white px-6 py-12">
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg" style={{color: 'var(--color-surface)'}}>{post.title}</h2>
              <p className="text-xl font-semibold mb-4 drop-shadow-lg" style={{color: 'rgba(255,255,255,0.9)'}}>{post.subtitle}</p>
              {post.category.map((category, index) => (
    <Link to={`/category/${category}`}>
  <span
    key={index}  // Use index or unique identifier if available
    className="inline-block bg-blue-400 text-gray-800 text-sm px-6 py-1 rounded-full mr-2 mb-2"  // Add margin right (mr-2) to space them
  >
    {category}
  </span>
  </Link>
))}


              <p className="text-lg text-gray-200 mb-6 line-clamp-3 drop-shadow-lg mt-3">
                {/* Remove HTML tags from post.content */}
                {/* {typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '') : 'No content available'} */}
              </p>
              
              <Link to={`/post/${post.slug}`}>
                <button className="btn hover:brightness-95">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
    </>
  );
};

export default PostSlider;

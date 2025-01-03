import React from "react";
import { Card } from "flowbite-react";
import { Badge, BookmarkMinus, Clock, Heart, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function SavedPostCard({ post, author, handleRemovePost }) {
  const currentUser = useSelector((state) => state.user.currentUser);

  // Function to unsave a post
  const handleUnSavePost = async () => {
    console.log("Unsaving post:", post._id);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/unsavePost/${post._id}`,{},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Post unsaved successfully");
        handleRemovePost(post._id); // Call the parent-provided function to update the state of the savesdPosts array
      }
     
    } catch (error) {
      console.error("Error unsaving post:", error.message);
    }
  };

  // Helper function to strip HTML tags
  const stripHTMLTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <Card className="mb-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Image */}
        {post.image && (
          <Link 
            to={`/post/${post.slug}`} 
            className="md:w-1/3 overflow-hidden rounded-lg"
          >
            <div className="relative h-48 md:h-full">
              <img
                src={post.image}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Link>
        )}

        {/* Right side - Content */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Header with author info and date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 dark:text-white " >
              <img
                src={author?.photoURL || "/default-avatar.png"}
                alt={author?.username}
                className="h-10 w-10 rounded-full object-cover border-2 border-gray-100"
              />
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-200">
                  {author?.username || "Anonymous"}
                </h5>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(post.createdAt).toDateString()}
                </div>
              </div>
            </div>
            
            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {post.category.map((cat, index) => (
                <Badge 
                  key={index} 
                  color="indigo" 
                  className="px-3 py-1 text-xs"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Post content */}
          <div className="mb-4">
            <Link to={`/post/${post.slug}`}>
              <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors dark:text-gray-200">
                {post.title}
              </h3>
            </Link>
            <p className="text-gray-600 line-clamp-3 dark:text-gray-400">
              {stripHTMLTags(post.content)}
            </p>
          </div>

          {/* Footer with actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex space-x-6 dark: text-white">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                <ThumbsUp className="h-5 w-5" />
                <span>{post.usersLikeList?.length || 0}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors">
                <Heart className="h-5 w-5" />
                <span>{post.usersLoveList?.length || 0}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>{post.usersCommentList?.length || 0}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={handleUnSavePost}
              className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <BookmarkMinus className="h-5 w-5 dark:text-white" />
              <span className="font-medium">Unsave</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
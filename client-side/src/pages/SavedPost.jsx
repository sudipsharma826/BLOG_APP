import React, { useState, useEffect } from "react";
import { TextInput } from "flowbite-react";
import { SavedPostCard } from "../components/SavedPostCard";
import { BookmarkX } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const SavedPost = () => {
  const [search, setSearch] = useState(""); // State to track the search input
  const [savedPostIds, setSavedPostIds] = useState([]); // State to store saved post IDs
  const [savedPosts, setSavedPosts] = useState([]); // State to store full post details
  const [authors, setAuthors] = useState([]); // State to store author details
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const currentUser = useSelector((state) => state.user.currentUser);

  // Step 1: Fetch saved post IDs
  useEffect(() => {
    const getSavedPostIds = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getSavedPostIds/${currentUser._id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser.currentToken}`, // Use correct token from state
            },
          }
        );

        if (response.status === 200) {
          setSavedPostIds(response.data.savedPostId); // Store saved post IDs
        }
      } catch (error) {
        console.error("Error fetching saved post IDs:", error.message);
      }
    };

    if (currentUser?._id) {
      getSavedPostIds();
    }
  }, [currentUser]);

  // Step 2: Fetch post and author details for all saved post IDs
  useEffect(() => {
    const fetchSavedPostsAndAuthors = async () => {
      setIsLoading(true); // Start loading
      try {
        if (savedPostIds.length === 0) {
          setSavedPosts([]);
          setAuthors([]);
          setIsLoading(false); // End loading
          return;
        }

        // Fetch post details
        const postRequests = savedPostIds.map((postId) =>
          axios.get(
            `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`,
            {
              params: { postId: postId },
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${currentUser.currentToken}`,
              },
            }
          )
        );

        const postResponses = await Promise.all(postRequests);
        const posts = postResponses.map((response) => response.data.posts[0]); // Extract post details
        setSavedPosts(posts);

        // Fetch author details
        const authorRequests = posts
          .filter((post) => post?.authorEmail) // Ensure posts with `authorEmail` are valid
          .map((post) =>
            axios.get(
              `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getuser/${post.authorEmail}`,
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${currentUser.currentToken}`,
                },
              }
            )
          );

        const authorResponses = await Promise.all(authorRequests);
        const authorsData = authorResponses.map((response) => response.data);
        setAuthors(authorsData); // Store all authors in the state
      } catch (error) {
        console.error("Error fetching saved post and author details:", error.message);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    if (savedPostIds.length > 0) {
      fetchSavedPostsAndAuthors();
    } else {
      setIsLoading(false); // No saved posts
    }
  }, [savedPostIds, currentUser.currentToken]);

  // Step 3: Filter posts based on the search input
  const filteredPosts = savedPosts.filter((post) =>
    post?.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle unsave post
  const handleRemovePost = (postId) => {
    setSavedPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4 justify-center">Saved Posts</h3>
      <div className="mb-4">
        <TextInput
          type="text"
          placeholder="Search saved posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        {isLoading ? (
          <p className="text-center mt-4">Loading saved posts...</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const author = authors?.find(
              (author) => author?.email === post?.authorEmail // Safely access properties
            );

            return (
              <SavedPostCard
                key={post._id} // Assuming the post object has _id as a key
                post={post} // Pass the entire post object to SavedPostCard
                author={author || null} // Pass the corresponding author or null
                handleRemovePost={handleRemovePost} // Pass the function to remove the post
              />
            );
          })
        ) : (
          <div className="text-center mt-4">
            <BookmarkX size={48} className="mx-auto text-gray-400" />
            <p className="text-gray-600 mt-2">No saved posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPost;

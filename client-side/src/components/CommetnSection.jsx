import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Button, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comments'; // Ensure the path is correct
import { FaComments } from 'react-icons/fa';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch comments
  const getComments = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      if (!postId) {
        setComments([]);
        setLoading(false);
        setFetchError('No post selected.');
        return;
      }
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/comment/getPostComments/${postId}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setComments(res.data); // Set fetched comments
      } else {
        setFetchError('Failed to fetch comments.');
      }
    } catch (error) {
      setFetchError(error.message || 'Error fetching comments.');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments on component mount or when postId changes
  useEffect(() => {
    getComments();
  }, [postId, currentUser?._id]);

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200) {
      setCommentError('Comment cannot exceed 200 characters.');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/comment/create`,
        {
          content: comment,
          postId,
          userId: currentUser?._id,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );

      if (res.status === 200) {
        setComment(''); // Clear the input field
        setCommentError(null);
        await getComments(); // Fetch comments again to update the list
      }
    } catch (error) {
      setCommentError(error.response?.data?.message || error.message);
    }
  };

  // Handlers for like, unlike, and delete
  const handleLike = (commentId) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId ? { ...comment, liked: true } : comment
      )
    );
  };

  const handleUnlike = (commentId) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId ? { ...comment, liked: false } : comment
      )
    );
  };

  const handleDelete = (commentId) => {
    setComments((prev) =>
      prev.filter((comment) => comment._id !== commentId)
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.photoURL}
            alt=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-xl text-teal-500 my-5 flex gap-1 dark:text-white">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to="/signin">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {loading ? (
        <p className="text-sm my-5">Loading comments...</p>
      ) : fetchError ? (
        <Alert color="failure" className="my-5">{fetchError}</Alert>
      ) : comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onUnlike={handleUnlike}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}
    </div>
  );
}

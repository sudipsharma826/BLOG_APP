import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaTrashAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

export default function Comment({ comment, onLike, onUnlike, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (Array.isArray(comment.likes) && comment.likes.includes(currentUser?._id)) {
      setLiked(true);
    }
  }, [comment.likes, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/comment/likeComment/${comment._id}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      setLiked(true);
      onLike(comment._id);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleUnlike = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/comment/unlikeComment/${comment._id}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      setLiked(false);
      onUnlike(comment._id);
    } catch (error) {
      console.error('Error unliking comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/comment/deleteComment/${comment._id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      onDelete(comment._id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={comment.userId?.photoURL || '/images/user.png'}
          alt={comment.userId?.username || 'Anonymous'}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {comment.userId ? `@${comment.userId.username}` : 'Anonymous'}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">
          {comment.deleted ? 'This comment has been deleted.' : comment.content}
        </p>

        {!comment.deleted && (
          <div className="flex items-center">
            <button
              onClick={liked ? handleUnlike : handleLike}
              className={`flex items-center text-sm ${
                liked ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <FaThumbsUp className="mr-1" />
              {liked ? 'Liked' : 'Like'}
            </button>
            {currentUser?._id === comment.userId?._id && (
              <button
                onClick={handleDelete}
                className="ml-3 text-red-500 text-sm"
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

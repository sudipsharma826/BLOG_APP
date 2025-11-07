import { Table, Modal, Button, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const [handleMessage, setHandleMessage] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getposts`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser.currentToken}`,
            },
          }
        );
        if (res.status === 200) {
          setUserPosts(res.data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  // Handle messages
  const showMessage = (message, type) => {
    setHandleMessage({ message, type });
    setTimeout(() => setHandleMessage({ message: '', type: '' }), 6000);
  };

  // Delete Post Handler
  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/deletepost/${deleteSlug}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        // Remove the deleted post from the UI
        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post.slug !== deleteSlug)
        );
        setShowModal(false);
        setDeleteSlug(null);
        showMessage('Post deleted successfully', 'success');
      } else {
        console.error('Failed to delete post:', response.data);
        showMessage('Failed to delete post. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
      showMessage(
        'An error occurred while deleting the post. Please try again.',
        'error'
      );
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && userPosts.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Author Email</Table.HeadCell>
            <Table.HeadCell>👍</Table.HeadCell>
            <Table.HeadCell>❣️</Table.HeadCell>
            <Table.HeadCell>📑</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userPosts.map((post) => (
              <Table.Row
                key={post._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    className="font-medium text-gray-900 dark:text-white"
                    to={`/post/${post.slug}`}
                  >
                    {post.title.length > 10
                      ? `${post.title.slice(0, 10)}...`
                      : post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{post.category.join(', ')}</Table.Cell>
                <Table.Cell>
                  {post.authorEmail.length > 3
                    ? `${post.authorEmail.slice(0, 3)}...`
                    : post.authorEmail}
                </Table.Cell>
                <Table.Cell>{post.usersLikeList.length}</Table.Cell>
                <Table.Cell>{post.usersLoveList.length}</Table.Cell>
                <Table.Cell>{post.usersSaveList.length}</Table.Cell>
                <Table.Cell className="text-center">
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setDeleteSlug(post.slug);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center">
                  <Link
                    className="text-teal-500 hover:underline"
                    to={`/updatepost/${post.slug}`}
                  >
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="text-center text-2xl font-bold text-red-900 dark:text-white">
          No Post Found
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Floating Add Post Button */}
      <Link
        to="/create-post"
        className="fixed bottom-10 right-10 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
      >
        <span className="text-3xl font-bold">+</span>
      </Link>

      {/* Message Alert */}
      {handleMessage.message && (
        <Alert
          className="mb-5 flex items-center gap-2"
          color={handleMessage.type === 'success' ? 'success' : 'failure'}
        >
          {handleMessage.message}
        </Alert>
      )}
    </div>
  );
}

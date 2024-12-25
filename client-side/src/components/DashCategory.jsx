import { Alert, Table, Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { current } from '@reduxjs/toolkit';

export default function DashCategories() {
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [handleMessage, setHandleMessage] = useState({ message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handle messages
  const showMessage = (message, type) => {
    setHandleMessage({ message, type });
    setTimeout(() => setHandleMessage({ message: '', type: '' }), 6000);
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`,{
          withCredentials: true},{
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
           
            
          },
        });
        if (res.status === 200) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        showMessage('Failed to fetch categories', 'failure');
      }
    };

    fetchCategories();
  }, []);

  // Handle delete category
  const handleDeleteCategory = async () => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/deleteCategory/${selectedCategory}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${currentUser.currentToken}`,
        },
       
      });
      if (res.status === 200) {
        setCategories((prev) => prev.filter((category) => category._id !== selectedCategory)); // Update UI
        showMessage('Category deleted successfully', 'success');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting category:', error.message);
      showMessage('Error deleting category', 'failure');
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">

      {categories.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Category Name</Table.HeadCell>
            <Table.HeadCell>Post Count</Table.HeadCell>
            <Table.HeadCell>Last Updated</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {categories.map((category) => (
              <Table.Row key={category._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="font-medium text-gray-900 dark:text-white">{category.name}</Table.Cell>
                <Table.Cell className="font-medium text-red-800 dark:text-white">{category.postCount}</Table.Cell>
                <Table.Cell className="font-medium text-gray-800 dark:text-white">
                  {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'Invalid Date'}
                </Table.Cell>
                {currentUser?.isAdmin && (
                  <Table.Cell>
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => {
                        setSelectedCategory(category._id);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="text-center text-2xl font-semibold text-gray-800 dark:text-white">No Category Found</div>
      )}
      {handleMessage.message && (
        <Alert
          className="mb-5 flex items-center gap-2"
          color={handleMessage.type === 'success' ? 'success' : 'failure'}
        >
          {handleMessage.message}
        </Alert>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          <div className="text-center">
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this category?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteCategory}>
                Yes, Delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

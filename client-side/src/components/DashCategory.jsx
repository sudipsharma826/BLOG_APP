import { Alert, Table, Modal, Button, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashCategories() {
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [handleMessage, setHandleMessage] = useState({ message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [currentCategoryImage, setCurrentCategoryImage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle messages
  const showMessage = (message, type) => {
    setHandleMessage({ message, type });
    setTimeout(() => setHandleMessage({ message: '', type: '' }), 6000);
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`, {
          withCredentials: true,
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
  }, [currentUser.currentToken]);

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
        setShowModal(false); // Close the modal after success
      }
    } catch (error) {
      console.error('Error deleting category:', error.message);
      setErrorMessage('Failed to delete category');
    }
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append('name', categoryName);
    if (categoryImage) formData.append('image', categoryImage);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/addCategory`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${currentUser.currentToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        setCategories((prev) => [...prev, res.data.category]); // Update the category list
        showMessage('Category added successfully', 'success');
        setShowAddModal(false); // Close the modal after success
      }
    } catch (error) {
      console.error('Error adding category:', error.message);
      setErrorMessage('Failed to add category');
    }
  };

  // Handle editing category
  const handleEditCategory = async () => {
    const formData = new FormData();
    formData.append('name', categoryName);
    if (categoryImage) formData.append('image', categoryImage);

    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/editCategoryImage/${selectedCategory}`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${currentUser.currentToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        const updatedCategory = res.data; // Get the updated category data
        setCategories((prev) =>
          prev.map((category) =>
            category._id === selectedCategory
              ? { ...category, name: categoryName, catrgoryImage: updatedCategory.catrgoryImage } // Update the image
              : category
          )
        );
        setCurrentCategoryImage(updatedCategory.catrgoryImage); // Update the current image in the form immediately
        showMessage('Category updated successfully', 'success');
        setShowEditModal(false); // Close the modal after success
      }
    } catch (error) {
      console.error('Error updating category:', error.message);
      setErrorMessage('Failed to update category');
    }
  };

  // Open edit modal and populate fields with the category data
  const openEditModal = (category) => {
    setSelectedCategory(category._id);
    setCategoryName(category.name);
    setCategoryImage(null); // Reset file input
    setCurrentCategoryImage(category.catrgoryImage); // Set current image for display immediately
    setShowEditModal(true);
  };

  // Handle image preview when file is selected
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      // Preview image immediately after selection
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentCategoryImage(reader.result); // Set preview image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="overflow-x-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Button onClick={() => setShowAddModal(true)} className="mb-4">Add Category</Button>

      {categories.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Category Name</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Post Count</Table.HeadCell>
            <Table.HeadCell>Last Updated</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {categories.map((category) => (
              <Table.Row key={category._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="font-medium text-gray-900 dark:text-white">{category.name}</Table.Cell>
                <Table.Cell>
                  {console.log(category.image)}
                  <img src={category.catrgoryImage} alt={category.name} className="h-12 w-12 object-cover rounded-full" />
                </Table.Cell>
                <Table.Cell className="font-medium text-red-800 dark:text-white">{category.postCount}</Table.Cell>
                <Table.Cell className="font-medium text-gray-800 dark:text-white">
                  {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'Invalid Date'}
                </Table.Cell>
                {currentUser?.isAdmin && (
                  <Table.Cell>
                    <Button
                      onClick={() => openEditModal(category)} // Open the edit modal with current data
                      color="info"
                    >
                      Edit
                    </Button>
                  </Table.Cell>
                )}
                <Table.Cell>
                  <Button
                    onClick={() => {
                      setSelectedCategory(category._id);
                      setShowModal(true);
                    }}
                    color="failure"
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="text-center text-2xl font-bold text-red-900 dark:text-white">No Category Found</div>
      )}

      {handleMessage.message && (
        <Alert className="mb-5 flex items-center gap-2" color={handleMessage.type === 'success' ? 'success' : 'failure'}>
          {handleMessage.message}
        </Alert>
      )}

      {/* Error Messages */}
      {errorMessage && (
        <Alert className="mb-5 flex items-center gap-2" color="failure">
          {errorMessage}
        </Alert>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4" />
          <h3 className="text-center text-xl">Are you sure you want to delete this category?</h3>
          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={handleDeleteCategory}>Yes, delete</Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add Category Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} popup size="md">
        <Modal.Header>Add New Category</Modal.Header>
        <Modal.Body>
          <TextInput
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
          <input
            type="file"
            onChange={handleImageChange} // Updated to handle image preview
            className="mt-4"
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={handleAddCategory}>Add Category</Button>
            <Button color="gray" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} popup size="md">
        <Modal.Header>Edit Category</Modal.Header>
        <Modal.Body>
          <TextInput
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
          {currentCategoryImage && (
            <img
              src={currentCategoryImage}
              alt="Current Category"
              className="h-12 w-12 object-cover rounded-full mb-2"
            />
          )}
          <input
            type="file"
            onChange={handleImageChange} // Updated to handle image preview
            className="mt-4"
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={handleEditCategory}>Save Changes</Button>
            <Button color="gray" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

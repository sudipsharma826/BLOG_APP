import { Alert, Button, FileInput, Label, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind is imported

export default function UpdatePost() {
  const currentUser = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
  });
  const [isFeatured, setIsFeatured] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const { slug } = useParams();

  // Fetch categories and post details
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.currentToken}` },
        });
        setCategories(res.data.categories);
      } catch (error) {
        showMessage('Error fetching categories.', 'failure');
      }
    };

    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPost/${slug}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${currentUser.currentToken}` },
          }
        );
        const post = res.data.post;

        setFormData({
          title: post.title,
          subtitle: post.subtitle,
          content: post.content,
          isFeatured: post.isFeatured,
        });
        setPreviewImage(post.image);
        setIsFeatured(post.isFeatured);

        const fetchedCategories = post.category || [];
        const formattedCategories =
          typeof fetchedCategories[0] === 'string'
            ? fetchedCategories.map((cat) => ({ name: cat }))
            : fetchedCategories;

        setSelectedCategories(formattedCategories);
      } catch (error) {
        showMessage('Error fetching post details.', 'failure');
      }
    };

    fetchCategories();
    fetchPost();
  }, [slug, currentUser]);

  // Show alert messages
  const showMessage = (message, type) => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage({ message: '', type: '' }), 6000);
  };

  // Handle text input changes
  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.size > 10 * 1024 * 1024) {
      showMessage('File must be under 10MB.', 'failure');
      return;
    }
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!validTypes.includes(selectedFile.type)) {
      showMessage('Only .png, .jpg, or .jpeg files are allowed.', 'failure');
      return;
    }
    setFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
  };

  // Add new category
  const addCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.some((cat) => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      showMessage('Category already exists.', 'failure');
      return;
    }
    const newCategoryObj = { name: newCategory };
    setCategories((prev) => [...prev, newCategoryObj]);
    setSelectedCategories((prev) => [...prev, newCategoryObj]);
    setNewCategory('');
    showMessage('Category added successfully.', 'success');
  };

  // Remove a category
  const removeCategory = (categoryToRemove) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat.name !== categoryToRemove.name));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('content', formData.content);
      data.append('category', JSON.stringify(selectedCategories));
      data.append('isFeatured', isFeatured); // Include isFeatured in the payload
      if (file) data.append('image', file);

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/updatepost/${slug}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
          withCredentials: true,
        }
      );

      showMessage('Post updated successfully.', 'success');
      navigate(`/post/${res.data.post.slug}`);
    } catch (error) {
      showMessage('Failed to update post.', 'failure');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gradient-to-r from-blue-50 via-white to-purple-50 shadow-xl rounded-xl dark:bg-gray-800 dark:text-white">
      <h1 className="text-center text-4xl font-bold mb-10 dark:text-gray-900">Update Post</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          value={formData.title || ''}
          onChange={(e) => handleInput('title', e.target.value)}
          className="dark:bg-gray-700 dark:text-white"
        />
        <Label className="dark:text-gray-900">Title</Label>

        <TextInput
          type="text"
          placeholder="Subtitle"
          required
          value={formData.subtitle || ''}
          onChange={(e) => handleInput('subtitle', e.target.value)}
          className="dark:bg-gray-700 dark:text-white"
        />
        <Label className="dark:text-gray-900">Subtitle</Label>

        {/* Feature Post Toggle */}
        <div className="flex items-center gap-4">
          <Label className="dark:text-gray-900">Feature this post</Label>
          <button
            type="button"
            onClick={() => setIsFeatured((prev) => !prev)}
            className={`p-2 rounded-lg ${
              isFeatured ? 'bg-teal-600 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            {isFeatured ? 'Yes' : 'No'}
          </button>
        </div>

        {/* File Input */}
        <FileInput type="file" accept="image/*" onChange={handleFileChange} />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-auto h-auto object-cover rounded-lg shadow-md mt-4"
          />
        )}

        {/* Categories Selection */}
        <div className="mt-6">
          <Label className="dark:text-gray-900">Categories</Label>
          <div className="space-y-2 mt-2">
            {/* Category Selector */}
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center dark:text-black">
                  <input
                    type="checkbox"
                    id={category.name}
                    checked={selectedCategories.some(
                      (selectedCategory) => selectedCategory.name === category.name
                    )}
                    onChange={() => {
                      if (selectedCategories.some((selectedCategory) => selectedCategory.name === category.name)) {
                        setSelectedCategories((prev) =>
                          prev.filter((selectedCategory) => selectedCategory.name !== category.name)
                        );
                      } else {
                        setSelectedCategories((prev) => [...prev, category]);
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={category.name} className="text-sm">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>

            {/* Manually Add Category */}
            <div className="flex items-center mt-4">
              <TextInput
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                className="dark:bg-gray-700 dark:text-white"
              />
              <Button
                type="button"
                onClick={addCategory}
                className="ml-2 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Quill Editor */}
        <div className="mt-4 dark:text-black">
          <ReactQuill
            value={formData.content || ''}
            theme="snow"
            placeholder="Write something..."
            className="h-72 mb-12 dark:text-black"
            required
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
              ],
            }}
            onChange={(value) => handleInput('content', value)}
          />
        </div>

        {/* Alert Message */}
        {alertMessage.message && <Alert color={alertMessage.type}>{alertMessage.message}</Alert>}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg dark:bg-teal-700 dark:hover:bg-teal-800"
        >
          Update Post
        </Button>
      </form>
    </div>
  );
}

import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useSelector} from 'react-redux';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [handleMessage, setHandleMessage] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const {currentUser} = useSelector(state => state.user);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`, {
          headers: { 
            'Authorization': `Bearer ${currentUser.token}` 
          },
          withCredentials: true
        });
        
        setCategories(res.data.categories); 
      } catch (error) {
        showMessage('Error fetching categories', 'failure');
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Display success or failure messages
  const showMessage = (message, type) => {
    setHandleMessage({ message, type });
    setTimeout(() => setHandleMessage({ message: '', type: '' }), 6000);
  };

  // Handle form input changes
  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle file change (for image uploads)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.size > 10 * 1024 * 1024) {
      showMessage('Failed to upload: File must be an image under 10MB', 'failure');
      return;
    }
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!validTypes.includes(selectedFile.type)) {
      showMessage('Failed to upload: Only .png, .jpg, or .jpeg files are allowed', 'failure');
      return;
    }
    setFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
  };

  // Add new category (custom input)
  const handleAddCategory = () => {
    if (!newCategory) return;
    const newCategoryObj = { id: Date.now(), name: newCategory };
    setCategories((prev) => [newCategoryObj, ...prev]);
    handleInput('category', newCategoryObj.name);  
    setNewCategory('');
    showMessage('Category added successfully', 'success');
  };

  // Handle category selection
  const handleCategorySelect = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find((cat) => cat.id.toString() === selectedCategoryId);
    if (selectedCategory) {
      handleInput('category', selectedCategory.name); // Set category name
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('content', formData.content);
      
      // Send category name instead of ID
      data.append('category', formData.category); 
      if (file) data.append('image', file);
      

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/createpost`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${currentUser.token}`
        },
        withCredentials: true,
      });

      if (!res) { 
        showMessage(`Failed to publish: Title Already Exists oR Server Error`, 'failure');
        return;
      }

      showMessage('Post published successfully', 'success');
      navigate(`/post/${res.data.post.slug}`);
    } catch (error) {
      showMessage('Failed to publish: Title Already Exists oR Server Error', 'failure');
      console.error(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
    <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <TextInput
        type="text"
        placeholder="Title"
        required
        id="title"
        className="flex-1 placeholder:text-gray-400"
        onChange={(e) => handleInput('title', e.target.value)}
      />
      <TextInput
        type="text"
        placeholder="Subtitle"
        required
        id="subtitle"
        className="flex-1 placeholder:text-gray-400"
        onChange={(e) => handleInput('subtitle', e.target.value)}
      />
      <div className="flex flex-col gap-4 sm:flex-row justify-between">
        <Select
          onChange={handleCategorySelect}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-teal-500"
          aria-label="Select category"
        >
          <option value="" disabled selected >
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
        <div className="flex items-center gap-2">
          <TextInput
            type="text"
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button type="button" onClick={handleAddCategory}>
          + Add
          </Button>
        </div>
      </div>
      <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
        <FileInput
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          name="image"
          aria-label="Upload image"
          className="cursor-pointer p-2 rounded-md border border-gray-300 hover:bg-gray-100"
        />
      </div>
      {previewImage && (
        <div className="flex justify-center mb-6">
        <img
          src={previewImage}
          alt={formData.title}
          
        />
        </div>
      )}
      <ReactQuill
        theme="snow"
        placeholder="Write something..."
        className="h-72 mb-12"
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
      <Button
        type="submit"
        gradientDuoTone="purpleToPink"
        className="hover:scale-105 transition-transform"
      >
        Publish
      </Button>
      {handleMessage.message && (
        <Alert
          className="mt-5 flex items-center gap-2"
          color={handleMessage.type === 'success' ? 'success' : 'failure'}
        >
        
          {handleMessage.message}
        </Alert>
      )}
    </form>
  </div>
  );
}

import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPost/${slug}`,
          { withCredentials: true }
        );
        setFormData({
          title: res.data.post.title,
          subtitle: res.data.post.subtitle,
          content: res.data.post.content,
          category: res.data.post.category,
        });
        setPreviewImage(res.data.post.image);
        setCategories(res.data.categories || []);
      } catch (error) {
        showMessage('Error fetching post details.', 'failure');
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [slug]);

  const showMessage = (message, type) => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage({ message: '', type: '' }), 6000);
  };

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.size > 10 * 1024 * 1024) {
      showMessage('Failed to upload: File must be an image under 10MB.', 'failure');
      return;
    }
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!validTypes.includes(selectedFile.type)) {
      showMessage('Failed to upload: Only .png, .jpg, or .jpeg files are allowed.', 'failure');
      return;
    }
    setFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.some((cat) => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      showMessage('Category already exists.', 'failure');
      return;
    }
    const newCategoryObj = { id: Date.now(), name: newCategory };
    setCategories((prev) => [newCategoryObj, ...prev]);
    handleInput('category', newCategoryObj.name);
    setNewCategory('');
    showMessage('Category added successfully.', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('content', formData.content);
      data.append('category', formData.category);
      if (file) data.append('image', file);

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/updatepost/${slug}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );

      if (!res) {
        showMessage('Failed to publish: Title already exists or server error.', 'failure');
        return;
      }

      showMessage('Post published successfully.', 'success');
      navigate(`/post/${res.data.post.slug}`);
    } catch (error) {
      showMessage('Failed to publish: Title already exists or server error.', 'failure');
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gradient-to-r from-blue-50 via-white to-purple-50 shadow-xl rounded-xl  dark:bg-gray-700">
      <h1 className="text-center text-4xl font-bold text-gray-800 mb-10 underline decoration-teal-400  dark:text-gray-500">Update Post</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          value={formData.title || ''}
          onChange={(e) => handleInput('title', e.target.value)}
        />
        <span className="font-bold  dark:text-gray-500">Title</span>
        <TextInput
          type="text"
          placeholder="Subtitle"
          required
          value={formData.subtitle || ''}
          onChange={(e) => handleInput('subtitle', e.target.value)}
        />
        <span className="font-bold dark:text-gray-500">Sub-Title</span>
        <p className="text-sm text-gray-600">
          Current Category: <span className="font-medium text-teal-500">{formData.category}</span>
        </p>
        <div className="flex items-center gap-3">
          <TextInput
            type="text"
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button type="button" onClick={addCategory}>
            + Add
          </Button>
        </div>
        <div className="border-4 border-dashed border-teal-400 p-5 rounded-lg bg-teal-50">
          <FileInput type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        {previewImage && (
          <div className="flex justify-center mb-6">
            <img src={previewImage} alt={formData.title} />
          </div>
        )}
        <ReactQuill
          theme="snow"
          value={formData.content || ''}
          onChange={(value) => handleInput('content', value)}
        />
        <Button type="submit">Update Post</Button>
        {alertMessage.message && (
          <Alert color={alertMessage.type === 'success' ? 'success' : 'failure'}>
            {alertMessage.message}
          </Alert>
        )}
      </form>
    </div>
  );
}

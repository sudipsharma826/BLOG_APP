import { Alert, Button, FileInput, Label, TextInput } from 'flowbite-react';
import { Multiselect } from 'multiselect-react-dropdown';
import { useEffect, useState, useRef } from 'react';
import FullHtmlInput from '../components/FullHtmlInput';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind is imported

export default function UpdatePost() {
  const [showPreview, setShowPreview] = useState(true); // Preview toggle
  const currentUser = useSelector((state) => state.user);
  const quillRef = useRef(null);
  const [useHtmlInput, setUseHtmlInput] = useState(false);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
  });
  const [isFeatured, setIsFeatured] = useState(false);
  const [categories, setCategories] = useState([]);
  const [manualCategory, setManualCategory] = useState("");
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

  // Handler for ReactQuill
  const handleQuillChange = (value) => {
    handleInput('content', value);
  };
  // Handler for FullHtmlInput
  const handleFullHtmlChange = (html) => {
    handleInput('content', html);
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
    if (!manualCategory.trim()) return;
    if (categories.some((cat) => cat.name.toLowerCase() === manualCategory.toLowerCase())) {
      showMessage('Category already exists.', 'failure');
      return;
    }
    const newCategoryObj = { name: manualCategory };
    setCategories((prev) => [...prev, newCategoryObj]);
    setSelectedCategories((prev) => [...prev, newCategoryObj]);
    setManualCategory("");
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
    <div className="p-4 max-w-6xl mx-auto min-h-screen bg-gradient-to-r from-blue-50 via-white to-purple-50 shadow-xl rounded-xl dark:bg-gray-800 dark:text-white">
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
        <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-end">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-teal-600 w-5 h-5"
            />
            <label htmlFor="isFeatured" className="text-gray-700 font-semibold">
              Featured
            </label>
          </div>
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg dark:bg-teal-700 dark:hover:bg-teal-800"
          >
            Update Post
          </Button>
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
          <div className="flex flex-col gap-4 sm:flex-row justify-between dark:text-gray-200 mt-2">
            <Multiselect
              options={categories}
              selectedValues={selectedCategories}
              onSelect={(selectedList) => setSelectedCategories(selectedList)}
              onRemove={(selectedList) => setSelectedCategories(selectedList)}
              displayValue="name"
              placeholder="Select categories"
              style={{ chips: { background: '#14b8a6' } }}
            />
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <TextInput
                type="text"
                placeholder="Add new category"
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCategory();
                  }
                }}
              />
              <Button type="button" onClick={addCategory} className="bg-teal-600 hover:bg-teal-700 text-white">
                + Add
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-2 flex gap-2 flex-wrap">
          <Button
            type="button"
            color={useHtmlInput ? "purple" : "gray"}
            onClick={() => setUseHtmlInput((prev) => !prev)}
          >
            {useHtmlInput ? "Switch to Quill Editor" : "Switch to Full HTML Input"}
          </Button>
          <Button
            type="button"
            color={showPreview ? "gray" : "purple"}
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>
        <div className={useHtmlInput ? (showPreview ? "flex flex-col lg:flex-row gap-6 w-full" : "w-full") : "flex flex-col lg:flex-row gap-6 w-full"}>
          {/* In HTML mode, input is always visible; preview toggles side-by-side/full width */}
          {useHtmlInput ? (
            <div className={showPreview ? "flex-1 min-w-[350px] max-w-full" : "w-full"}>
              <FullHtmlInput
                onChange={handleFullHtmlChange}
                value={formData.content || ''}
              />
            </div>
          ) : (
            !showPreview && (
              <div className="flex-1 min-w-[350px] max-w-full">
                <label className="font-semibold mb-1">Post Content</label>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content || ''}
                  onChange={handleQuillChange}
                  placeholder="Write something..."
                  className="h-80 dark:text-black"
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
                />
              </div>
            )
          )}
          {/* Only show main preview if not in HTML mode and preview is toggled on */}
          {!useHtmlInput && showPreview && (
            <div className="flex-1 min-w-[350px] max-w-full border p-4 bg-gray-50 rounded shadow overflow-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Live Preview</h3>
              </div>
              <div
                style={{ fontSize: '1.1rem', lineHeight: '1.7' }}
                className="min-h-[100px] prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content || '' }}
              />
            </div>
          )}
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

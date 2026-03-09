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
  const [status, setStatus] = useState('published'); // Draft or published status
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double submission
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
        setStatus(post.status || 'published'); // Set current status

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
  const handleSubmit = async (e, saveStatus = 'published') => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('content', formData.content);
      data.append('category', JSON.stringify(selectedCategories));
      data.append('isFeatured', isFeatured);
      data.append('status', saveStatus); // Send draft or published status
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

      const successMessage = saveStatus === "draft" 
        ? "Post saved as draft successfully" 
        : "Post updated and published successfully";
      showMessage(successMessage, 'success');
      
      setTimeout(() => {
        navigate(`/dashboard?tab=posts`);
      }, 1000);
    } catch (error) {
      showMessage('Failed to update post.', 'failure');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Update Post</h1>
          <p className="text-gray-600 dark:text-gray-400">Edit your post details below</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Post Title <span className="text-red-500">*</span>
          </label>
          <TextInput
            type="text"
            placeholder="Enter post title"
            required
            id="title"
            value={formData.title || ''}
            aria-required="true"
            onChange={(e) => handleInput('title', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subtitle <span className="text-red-500">*</span>
          </label>
          <TextInput
            type="text"
            placeholder="Enter subtitle"
            required
            id="subtitle"
            value={formData.subtitle || ''}
            aria-required="true"
            onChange={(e) => handleInput('subtitle', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categories
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <Multiselect
              options={categories}
              selectedValues={selectedCategories}
              onSelect={(selectedList) => setSelectedCategories(selectedList)}
              onRemove={(selectedList) => setSelectedCategories(selectedList)}
              displayValue="name"
              placeholder="Select categories"
              style={{
                chips: { background: "#8b5cf6" },
                searchBox: {
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                },
              }}
            />
            <div className="flex gap-2">
              <TextInput
                type="text"
                placeholder="Add new category"
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCategory();
                  }
                }}
                className="flex-1"
              />
              <Button type="button" onClick={addCategory} color="blue">
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Featured Image
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700">
            <FileInput type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
          </div>
          {previewImage && (
            <div className="mt-4 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
              <img
                src={previewImage}
                alt="Image preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setFile(null);
                }}
                aria-label="Remove image"
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Post Content <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              type="button"
              size="sm"
              color={useHtmlInput ? "blue" : "gray"}
              onClick={() => setUseHtmlInput((prev) => !prev)}
            >
              {useHtmlInput ? "Switch to Rich Text" : "Switch to HTML"}
            </Button>
            <Button
              type="button"
              size="sm"
              color={showPreview ? "blue" : "gray"}
              onClick={() => setShowPreview((prev) => !prev)}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        <div className={useHtmlInput ? (showPreview ? "grid lg:grid-cols-2 gap-6" : "") : "grid lg:grid-cols-2 gap-6"}>
          {/* In HTML mode, input is always visible; preview toggles side-by-side/full width */}
          {useHtmlInput ? (
            <div className={showPreview ? "" : "col-span-2"}>
              <FullHtmlInput
                onChange={handleFullHtmlChange}
                value={formData.content || ''}
              />
            </div>
          ) : (
            !showPreview && (
              <div className="col-span-2">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content ||''}
                  onChange={handleQuillChange}
                  placeholder="Write something amazing..."
                  className="h-96 mb-16"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ color: [] }, { background: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['blockquote', 'code-block'],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                />
              </div>
            )
          )}
          {showPreview && (
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 overflow-auto max-h-96">
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                Preview
              </h3>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content || '<p>Content preview will appear here...</p>' }}
              />
            </div>
          )}
        </div>
        </div>

        {/* Alert Message */}
        {alertMessage.message && <Alert color={alertMessage.type}>{alertMessage.message}</Alert>}

<div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer">
                Mark as Featured Post
              </label>
        </div>

        <div className="flex flex-wrap gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            color="gray"
            onClick={() => navigate("/dashboard?tab=posts")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            color="yellow"
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            color="blue"
            onClick={(e) => handleSubmit(e, "published")}
            disabled={isSubmitting}
          >
            Update & Publish
          </Button>
        </div>

        {alertMessage.message && (
          <Alert
            className="mt-5 animate-fade-in"
            color={alertMessage.type === 'success' ? 'success' : 'failure'}
          >
            {alertMessage.message}
          </Alert>
        )}
      </form>
      </div>
      </div>
    </div>
  );
}

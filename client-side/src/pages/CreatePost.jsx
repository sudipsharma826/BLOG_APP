import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { useEffect, useState, useRef } from "react";
import FullHtmlInput from "../components/FullHtmlInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const quillRef = useRef(null);
  const [useHtmlInput, setUseHtmlInput] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [manualCategory, setManualCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false); // New state for feature post
  const [handleMessage, setHandleMessage] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser.currentToken}`,
            },
          }
        );

        setCategories(res.data.categories);
      } catch (error) {
        showMessage("Error fetching categories", "failure");
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [currentUser.currentToken]);

  const showMessage = (message, type) => {
    setHandleMessage({ message, type });
    setTimeout(() => setHandleMessage({ message: "", type: "" }), 6000);
  };

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handler for ReactQuill
  const handleQuillChange = (value) => {
    handleInput("content", value);
  };
  // Handler for FullHtmlInput
  const handleFullHtmlChange = (html) => {
    handleInput("content", html);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.size > 10 * 1024 * 1024) {
      showMessage("Failed to upload: File must be an image under 10MB", "failure");
      return;
    }
    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validTypes.includes(selectedFile.type)) {
      showMessage("Failed to upload: Only .png, .jpg, or .jpeg files are allowed", "failure");
      return;
    }
    setFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
  };

  const handleAddCategory = () => {
    if (!manualCategory) {
      showMessage("Please enter a category name", "failure");
      return;
    }
    if (categories.find((cat) => cat.name === manualCategory)) {
      showMessage("Category already exists", "failure");
      return;
    }
    const newCategory = { name: manualCategory };
    setCategories((prev) => [...prev, newCategory]);
    setSelectedCategories((prev) => [...prev, newCategory]);
    setManualCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("content", formData.content);
      data.append("category", JSON.stringify(selectedCategories));
      data.append("isFeatured", isFeatured); // Include the new isFeatured field
      if (file) data.append("image", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/createpost`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
        }
      );

      if (!res) {
        showMessage("Failed to publish: Title Already Exists or Server Error", "failure");
        return;
      }

      showMessage("Post published successfully", "success");
      navigate(`/post/${res.data.post.slug}`);
    } catch (error) {
      showMessage("Failed to publish: Title Already Exists or Server Error", "failure");
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
          onChange={(e) => handleInput("title", e.target.value)}
        />
        <TextInput
          type="text"
          placeholder="Subtitle"
          required
          id="subtitle"
          className="flex-1 placeholder:text-gray-400"
          onChange={(e) => handleInput("subtitle", e.target.value)}
        />
        <div className="flex flex-col gap-4 sm:flex-row justify-between dark:text-gray-200">
          <Multiselect
            options={categories}
            selectedValues={selectedCategories}
            onSelect={(selectedList) => setSelectedCategories(selectedList)}
            onRemove={(selectedList) => setSelectedCategories(selectedList)}
            displayValue="name"
            placeholder="Select categories"
          />
          <div className="flex items-center gap-2">
            <TextInput
              type="text"
              placeholder="Add new category"
              value={manualCategory}
              onChange={(e) => setManualCategory(e.target.value)}
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
            <img src={previewImage} alt={formData.title} className="rounded-md max-h-60" />
          </div>
        )}
        <div className="mb-2 flex gap-2">
          <Button
            type="button"
            color={useHtmlInput ? "purple" : "gray"}
            onClick={() => setUseHtmlInput((prev) => !prev)}
          >
            {useHtmlInput ? "Switch to Quill Editor" : "Switch to Full HTML Input"}
          </Button>
        </div>
        {useHtmlInput ? (
          <FullHtmlInput
            onChange={handleFullHtmlChange}
            value={formData.content || ""}
          />
        ) : (
          <div>
            <label className="font-semibold mb-1">Post Content</label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={formData.content || ""}
              onChange={handleQuillChange}
              placeholder="Write something..."
              className="h-72 mb-12 dark:text-white"
              required
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["blockquote", "code-block"],
                  ["link", "image"],
                ],
              }}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <label htmlFor="isFeatured" className="text-gray-700">
            Want to feature the post?
          </label>
        </div>
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
            color={handleMessage.type === "success" ? "success" : "failure"}
          >
            {handleMessage.message}
          </Alert>
        )}
      </form>
    </div>
  );
}

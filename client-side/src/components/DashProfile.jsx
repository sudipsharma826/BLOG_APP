import { Alert, Button, Spinner, TextInput } from 'flowbite-react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function DashProfile() {
  const ImageFileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  // States
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(currentUser.photoURL || null);
  const [imageError, setImageError] = useState(null);
  const [imageUploadReady, setImageUploadReady] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for tracking submission

  // Initialize form data
  const [formData, setFormData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    password: '', // Initially empty for security
  });

  // Message Timer
  const handleErrorTimeout = (setter, message) => {
    setter(message); // Set the message
    setTimeout(() => setter(null), 60000); 
  };

  // Validate file type and size
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes

    if (!validTypes.includes(file.type)) {
      handleErrorTimeout(setImageError, "Invalid file type. Only JPEG and PNG images are allowed.");
      setImageUploadReady(false);
      return false;
    }

    if (file.size > maxSize) {
      handleErrorTimeout(setImageError, 'File size exceeds the maximum limit of 2 MB.');
      setImageUploadReady(false);
      return false;
    }

    setImageError(null);
    setImageUploadReady(true);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setIsSubmitting(true);
setUpdateError(null);

    const file = imageFile;
    let uploadedImageUrl = null;

    // Validate and upload image if file exists
    if (file) {
      if (!validateFile(file)) {
        setIsSubmitting(false); // Reset submitting state in case of validation failure
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        uploadedImageUrl = response.data.secure_url;
        setImageFileUrl(uploadedImageUrl);
        setImageError(null);
      } catch (error) {
        handleErrorTimeout(setImageError, 'Image upload failed. Please try again.');
        setIsSubmitting(false); 
        return;
      }
    }

    // Update Data
    const data = {
      ...formData,
      photoURL: uploadedImageUrl || currentUser.photoURL,
    };

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/update`, data, {
        withCredentials: true,
      });
    } catch (error) {
      handleErrorTimeout(setUpdateError, 'User Profile Failed To Update. Please Try Again.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateFile(file)) {
        setImageFile(file); // Save the valid file to state
        setImageFileUrl(URL.createObjectURL(file)); // Generate a preview for the valid image
      } else {
        
        setImageFile(null);
        setImageFileUrl(currentUser.photoURL || null);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          ref={ImageFileRef}
          className="hidden"
          onChange={handleFileChange}
        />
        {/* Profile Image */}
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => ImageFileRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.photoURL }
            alt={currentUser.username}
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
            onError={(e) => {
              e.target.src = '/images/user.png';
            }}
          />
        </div>
        {/* File Validation Messages */}
        {imageError && <Alert color="failure">{imageError}</Alert>}
        {imageUploadReady && <Alert color="success">File is ready to upload!</Alert>}

        {/* Username Input */}
        <TextInput
          type="text"
          id="username"
          name="username"
          placeholder="Your Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        {/* Email Input */}
        <TextInput
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {/* Password Input */}
        <TextInput
          type="password"
          id="password"
          name="password"
          placeholder="Update Your Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        {/* Submit Button */}
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? (
            <>
            <Spinner className="sm" />
            <span className="pl-3">Loading.... </span>
          </>
          ) : "Update"} 
        </Button>
        
        {updateError && <Alert color="failure">{updateError}</Alert>}
      </form>

      
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

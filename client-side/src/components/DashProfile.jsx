import { Alert, Button, Spinner, TextInput } from 'flowbite-react';
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/authSlice';
import axios from 'axios';

export default function DashProfile() {
  const ImageFileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // State hooks
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(currentUser?.photoURL || null); // Add safety check here
  const [formValues, setFormValues] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '', // Initially empty for security
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null); // For password validation errors

  // Message handler function
  const handleMessage = (successMessage, errorMessage) => {
    if (successMessage) {
      setUpdateSuccess(successMessage);
      setTimeout(() => setUpdateSuccess(null), 6000);
    }
    if (errorMessage) {
      setUpdateError(errorMessage);
      setTimeout(() => setUpdateError(null), 6000);
    }
  };

  // File change handler (image validation)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        handleMessage(null, 'File size exceeds 2MB limit');
        return;
      }
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        handleMessage(null, 'Only JPEG and PNG images are allowed');
        return;
      }
      setImageFile(file);
      handleMessage("File uploaded successfully!", null);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // Input change handler
  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  // Check password format function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    setPasswordError(null); // Reset password error on submit

    // Password validation
    if (formValues.password && !validatePassword(formValues.password)) {
      setPasswordError('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
      setIsSubmitting(false);
      return; // Stop the form submission if password is invalid
    }

    const formData = new FormData();
    formData.append('username', formValues.username.trim());
    formData.append('email', formValues.email.trim());
    if (formValues.password) formData.append('password', formValues.password.trim());
    if (imageFile) formData.append('photoURL', imageFile); // Make sure the file name is 'photoURL'
  console.log(formData);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/update/${currentUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      handleMessage('Profile updated successfully!', null);
      dispatch(signInSuccess(response.data)); // Dispatch success action with updated data
    } catch (error) {
      handleMessage(null, error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Profile image upload */}
        <input
          type="file"
          accept="image/*"
          ref={ImageFileRef}
          className="hidden"
          onChange={handleFileChange}
          id="photoURL"
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => ImageFileRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser?.photoURL} // Check if `currentUser` exists
            alt={currentUser?.username || 'User'}
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
            onError={(e) => {
              e.target.src = '/images/user.png';
            }}
          />
        </div>

        {/* Username input */}
        <TextInput
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={formValues.username}
          onChange={handleInputChange}
          disabled
        />

        {/* Email input */}
        <TextInput
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleInputChange}
          disabled
        />

        {/* Password input */}
        <TextInput
          type="password"
          id="password"
          name="password"
          placeholder="New Password (optional)"
          value={formValues.password}
          onChange={handleInputChange}
        />

        {/* Submit button */}
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Updating...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>

        {/* Success/Error messages */}
        {updateSuccess && <Alert color="success">{updateSuccess}</Alert>}
        {updateError && <Alert color="failure">{updateError}</Alert>}
        {passwordError && <Alert color="failure">{passwordError}</Alert>} {/* Show password error */}
      </form>

      {/* Action links */}
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

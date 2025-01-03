import { Alert, Button, Spinner, TextInput, Modal, ModalBody } from 'flowbite-react';
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signInSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi'; // Import for the modal icon
import { Link } from 'react-router-dom';

export default function DashProfile() {
  const ImageFileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State hooks
  const [imageFile, setImageFile] = useState(null);
  const [formValues, setFormValues] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '', // Initially empty for security
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
        ImageFileRef.current.value = ''; // Reset input
        return;
      }
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        handleMessage(null, 'Only JPEG and PNG images are allowed');
        ImageFileRef.current.value = ''; // Reset input
        return;
      }
      setImageFile(file);
      handleMessage("File uploaded successfully!", null);
    }
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
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

    // Password validation
    if (formValues.password && !validatePassword(formValues.password)) {
      handleMessage(null, "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character");
      setIsSubmitting(false);
      return; // Stop the form submission if password is invalid
    }

    const formData = new FormData();
    formData.append('username', formValues.username.trim());
    formData.append('email', formValues.email.trim());
    if (formValues.password) formData.append('password', formValues.password.trim());
    if (imageFile) formData.append('photoURL', imageFile);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/update/${currentUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
        }
      );
      handleMessage('Profile updated successfully!', null);
      setFormValues({ ...formValues, password: '' }); // Clear password field after successful update
      setImageFile(null); // Reset image if successfully updated
      dispatch(signInSuccess(response.data)); // Dispatch success action with updated data
    } catch (error) {
      handleMessage(null, error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete User function
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/delete/${currentUser._id}`,{},
      {
        withCredentials: true,
    headers: {
      Authorization: `Bearer ${currentUser.currentToken}`,
    },
      }      );
      if (response.status === 200) {
        dispatch(deleteUserSuccess(response.data));
        handleMessage('Account deleted successfully!', null);
      } else {
        dispatch(deleteUserFailure(response.data));
      }
    } catch (error) {
      handleMessage(null, error.response?.data?.message || 'Failed to delete account');
    }
    setShowModal(false); // Close modal after deletion
  };

  // Signout
  const handleSignout = async () => {
    if (!currentUser) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/signout/${currentUser._id}`,
        {},
        {
          withCredentials: true,
    headers: {
      Authorization: `Bearer ${currentUser.currentToken}`,
    },
        }
      );
      if (response.status === 200) {
        dispatch(signoutSuccess());
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Button disable logic based on changes
  const isButtonDisabled = !(
    formValues.username !== currentUser?.username ||
    formValues.password ||
    imageFile
  );

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
          disabled={isSubmitting}  // Disable during submission
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => ImageFileRef.current.click()}
        >
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : currentUser?.photoURL} // Use uploaded file or current user's photo
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
          disabled={isSubmitting || isButtonDisabled}  // Disable button if no changes
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
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}

        {/* Success/Error messages */}
        {updateSuccess && <Alert color="success">{updateSuccess}</Alert>}
        {updateError && <Alert color="failure">{updateError}</Alert>}
      </form>

      {/* Action links */}
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignout} className="cursor-pointer">Sign Out</span>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
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

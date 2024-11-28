import { Alert, Button, Label, Spinner, TextInput, theme } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'; // Importing useDispatch and useSelector
import { signUpStart, signUpSuccess, signUpFailure } from '../redux/user/authSlice'; // Import the actions
import { GoogleOuth } from '../components/GoogleOuth';

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Dispatch action to Redux

  const { loading, error } = useSelector((state) => state.user); // Access loading and error from Redux
  const { theme } = useSelector((state) => state.theme);
  const [formData, setFormData] = useState({});

  // Check the password in the frontend part using regular expression
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password); // Validate password with regex
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return dispatch(signUpFailure('Please fill all the fields'));
    }
    
    if (!validatePassword(formData.password)) {
      return dispatch(
        signUpFailure('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character')
      );
    }
  
    try {
      dispatch(signUpStart()); // Dispatch signUpStart to indicate loading

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/signup`,
        formData
      );
      
      if (response.status === 201) {
        dispatch(signUpSuccess(response.data)); // Dispatch signUpSuccess if the request is successful
        navigate('/signin'); // Redirect to sign-in page
      }
    } catch (error) {
      dispatch(signUpFailure(error.response?.data?.message || error.message)); // Dispatch signUpFailure on error
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex-1">
          <Link to="/" className="font-bold text-4xl dark:text-white">
            <span className="md:px-2 py-1 bg-gradient-to-r from-green-300 via-blue-500 to-red-500 rounded-lg text-white">
              Sudip's
            </span> 
            Blog
          </Link>
          {theme === "dark" ?(

          <p className="text-sm mt-5 font-semibold text-white">
            We're excited to have you here! Please sign up to continue exploring our latest posts, join discussions, and share your thoughts with the community. If you're new, feel free to sign up and start your blogging journey today!
          </p>
          ) : (
            <p className="text-sm mt-5 font-semibold text-gray-400">
            We're excited to have you here! Please sign up to continue exploring our latest posts, join discussions, and share your thoughts with the community. If you're new, feel free to sign up and start your blogging journey today!
          </p>
          )}
        </div>

        {/* Right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Username" />
              <TextInput
                type="text"
                placeholder="Your Username"
                id="username" 
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="abc@sudipsharma.com.np"
                id="email"
                value={formData.email }
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Your Password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button gradientMonochrome="info" pill type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="sm" />
                  <span className="pl-3">Loading.... </span>
                </>
              ) : 'Sign Up'}
            </Button>
            <GoogleOuth />
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Already have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

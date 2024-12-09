import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure, resetError } from '../redux/user/authSlice'; // Import clearError action
import { GoogleOuth } from '../components/GoogleOuth';

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showError, setShowError] = useState(false);

  // Clear the previous error message from redux store
  useEffect(() => {
    dispatch(resetError());  
  }, [dispatch]);

  // Show error for 6 seconds after receiving it from Redux
  useEffect(() => {
    if (errorMessage) {
      setShowError(true);  
      const timeout = setTimeout(() => {
        setShowError(false); 
      }, 6000);

      return () => clearTimeout(timeout);  // Clean up the timeout when the component unmounts
    }
  }, [errorMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/signin`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (data.success === false) {
        dispatch(signInFailure(data.message)); // Dispatch error to Redux
        return;
      }

      dispatch(signInSuccess(data)); // Success: Dispatch to Redux
      navigate('/');

    } catch (error) {
      dispatch(signInFailure(error.message)); // Dispatch error to Redux
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex-1">
          <Link
            to='/'
            className='font-bold dark:text-white text-4xl'
          >
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Sudip's
            </span>
            Blog
          </Link>
          {theme === 'dark' ? (
            <p className="text-sm mt-5 font-semibold text-white">
              We're excited to have you here! Please sign in to continue exploring our latest posts,
              join discussions, and share your thoughts with the community.
            </p>
          ) : (
            <p className="text-sm mt-5 font-semibold text-gray-700">
              We're excited to have you here! Please sign in to continue exploring our latest posts,
              join discussions, and share your thoughts with the community.
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="abc@sudipsharma.com.np"
                id="email"
                
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                
                onChange={handleChange}
              />
            </div>
            <Button gradientMonochrome="info" pill type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="sm" />
                  <span className="pl-3">Loading.... </span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <GoogleOuth />
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Haven't an Account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>

          {/* Display error message from Redux state for 6 seconds */}
          {showError && errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage} {/* Display error message from Redux */}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

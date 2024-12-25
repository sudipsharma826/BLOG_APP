import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { GoogleOuth } from '../components/GoogleOuth';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useSelector((state) => state.theme);
  const currentUser = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  // Check the password in the frontend part using regular expression
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill all the fields');
      return;
    }
    
    if (!validatePassword(formData.password)) {
      setError('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }
  
    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/signup`,
        formData, // Request body
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
          withCredentials: true, // Include credentials in the request
        }
      );
      
      
      if (response.status === 201) {
        setLoading(false);
        navigate('/signin');
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || error.message);
    }
  };

  // Automatically clear the error message after 6 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 6000); // Clear error after 6 seconds

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [error]);

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
          {theme === "dark" ? (
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
                onChange={handleChange}
              />
            </div>
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
                placeholder="Your Password"
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

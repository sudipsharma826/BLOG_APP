import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Pen } from 'lucide-react';
import axios from 'axios';
import { signInStart, signInSuccess, signInFailure, resetError } from '../redux/user/authSlice';
import { GoogleOuth } from '../components/GoogleOuth';
import AdSense from '../components/blog/AdSense';

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
 const { loading, error: errorMessage } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
      const timeout = setTimeout(() => {
        setShowError(false);
      }, 6000);
      return () => clearTimeout(timeout);
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
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

        {/* AdSense Ad - Top of SignIn page */}
        <div className="my-8 flex justify-center">
          <AdSense
            adClient={import.meta.env.VITE_ADSENSE_CLIENT}
            adSlot={import.meta.env.VITE_ADSENSE_SLOT}
            adFormat="auto"
            style={{ display: 'block', minHeight: 90, maxWidth: 728, margin: '0 auto' }}
            fullWidthResponsive={true}
          />
        </div>
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Branding */}
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <Pen className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">TechKnow</h1>
                  </div>
                  <p className="text-xl font-semibold mb-4">Welcome Back!</p>
                  <p className="text-gray-100 mb-8">
                    "Technology is best when it brings people together. Join our community of tech enthusiasts and share your knowledge with the world."
                  </p>
                  {/* AdSense Ad below welcome text */}
                  <div className="my-8 flex justify-center">
                    <AdSense
                      adClient={import.meta.env.VITE_ADSENSE_CLIENT}
                      adSlot={import.meta.env.VITE_ADSENSE_SLOT}
                      adFormat="auto"
                      style={{ display: 'block', minHeight: 90, maxWidth: 300, margin: '0 auto' }}
                      fullWidthResponsive={true}
                    />
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm text-gray-200">
                    New to TechKnows?{' '}
                    <Link to="/signup" className="font-medium hover:underline">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Sign in to your account
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label className="text-gray-700 dark:text-gray-200" value="Email address" />
                  <TextInput
                    type="email"
                    id="email"
                    placeholder="sudeepsharma826@gmail.com"
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-200" value="Password" />
                  <TextInput
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  gradientDuoTone="purpleToBlue"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="ml-2">Signing in...</span>
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <GoogleOuth />
              </form>

              <div className="mt-6 text-center md:hidden">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  New to TechKnows?{' '}
                  <Link to="/signup" className="text-blue-600 hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>

              {showError && errorMessage && (
                <Alert className="mt-4" color="failure">
                  {errorMessage}
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
  {/* Ad spaces removed per user request */}
    </div>
  );
};

export default SignInPage;
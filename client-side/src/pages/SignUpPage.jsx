import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Pen } from 'lucide-react';
import axios from 'axios';
import { GoogleOuth } from '../components/GoogleOuth';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useSelector((state) => state.theme);
  const currentUser = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

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
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
          withCredentials: true,
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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

        {/* AdSense Ad - Top of SignUp page */}
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
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <Pen className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">TechKnow</h1>
                  </div>
                  <p className="text-xl font-semibold mb-4">Start Your Journey!</p>
                  <p className="text-gray-100 mb-8">
                    "Every expert was once a beginner. Join our community of tech enthusiasts and start sharing your unique perspective with the world."
                  </p>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm text-gray-200">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-medium hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Create your account
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label className="text-gray-700 dark:text-gray-200" value="Username" />
                  <TextInput
                    type="text"
                    id="username"
                    placeholder="Sudip Sharma"
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-200" value="Email address" />
                  <TextInput
                    type="email"
                    id="email"
                    placeholder="info@sudipsharma.com.np"
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
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Must contain 8-16 characters, uppercase, lowercase, number, and special character
                  </p>
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
                      <span className="ml-2">Creating account...</span>
                    </>
                  ) : (
                    'Sign up'
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
                  Already have an account?{' '}
                  <Link to="/signin" className="text-blue-600 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>

              {error && (
                <Alert className="mt-4" color="failure">
                  {error}
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

export default SignUpPage;
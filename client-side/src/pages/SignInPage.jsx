import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/authSlice';
import { GoogleOuth } from '../components/GoogleOuth';

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ email: '', password: '' });

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
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/signin`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data)); 
      navigate('/');
      
    } catch (error) {
      dispatch(signInFailure(error?.response?.data?.message || error.message));
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
          <p className="text-sm mt-5 font-semibold text-gray-800">
            We're excited to have you here! Please sign in to continue exploring our latest posts,
            join discussions, and share your thoughts with the community.
          </p>
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
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="********"
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
              ) : (
                'Sign In'
              )}
            </Button>
           < GoogleOuth />
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Haven't an Account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
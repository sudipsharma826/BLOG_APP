import React, { useState, useEffect, useCallback ,} from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Menu, Moon, Sun } from 'lucide-react';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/authSlice';
import axios from 'axios';
import { Avatar, Button, Dropdown } from 'flowbite-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //Search Term
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [path]);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsNavbarVisible(
          prevScrollPos > currentScrollPos - 50 || currentScrollPos < 10
        );
        setPrevScrollPos(currentScrollPos);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [prevScrollPos]);

  const handleSignout = async () => {
    if (!currentUser?.currentToken) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/signout/${currentUser._id}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.currentToken}` },
        }
      );
      if (response.status === 200) {
        dispatch(signoutSuccess());
        setIsMobileMenuOpen(false); // Close menu after signing out
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Handler for mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  //handle form submit for search
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 bg-white/70 dark:bg-gray-900/70 rounded-b-2xl shadow-xl border border-gray-200 dark:border-gray-800">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/images/logo.png" alt="TechKnow Logo" className="h-12 w-12 rounded-xl shadow-lg border-2 border-white dark:border-gray-800 group-hover:scale-105 transition-transform" />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text tracking-tight drop-shadow-lg">
                TechKnow
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Search Bar (Desktop) */}
              <form onSubmit={handleSubmit}>
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-9 px-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-2 h-5 w-5 text-gray-400" />
              </div>
              </form>

              {/* Navigation Links */}
              <Link to="/" className={`${path === '/' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}>
                Home
              </Link>
              <Link to="/about" className={`${path === '/about' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}>
                About
              </Link>
              <Link to="/contact" className={`${path === '/contact' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}>
                Contacts
              </Link>
              <Link to="/posts" className={`${path === '/posts' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}>
                Posts
              </Link>

              <Link to="/categories" className={`${path === '/categories' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}>
Categories              </Link>


              {/* Theme Toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {/* Desktop User Section */}
              {currentUser ? (
                <Dropdown
                  inline
                  label={
                    <Avatar
                      img={currentUser.photoURL || '/images/user.png'}
                      alt="User avatar"
                      rounded
                    />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-lg font-semibold">🙏 {currentUser.username}</span>
                    <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                  </Dropdown.Header>
                  {currentUser.isAdmin && (
                    <Link to="/dashboard?tab=dash">
                      <Dropdown.Item>Dashboard</Dropdown.Item>
                    </Link>
                  )}
                  <Link to="/dashboard?tab=profile">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </Link>
                  <Link to="/dashboard?tab=savedposts">
                    <Dropdown.Item>Saved Posts</Dropdown.Item>
                  </Link>
                  <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
                </Dropdown>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/signin">
                    <Button gradientMonochrome="info" outline size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button gradientMonochrome="purple" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center space-x-4">
              <button
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {/* Mobile User Section */}
              {currentUser ? (
                <Dropdown
                  inline
                  label={
                    <Avatar
                      img={currentUser.photoURL || '/images/user.png'}
                      alt="User avatar"
                      rounded
                      size="sm"
                    />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm">🙏 {currentUser.username}</span>
                    <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                  </Dropdown.Header>
                  {currentUser.isAdmin && (
                    <Link to="/dashboard">
                      <Dropdown.Item>Dashboard</Dropdown.Item>
                    </Link>
                  )}
                  <Link to="/dashboard?tab=profile">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </Link>
                  <Link to="/dashboard?tab=savedposts">
                    <Dropdown.Item>Saved Posts</Dropdown.Item>
                  </Link>
                  <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
                </Dropdown>
              ) : (
                <Link to="/signin">
                  <Button gradientMonochrome="info" outline size="sm">
                    Sign In
                  </Button>
                </Link>
              )}

              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchVisible && (
            <div className="md:hidden px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-9 px-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute right-4 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className={`${path === '/' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`${path === '/about' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link to="/posts" className={`${path === '/posts' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setIsMobileMenuOpen(false)}>
                Posts
              </Link>

              <Link to="/categories" className={`${path === '/categories' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setIsMobileMenuOpen(false)}>
Categories              </Link>

                {!currentUser && (
                  <Link
                    to="/signup"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button gradientMonochrome="purple" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Spacer to prevent content from being hidden under navbar */}
      <div className="h-10 mb-2"></div>
    </>
  );
}

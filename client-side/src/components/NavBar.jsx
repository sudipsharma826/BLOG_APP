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
        style={{
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          background: theme === 'dark' ? 'rgba(30,34,45,0.95)' : 'rgba(255,255,255,0.7)',
          borderBottom: theme === 'dark' ? '1.5px solid rgba(60,60,80,0.5)' : '1.5px solid rgba(200,200,200,0.25)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          margin: 0,
          padding: 0,
        }}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 bg-transparent rounded-b-2xl m-0 p-0">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group h-16 ml-1 md:ml-6 min-w-0" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/images/logo.png" alt="TechKnows Logo" className="h-12 w-12 sm:h-14 sm:w-14 my-auto rounded-xl shadow-lg border-2 border-white dark:border-gray-800 group-hover:scale-105 transition-transform flex-shrink-0" />
              {/* Mobile logo text */}
              <span className="inline md:hidden text-xs font-semibold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text tracking-tight flex items-center h-12 max-w-[70px] whitespace-nowrap overflow-hidden text-ellipsis ml-1">TechKnows</span>
              {/* Desktop logo text - improved for single line and better fit */}
              <span className="hidden md:inline text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text tracking-tight drop-shadow-lg flex items-center h-12 max-w-[220px] sm:max-w-[260px] md:max-w-[320px] whitespace-nowrap overflow-hidden leading-tight" style={{fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)'}}>TechKnows</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 h-20 pr-2 md:pr-6">
              {/* Search Bar (Desktop) */}
              <form onSubmit={handleSubmit} className="flex items-center h-20 ml-4 md:ml-8">
                <div className="relative w-96 flex items-center h-12">
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`w-full h-12 px-4 pr-12 rounded-lg border focus:ring-2 focus:ring-purple-500 text-base ${theme === 'dark' ? 'bg-[#232736] border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-4 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}" />
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
                      <div className="flex items-center">
                        <Avatar
                          img={currentUser.photoURL || '/images/user.png'}
                          alt="User avatar"
                          rounded
                          className="mr-2 md:mr-4"
                        />
                      </div>
                    }
                    className="mr-2 md:mr-6"
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
            <div className="flex md:hidden items-center space-x-2 sm:space-x-4 pr-2">
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
                    <div className="flex items-center">
                      <Avatar
                        img={currentUser.photoURL || '/images/user.png'}
                        alt="User avatar"
                        rounded
                        className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-white dark:border-gray-800 shadow"
                      />
                    </div>
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
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-9 px-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="absolute right-4 top-2">
                    <Search className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </form>
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
      <div className="h-10"></div>
    </>
  );
}

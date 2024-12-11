import { Button, Dropdown, Navbar, TextInput ,Avatar} from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/authSlice';
import axios from 'axios';

export default function Header() {
    const path = useLocation().pathname;
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    
    // Signout
    const handleSignout = async () => {
      if (!currentUser) return; 
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/signout/${currentUser._id}`, 
          {},
          {
            withCredentials: true,
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
    
  
  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
       
        <img src="/images/logo.png" alt="logo" className="w-15 h-10 pill inline " />
      </Link>
      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button 
            className='w-12 h-10' 
            color='gray' 
            pill
            onClick={() => dispatch(toggleTheme())}
        >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </Button>
        {/* Dynamic Navbar */}
        {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                          <Avatar alt={currentUser.username} img={currentUser.photoURL } rounded 
                          onError={(e) => {
                            e.target.src='/images/user.png'
                          }}/>
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>{currentUser.displayName}</span>
                            <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                        </Dropdown.Header>
                        <Dropdown.Divider />
                        <Link to='/dashboard'>
                            <Dropdown.Item>Dashboard</Dropdown.Item>
                        </Link>
                        <Link to='/profile'>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        
                            <Dropdown.Item onClick={handleSignout}>SignOut</Dropdown.Item>
                        
                    </Dropdown>
                ) : (
                    <Link to='/signin'>
                        <Button gradientMonochrome="info" outline>
                            Sign In
                        </Button>
                    </Link>
                )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={'div'}>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
        {/* <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='md:hidden px-2 py-1 bg-gradient-to-r from-green-300 via-blue-500 to-red-500 rounded-lg text-white'>
          #sudipsharmablogs
        </span>
       
        
      </Link> */}
      </Navbar.Collapse>
    </Navbar>
  );
}
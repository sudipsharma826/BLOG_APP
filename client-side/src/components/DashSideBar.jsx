import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiBookmark, HiAtSymbol, HiAnnotation,HiUserCircle, HiChartPie } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';  // Add useNavigate for redirection
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { signoutSuccess } from '../redux/user/authSlice';


export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();  // Use navigate for redirection after signout
  const [tab, setTab] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
        // Dispatch signout action to clear user data in Redux store
        dispatch(signoutSuccess());

        // Redirect to the home page or login page after signout
        navigate('/signin');  // Adjust the path as needed (e.g., '/login' or '/')
        
      } else {
        console.error('Signout failed:', response.data);
      }
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
        {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === 'dash'}
              icon={HiChartPie}
              labelColor='dark'
              as='div'
            >
              <Link to={`/dashboard?tab=dash`}>DashBoard</Link>
            </Sidebar.Item>
          )}
          <Sidebar.Item
            active={tab === 'profile'}
            icon={HiUser}
            label={currentUser.isAdmin ? 'Admin' : 'User'}
            labelColor='dark'
            as='div'
          >
            <Link to={`/dashboard?tab=profile`}>Profile</Link>
          </Sidebar.Item>
          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === 'posts'}
              icon={HiDocumentText}
              labelColor='dark'
              as='div'
            >
              <Link to={`/dashboard?tab=posts`}>Posts</Link>
            </Sidebar.Item>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=categories'>
              <Sidebar.Item
                active={tab === 'categories'}
                icon={HiAtSymbol}
                as='div'
              >
                Categories
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && (
            <Link to='/dashboard?tab=savedposts'>
              <Sidebar.Item
                active={tab === 'savedposts'}
                icon={HiBookmark}
                as='div'
              >
                Saved Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=getsubscribers'>
              <Sidebar.Item
                active={tab === 'getsubscribers'}
                icon={HiUserCircle}
                as='div'
              >
                Subscriber List
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item
                active={tab === 'comments'}
                icon={HiAnnotation}
                as='div'
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

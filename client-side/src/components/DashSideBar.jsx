import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiDocumentText } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { signoutSuccess } from '../redux/user/authSlice';

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  // Deleted Model Local State
  const [showModal, setShowModal] = useState(false); 
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
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
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
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

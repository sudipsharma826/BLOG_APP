import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isMaintained, setIsMaintained] = useState(false); // Maintenance state
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false); // For maintenance confirmation modal
  const [statusofMaintenance, setStatusofMaintenance] = useState(false); // For maintenance status

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getusers`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.currentToken}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setUsers(response.data.users);
          setShowMore(response.data.users.length === 9);
        }
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser?.isAdmin]);

  // Get Maintenance Status (GET)
  useEffect(() => {
    const getMaintenanceStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/maintenanceStatus`, {
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          setStatusofMaintenance(response.data.isMaintenance);
          setIsMaintained(response.data.isMaintenance); // Sync maintenance status with the state
        }
      } catch (error) {
        console.error('Error fetching maintenance status:', error.message);
      }
    };
    getMaintenanceStatus();
  }, [currentUser?.currentToken]);

  // Enable maintenance
  const handleEnableMaintenance = async () => {
    setLoadingMaintenance(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/enableMaintenance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsMaintained(true); // Set maintenance state to enabled
        setStatusofMaintenance(true); // Sync status
        setShowMaintenanceModal(false); // Close modal after enabling maintenance
      }
    } catch (error) {
      console.error('Error enabling maintenance:', error.message);
    } finally {
      setLoadingMaintenance(false);
    }
  };

  // Disable maintenance
  const handleDisableMaintenance = async () => {
    setLoadingMaintenance(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/disableMaintenance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsMaintained(false); // Set maintenance state to disabled
        setStatusofMaintenance(false); // Sync status
        setShowMaintenanceModal(false); // Close modal after disabling maintenance
      }
    } catch (error) {
      console.error('Error disabling maintenance:', error.message);
    } finally {
      setLoadingMaintenance(false);
    }
  };

  // Handle device modal open
  const handleDeviceClick = (device) => {
    setSelectedDevice(device); // Set selected device
    setShowDeviceModal(true); // Open the device modal
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/delete/${userIdToDelete}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
        }
      );
      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== userIdToDelete));
        setShowModal(false); // Close the modal after deletion
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show more users
  const handleShowMore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getusers?page=2`, // Adjust pagination as needed
        {
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUsers((prevUsers) => [...prevUsers, ...response.data.users]);
        setShowMore(response.data.users.length === 9); // Adjust the showMore condition
      }
    } catch (error) {
      console.error('Error fetching more users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Last Login</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Devices</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <div className="relative">
                      <img
                        src={user.photoURL}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full cursor-pointer transform transition-transform hover:scale-105"
                        onClick={() => {
                          setSelectedImage(user.photoURL); // Set the selected image
                          setShowImageModal(true); // Open the image modal
                        }}
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${user.isSignIn ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{new Date(user.lastLogin).toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                  </Table.Cell>
                  <Table.Cell>
                    {user.devices && user.devices.length > 0 ? (
                      user.devices.map((device) => (
                        <div
                          key={device._id}
                          className="cursor-pointer text-blue-500 hover:underline"
                          onClick={() => handleDeviceClick(device)}
                        >
                          {device.os}
                        </div>
                      ))
                    ) : (
                      <span>No devices found</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {!user.isAdmin && (
                      <span
                        onClick={() => {
                          setShowModal(true); // Open modal
                          setUserIdToDelete(user._id); // Set the user to delete
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Toggle Maintenance */}
          <Button
            onClick={() => setShowMaintenanceModal(true)} // Open modal for maintenance action
            color={isMaintained ? 'success' : 'failure'} // Toggle color
            className="mt-4 font-bold"
          >
            {isMaintained ? 'Disable Maintenance and Unlock Users' : 'Enable Maintenance and Lock Users'}
          </Button>

          {/* Maintenance Confirmation Modal */}
          <Modal show={showMaintenanceModal} onClose={() => setShowMaintenanceModal(false)}>
            <Modal.Header>
              {isMaintained ? 'Disable Maintenance' : 'Enable Maintenance'}
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to {isMaintained ? 'disable maintenance mode?' : 'enable maintenance mode?'}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={isMaintained ? handleDisableMaintenance : handleEnableMaintenance}
                color="success"
                disabled={loadingMaintenance}
              >
                Confirm
              </Button>
              <Button color="failure" onClick={() => setShowMaintenanceModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

        </>
      ) : (
        <div className="text-center mt-10">
          <HiOutlineExclamationCircle size={50} className="text-gray-400 mx-auto" />
          <h3 className="text-2xl font-medium">No users found</h3>
        </div>
      )}
    </div>
  );
}

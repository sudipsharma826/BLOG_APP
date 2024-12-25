import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = localStorage.getItem('accessToken');

  // If currentUser exists or token is found in localStorage, allow access to the route
  if (currentUser || token) {
    return <Outlet />;
  }

  // If no currentUser or token is found, redirect to sign-in page
  return <Navigate to="/signin" />;
};

export default PrivateRoutes;

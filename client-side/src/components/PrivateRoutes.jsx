import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const { currentUser } = useSelector((state) => state.user);

  // If currentUser exists and has a valid token, allow access to the route
  if (currentUser && currentUser.currentToken) {
    return <Outlet />;
  }

  // If no currentUser or token is found, redirect to signin page
  return <Navigate to="/signin" />;
};

export default PrivateRoutes;

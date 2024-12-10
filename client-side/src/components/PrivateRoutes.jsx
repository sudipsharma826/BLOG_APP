import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoutes = () => {
  const { currentUser } = useSelector((state) => state.user);
  const accessToken = Cookies.get('accessToken');

  return currentUser && accessToken? <Outlet /> : <Navigate to='/signin' />;
}

export default PrivateRoutes;
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { deleteUserSuccess } from '../redux/user/authSlice';
import { useEffect } from 'react';

const PrivateRoutes = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser  ? <Outlet /> : <Navigate to='/signin' />;
}

export default PrivateRoutes;

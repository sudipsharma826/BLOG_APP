import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
export default function HomeRoutes() {
  const { currentUser } = useSelector((state) => state.user);
  return ! currentUser  ? (
    <Outlet />
  ) : (
    <Navigate to='/' />
  );
}
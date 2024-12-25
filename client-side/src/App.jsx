import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar'; // Header component
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Footer from './components/FooterPage';
import PrivateRoute from './components/PrivateRoutes';
import DashBoard from './pages/DashBoard';
import NotFound from './pages/NotFound';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import HomeRoutes from './components/HomeRoutes';
import UpdatePost from './pages/UpdatePost';
import DashPosts from './components/DashPosts';
import DashUsers from './components/DashUsers';
import DashCategories from './components/DashCategory';
import SinglePostPage from './pages/SingleBlogPost';
import Maintenance from './components/Maintenance';
import axios from 'axios';
import './index.css';
import { useSelector } from 'react-redux';

const App = () => {
  const [isMaintenanceGoingOn, setIsMaintenanceGoingOn] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/maintenanceStatus`,
          { withCredentials: true },
        );
        if (response.status === 200) {
          setIsMaintenanceGoingOn(response.data.isMaintenance);
        }
      } catch (error) {
        console.error('Error in checking maintenance mode:', error);
      }
    };

    checkMaintenanceMode();
  }, []);

  if (isMaintenanceGoingOn && currentUser && !currentUser.isAdmin) {
    return <Maintenance />;
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Home />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/projects" />
        <Route path="/post/:slug" element={<SinglePostPage />} />
        <Route element={<HomeRoutes />}>
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/updatepost/:slug" element={<UpdatePost />} />
          <Route path="/dashboard/post?posts" element={<DashPosts />} />
          <Route path="/dashboard/post?users" element={<DashUsers />} />
          <Route path="/dashboard/post?categories" element={<DashCategories />} />
        </Route>
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Footer from "./components/FooterPage";
import PrivateRoute from "./components/PrivateRoutes";
import DashBoard from "./pages/DashBoard";
import NotFound from "./pages/NotFound";
import CreatePost from "./pages/CreatePost";
import HomeRoutes from "./components/HomeRoutes";
import UpdatePost from "./pages/UpdatePost";
import DashPosts from "./components/DashPosts";
import DashUsers from "./components/DashUsers";
import DashCategories from "./components/DashCategory";
import SinglePostPage from "./pages/SingleBlogPost";
import AppStatus from "./components/AppStatus";
import axios from "axios";
import "./index.css";
import { useSelector } from "react-redux";
import SavedPosts from "./pages/SavedPost";
import DashProfile from "./components/DashProfile";
import SubscribedList from "./components/SubscribedList";
import PostsPage from "./pages/PostsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CategoriesPage from "./pages/Categoriespage";
import SingleCategoryPage from "./pages/SinglecatrgoryPage";
import Terms from "./pages/TermsPage";
import Privacy from "./pages/PrivacyPage";
import ScrollToTop from "./components/ScrollToTop";
import DashComments from "./components/DashComment";
import DashboardComp from "./components/DashboardCom";
import SearchPage from "./pages/SearchPage";

const App = () => {
  const [isMaintenanceGoingOn, setIsMaintenanceGoingOn] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/maintenanceStatus`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setIsMaintenanceGoingOn(response.data.isMaintenance);
        }
      } catch (error) {
        console.error("Error checking maintenance mode:", error);
      }
    };

    checkMaintenanceMode();

    if (isMaintenanceGoingOn && currentUser && !currentUser.isAdmin) {
      navigate("/maintenance");
    }
  }, [isMaintenanceGoingOn, currentUser, navigate]);

  if (isMaintenanceGoingOn && currentUser && !currentUser.isAdmin) {
    return  <AppStatus type="maintenance" />;
  }

  return (
    <>
    
    <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/projects" element={<Home />} />
        <Route path="/post/:slug" element={<SinglePostPage />} />
        <Route path="/category/:category" element={<SingleCategoryPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route element={<HomeRoutes />}>
          <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/dashboard?tab=profile" element={<DashProfile />} />
          <Route path="/dashboard?tab=savedposts" element={<SavedPosts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/updatepost/:slug" element={<UpdatePost />} />
          <Route path="/dashboard?tab=posts" element={<DashPosts />} />
          <Route path="/dashboard?tab=users" element={<DashUsers />} />
          <Route path="/dashboard?tab=categories" element={<DashCategories />} />
          <Route path="/dashboard?tab=getsubscribers" element={<SubscribedList />} />
          <Route path ="/dashboard?tab=comments" element={<DashComments />} />
          <Route path="/dashboard?tab=dash" element={<DashboardComp />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/maintenance" element={<AppStatus type="maintenance" />} />
      </Routes>
      <Footer />
      
    </>
  );
};

export default App;

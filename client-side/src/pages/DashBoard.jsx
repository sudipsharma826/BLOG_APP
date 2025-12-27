import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import DashSidebar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashCategories from "../components/DashCategory";
import SavedPosts from "./SavedPost";
import { useSelector } from "react-redux";
import SubscribedList from "../components/SubscribedList";
import DashComments from "../components/DashComment";
import DashboardComp from "../components/DashboardCom";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Redirect if the user is not an admin and trying to access restricted tabs
  if (!currentUser.isAdmin && ["posts", "users", "categories","getsubscribers"].includes(tab)) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-20">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      <div className="w-full">
        {/* Render components based on the "tab" */}
        {tab === "profile" && <DashProfile />}
        {tab === "posts" && <DashPosts />}
        {tab === "users" && <DashUsers />}
        {tab === "categories" && <DashCategories />}
        {tab === "savedposts" && <SavedPosts />}
        {tab==="getsubscribers" && <SubscribedList />}
        {tab === "comments" && <DashComments />}
        {tab ==="dash" && <DashboardComp />}
      </div>
    </div>
  );
}

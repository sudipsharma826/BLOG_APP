import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PostHeader } from '../components/blog/PostHeader';
import { AuthorInfo } from '../components/blog/AuthorInfo';
import TableOfContents from '../components/blog/TableOfContent';
import { PostContent } from '../components/blog/PostContent';
import { SEO } from '../components/blog/SEO';
import  AppStatus  from '../components/AppStatus';
import { useSelector } from 'react-redux';
import { Heart, ThumbsUp, Share2, Bookmark, Link, HelpingHand } from 'lucide-react';
import { Bell, Clock, Hash, Sidebar } from 'react-feather';
import NotFound from './NotFound';
import RelatedPosts from '../components/RelatedPosts';
import CommentSection from '../components/CommetnSection';
// import AdSense from '../components/blog/AdSense';
import LatestPosts from '../components/LatestPost';
import SidebarCategories from '../components/SideBarCategories';

function SinglePostPage() {
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const { slug } = useParams();
  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const [authorData, setAuthorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readTime, setReadTime] = useState(0);
  const [error, setError] = useState("");

  const [isLiked, setIsLiked] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [lovesCount, setLovesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [bellColor, setBellColor] = useState('bg-white');
  const [showFloatingIcons, setShowFloatingIcons] = useState(true);

  //Theme
  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPost/${slug}`,
          { withCredentials: true }
        );
        if (postRes.data && postRes.data.post) {
          setPostData(postRes.data.post);
          // Fetch author data if needed
          const authorRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getuser/${postRes.data.post.authorEmail}`,
            { withCredentials: true }
          );
          setAuthorData(authorRes.data);
          // Calculate read time
          const estimatedReadTime = calculateReadTime(postRes.data.post.content);
          setReadTime(estimatedReadTime);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Unable to load content. Please check your connection or try again later.");
      }
    };
    fetchData();
  }, [slug]);

  const handleAction = async (actionType) => {
    const actionData = {
      postId: postData._id,
      userId: currentUser._id,
    };

    let apiUrl = '';

    switch (actionType) {
      case 'like':
        apiUrl = isLiked ? 'unLikePost' : 'likePost';
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        break;
      case 'love':
        apiUrl = isLoved ? 'unLovePost' : 'lovePost';
        setIsLoved(!isLoved);
        setLovesCount(isLoved ? lovesCount - 1 : lovesCount + 1);
        break;
      case 'save':
        apiUrl = isSaved ? 'unSavePost' : 'savePost';
        setIsSaved(!isSaved);
        setSavesCount(isSaved ? savesCount - 1 : savesCount + 1);
        break;
      default:
        return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/${apiUrl}`, actionData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    } catch (error) {
      console.error('Error performing action:', error);
      if (actionType === 'like') {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      } else if (actionType === 'love') {
        setIsLoved(!isLoved);
        setLovesCount(isLoved ? lovesCount - 1 : lovesCount + 1);
      } else if (actionType === 'save') {
        setIsSaved(!isSaved);
        setSavesCount(isSaved ? savesCount - 1 : savesCount + 1);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      const footerPosition = footer ? footer.getBoundingClientRect().top : 0;
      const screenHeight = window.innerHeight;
      setShowFloatingIcons(footerPosition > screenHeight);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AppStatus type="loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-lg font-semibold shadow">
          {error}
        </div>
      </div>
    );
  }

  if (!postData) {
    return <NotFound />;
  }


  return (
    <>
      <SEO
        title={postData?.title}
        description={postData?.description}
        image={postData?.image}
      />
      <div className="min-h-screen page-section py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Main Content */}
          <article className="col-span-1 md:col-span-9 lg:col-span-8 card rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <PostHeader
                category={postData?.category}
                title={postData?.title}
                subtitle={postData?.subtitle}
                readTime={readTime}
                postViews={postData?.postViews}
                postLikes={likesCount}
                updatedAt={new Date(postData?.updatedAt).toLocaleDateString()}
              />
              {authorData && (
                <AuthorInfo
                  name={authorData?.username}
                  email={authorData?.email}
                  image={authorData?.photoURL}
                />
              )}
            </div>
            {/* No AdSense in Single Blog Post for better impression */}
            <div className="w-full h-[200px] sm:h-[300px] lg:h-[400px] bg-[var(--color-surface)]">
              <img
                src={postData?.image}
                alt="Post Visual"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <TableOfContents content={postData.content} />
              <PostContent content={postData?.content} />
                {/* No AdSense after content in Single Blog Post */}
              <CommentSection postId={postData._id} />
            </div>
          </article>
          {/* Right Sidebar */}
          <div className="col-span-1 md:col-span-3 lg:col-span-4 space-y-4 lg:space-y-8">
            {/* No AdSense in sidebar for Single Blog Post */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Latest Posts */}
              <div className="card rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Latest Posts
                </h3>
                <LatestPosts />
              </div>
              {/* Categories */}
              <div className="card rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  Categories
                </h3>
                <SidebarCategories />
              </div>
            </div>
          </div>
        </div>
        {/* Bottom content */}
        <div className="mt-4 sm:mt-6 lg:mt-8">
          {postData && <RelatedPosts categories={postData.category} currentPostId={postData._id} />}
            {/* No AdSense after related posts in Single Blog Post */}
        </div>
        {/* Floating action buttons - Responsive positioning */}
        {showFloatingIcons && (
          <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 card p-3 sm:p-4 rounded-full shadow-lg flex items-center space-x-3 sm:space-x-4 z-50">
            <button
              onClick={() => handleAction('like')}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'bg-blue-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleAction('love')}
              className={`p-2 rounded-full transition-colors ${
                isLoved ? 'bg-red-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleAction('save')}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'bg-green-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default SinglePostPage;

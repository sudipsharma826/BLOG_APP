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
import AdSense from '../components/blog/AdSense';
import CommentSection from '../components/CommetnSection';
import AdSpaceContainer from '../components/blog/AdSpaceContainer';
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
          const post = postRes.data.post;
          setPostData(post);

          const authorRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getuser/${post.authorEmail}`,
            { withCredentials: true }
          );
          setAuthorData(authorRes.data);

          const estimatedReadTime = calculateReadTime(post.content);
          setReadTime(estimatedReadTime);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching post or author data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (postData && currentUser) {
      setIsLiked(postData.usersLikeList.includes(currentUser._id));
      setIsLoved(postData.usersLoveList.includes(currentUser._id));
      setIsSaved(postData.usersSaveList.includes(currentUser._id));
    }
    if (postData) {
      setLikesCount(postData.usersLikeList.length);
      setLovesCount(postData.usersLoveList.length);
      setSavesCount(postData.usersSaveList.length);
    }
  }, [postData, currentUser]);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  };

  const handleAction = async (actionType) => {
    if (!currentUser) {
      alert('You must login');
      navigate('/signin');
      return;
    }

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
        setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
      } else if (actionType === 'love') {
        setIsLoved(!isLoved);
        setLovesCount(isLoved ? lovesCount + 1 : lovesCount - 1);
      } else if (actionType === 'save') {
        setIsSaved(!isSaved);
        setSavesCount(isSaved ? savesCount + 1 : savesCount - 1);
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
    return <AppStatus type="loading" />
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Left Sidebar - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:block lg:col-span-2 space-y-6">
            <div className="sticky top-8 rounded-lg p-4 shadow-lg relative bg-gray-200 dark:bg-gray-800">
              <span className="absolute top-2 left-2 text-sm font-semibold text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Ads Space
              </span>
              <div className="flex flex-col items-center space-y-4">
                <AdSense
                  adClient={import.meta.env.VITE_ADSENSE_CLIENT}
                  adSlot={import.meta.env.VITE_ADSENSE_SLOT}
                  adFormat="auto"
                  style={{ width: '100%', height: 'auto' }}
                  fullWidthResponsive={true}
                />
              </div>
            </div>
          </div>

          {/* Main Content - Full width on mobile, adjusted for larger screens */}
          <article className="col-span-1 md:col-span-8 lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
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

            <div className="w-full h-[200px] sm:h-[300px] lg:h-[400px]">
              <img
                src={postData?.image}
                alt="Post Visual"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <TableOfContents content={postData.content} />
              <PostContent content={postData?.content} />
              <CommentSection postId={postData._id} />
            </div>
          </article>

          {/* Right Sidebar - Becomes row on medium screens, column on large screens */}
          <div className="col-span-1 md:col-span-8 lg:col-span-3 space-y-4 lg:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Latest Posts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Latest Posts
                </h3>
                <LatestPosts />
              </div>

              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
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
          {/* Show ads container in a row on medium screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-4">
            <AdSpaceContainer />
          </div>
          {postData && <RelatedPosts categories={postData.category} />}
        </div>

        {/* Floating action buttons - Responsive positioning */}
        {showFloatingIcons && (
          <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-200 dark:bg-gray-800 p-3 sm:p-4 rounded-full shadow-lg flex items-center space-x-3 sm:space-x-4 z-50">
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

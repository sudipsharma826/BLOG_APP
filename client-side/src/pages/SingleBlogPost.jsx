import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PostHeader } from '../components/blog/PostHeader';
import { AuthorInfo } from '../components/blog/AuthorInfo';
import TableOfContents from '../components/blog/TableOfContent';
import { PostContent } from '../components/blog/PostContent';
import { SEO } from '../components/blog/SEO';
import AppStatus from '../components/AppStatus';
import SkeletonPostCard from '../components/homepage/SkeletonPostCard';
import { useSelector } from 'react-redux';
import { Heart, ThumbsUp, Share2, Bookmark, Link, HelpingHand } from 'lucide-react';
import { Bell, Clock, Hash, Sidebar } from 'react-feather';
import NotFound from './NotFound';
import RelatedPosts from '../components/RelatedPosts';
import AdSense from '../components/blog/AdSense';
import CommentSection from '../components/CommetnSection';
import LatestPosts from '../components/LatestPost';
import SidebarCategories from '../components/SideBarCategories';

function calculateReadTime(content) {
  // Average reading speed: 200 words per minute
  if (!content) return 0;
  const text = content.replace(/<[^>]+>/g, ''); // Remove HTML tags
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 200));
}

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
          // Wait for currentUser to be loaded
          let userId = currentUser?._id;
          // Always use string for comparison
          userId = userId ? String(userId) : null;
          const likeList = Array.isArray(postRes.data.post.usersLikeList) ? postRes.data.post.usersLikeList.map(String) : [];
          const loveList = Array.isArray(postRes.data.post.usersLoveList) ? postRes.data.post.usersLoveList.map(String) : [];
          const saveList = Array.isArray(postRes.data.post.usersSaveList) ? postRes.data.post.usersSaveList.map(String) : [];
          // Only set state if userId is available
          if (userId) {
            setIsLiked(likeList.includes(userId));
            setIsLoved(loveList.includes(userId));
            setIsSaved(saveList.includes(userId));
          } else {
            setIsLiked(false);
            setIsLoved(false);
            setIsSaved(false);
          }
          setLikesCount(likeList.length);
          setLovesCount(loveList.length);
          setSavesCount(saveList.length);
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
        setError("Unable to load content. Please check your connection or try again later.\n" + (error?.message || ""));
        console.error("SingleBlogPost fetch error:", error);
      }
    };
    // Only fetch if currentUser is loaded (prevents all-true bug on mobile)
    if (typeof currentUser !== 'undefined') {
      fetchData();
    }
  }, [slug, currentUser]);

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-7xl mx-auto px-4 pt-20 md:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonPostCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20 md:pt-0">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-lg font-semibold shadow">
          {error}
        </div>
      </div>
    );
  }

  if (!postData) {
    return <div className="pt-20 md:pt-0"><NotFound /></div>;
  }


  return (
    <div className="pt-20">
      <SEO
        title={postData?.title}
        description={postData?.description}
        image={postData?.image}
      />
      <div className="min-h-screen page-section py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Main Content */}
          <article className="col-span-1 md:col-span-9 lg:col-span-8 bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:shadow-3xl">
            <div className="p-4 sm:p-8 lg:p-12">
              <PostHeader
                category={postData?.category}
                title={postData?.title}
                subtitle={postData?.subtitle}
                readTime={readTime + ' min'}
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
            <div className="w-full h-[220px] sm:h-[340px] lg:h-[440px] bg-gradient-to-br from-purple-100 via-blue-100 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center overflow-hidden relative">
              <img
                src={postData?.image}
                alt="Post Visual"
                className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white dark:border-gray-900 transition-transform duration-300 hover:scale-105"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
              />
              <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-900/80 px-3 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-200 shadow">Featured Image</div>
            </div>
            <div className="p-4 sm:p-8 lg:p-12">
              <TableOfContents content={postData.content} />
              <PostContent content={postData?.content} />
              <CommentSection postId={postData._id} />
            </div>
          </article>
          {/* Right Sidebar */}
          <div className="col-span-1 md:col-span-3 lg:col-span-4 space-y-4 lg:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Latest Posts */}
              <div className="card rounded-lg p-4 sm:p-6 bg-white dark:bg-gray-900 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Latest Posts
                </h3>
                <LatestPosts excludePostId={postData._id} />
              </div>
              {/* Categories */}
              <div className="card rounded-lg p-4 sm:p-6 bg-white dark:bg-gray-900 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  Categories
                </h3>
                <SidebarCategories />
                {/* AdSense below categories, full width of card */}
                <div className="mt-6 w-full flex justify-center">
                  <AdSense
                    adClient={import.meta.env.VITE_ADSENSE_CLIENT}
                    adSlot={import.meta.env.VITE_ADSENSE_SLOT}
                    style={{ width: '100%', minHeight: 90, display: 'block' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom content */}
        <div className="mt-4 sm:mt-6 lg:mt-8">
          {postData && <RelatedPosts categories={postData.category} currentPostId={postData._id} />}
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
    </div>
  );
}

export default SinglePostPage;

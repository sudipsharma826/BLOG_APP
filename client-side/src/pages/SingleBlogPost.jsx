import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PostHeader } from '../components/blog/PostHeader';
import { AuthorInfo } from '../components/blog/AuthorInfo';
import TableOfContents from '../components/blog/TableOfContent';
import { PostContent } from '../components/blog/PostContent';
import { SEO } from '../components/blog/SEO.jsx';
import AppStatus from '../components/AppStatus';
import SkeletonPostCard from '../components/homepage/SkeletonPostCard';
import { useSelector } from 'react-redux';
import { Heart, ThumbsUp, Share2, Bookmark, Link, HelpingHand, X, Copy, Check } from 'lucide-react';
import { Bell, Clock, Hash, Sidebar, Facebook, Linkedin, MessageCircle, Mail, Send } from 'react-feather';
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
  const [error, setError] = useState(null);
  const [notFoundType, setNotFoundType] = useState(null); // 'post', 'author', etc.

  const [isLiked, setIsLiked] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [lovesCount, setLovesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [bellColor, setBellColor] = useState('bg-white');
  const [showFloatingIcons, setShowFloatingIcons] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  //Theme
  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        // Only fetch if not already loaded for this slug
        if (!postData || postData.slug !== slug) {
          const postRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPost/${slug}`,
            { withCredentials: true }
          );
          if (isMounted && postRes.data && postRes.data.post) {
            setPostData(postRes.data.post);
            // Calculate read time
            setReadTime(calculateReadTime(postRes.data.post.content));
            // Fetch author only if not already loaded or changed
            if (!authorData || authorData.email !== postRes.data.post.authorEmail) {
              const authorRes = await axios.get(
                `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getuser/${postRes.data.post.authorEmail}`,
                { withCredentials: true }
              );
              if (isMounted) setAuthorData(authorRes.data);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        
        // Check if it's a 404 error
        if (error.response && error.response.status === 404) {
          setNotFoundType('post'); // Post not found
          console.error("Post not found:", error);
        } else {
          // Other errors
          setError(error.response?.data?.message || error.message || "Unable to load content. Please check your connection or try again later.");
          console.error("SingleBlogPost fetch error:", error);
        }
      }
    };
    if (typeof currentUser !== 'undefined') {
      fetchData();
    }
    return () => { isMounted = false; };
  }, [slug]);

  // Separate useEffect to update reaction states when postData changes
  useEffect(() => {
    if (!postData) return;
    
    const likeList = Array.isArray(postData.usersLikeList) ? postData.usersLikeList.map(String) : [];
    const loveList = Array.isArray(postData.usersLoveList) ? postData.usersLoveList.map(String) : [];
    const saveList = Array.isArray(postData.usersSaveList) ? postData.usersSaveList.map(String) : [];
    
    // Always update counts
    setLikesCount(likeList.length);
    setLovesCount(loveList.length);
    setSavesCount(saveList.length);
    
    // Update interaction states based on user login status
    if (currentUser) {
      const userId = String(currentUser._id);
      setIsLiked(likeList.includes(userId));
      setIsLoved(loveList.includes(userId));
      setIsSaved(saveList.includes(userId));
    } else {
      setIsLiked(false);
      setIsLoved(false);
      setIsSaved(false);
    }
  }, [postData, currentUser]);

  const [reactionLoading, setReactionLoading] = useState({ like: false, love: false, save: false });

  const handleAction = async (actionType) => {
    // Check if user is logged in
    if (!currentUser) {
      alert('Please log in to interact with posts. You will be redirected to the sign-in page.');
      navigate('/sign-in');
      return;
    }

    if (reactionLoading[actionType]) return;
    setReactionLoading((prev) => ({ ...prev, [actionType]: true }));
    
    const actionData = {
      postId: postData._id,
      userId: currentUser._id,
    };

    let apiUrl = '';
    let currentState;

    // Determine which action to perform based on current state
    switch (actionType) {
      case 'like':
        currentState = isLiked;
        apiUrl = isLiked ? 'unLikePost' : 'likePost';
        break;
      case 'love':
        currentState = isLoved;
        apiUrl = isLoved ? 'unLovePost' : 'lovePost';
        break;
      case 'save':
        currentState = isSaved;
        apiUrl = isSaved ? 'unSavePost' : 'savePost';
        break;
      default:
        setReactionLoading((prev) => ({ ...prev, [actionType]: false }));
        return;
    }

    // Store previous state for revert on error
    const previousState = currentState;
    const userId = String(currentUser._id);
    
    // Optimistically update UI states immediately
    let optimisticUpdate = {};
    switch (actionType) {
      case 'like':
        setIsLiked(!currentState);
        setLikesCount(prev => currentState ? prev - 1 : prev + 1);
        optimisticUpdate = {
          state: setIsLiked,
          count: setLikesCount,
          listKey: 'usersLikeList'
        };
        break;
      case 'love':
        setIsLoved(!currentState);
        setLovesCount(prev => currentState ? prev - 1 : prev + 1);
        optimisticUpdate = {
          state: setIsLoved,
          count: setLovesCount,
          listKey: 'usersLoveList'
        };
        break;
      case 'save':
        setIsSaved(!currentState);
        setSavesCount(prev => currentState ? prev - 1 : prev + 1);
        optimisticUpdate = {
          state: setIsSaved,
          count: setSavesCount,
          listKey: 'usersSaveList'
        };
        break;
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/${apiUrl}`, actionData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      
      // Success - update postData to keep it in sync
      console.log(`${actionType} action successful:`, response.data);
      
      setPostData(prevPost => {
        if (!prevPost) return prevPost;
        const updatedPost = { ...prevPost };
        
        if (currentState) {
          // Was active, now inactive - remove user
          updatedPost[optimisticUpdate.listKey] = prevPost[optimisticUpdate.listKey].filter(id => String(id) !== userId);
        } else {
          // Was inactive, now active - add user
          updatedPost[optimisticUpdate.listKey] = [...prevPost[optimisticUpdate.listKey], userId];
        }
        
        return updatedPost;
      });
      
    } catch (error) {
      console.error('Error performing action:', error);
      
      // Revert optimistic UI updates on error
      optimisticUpdate.state(previousState);
      optimisticUpdate.count(prev => previousState ? prev + 1 : prev - 1);
      
      // Show user-friendly error message
      const errorMsg = error.response?.data?.error || `Failed to ${actionType} post`;
      alert(`${errorMsg}. Please try again.`);
    } finally {
      setReactionLoading((prev) => ({ ...prev, [actionType]: false }));
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(postData?.title || '');
    const description = encodeURIComponent(postData?.subtitle || '');
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${title}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      telegram: `https://t.me/share/url?url=${url}&text=${title}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
      email: `mailto:?subject=${title}&body=${description}%0A%0A${url}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
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

  // Show NotFound component for 404 errors
  if (notFoundType) {
    return (
      <div className="pt-20">
        <NotFound 
          resourceType="Post"
          resourceName={slug}
          errorCode="404"
        />
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
    <div className="pt-20" role="main">
      <SEO
        title={`${postData?.title} | TechKnows`}
        description={postData?.description || postData?.subtitle}
        image={postData?.image}
        url={`https://sudipsharma.com.np/post/${postData?.slug}`}
        type="article"
        keywords={postData?.tags || postData?.category}
        author={authorData?.username || 'Sudip Sharma'}
        authorImage={authorData?.photoURL}
        authorUrl={authorData?.email ? `https://sudipsharma.com.np/author/${authorData.email}` : undefined}
        publishedTime={postData?.createdAt}
        modifiedTime={postData?.updatedAt}
        section={Array.isArray(postData?.category) ? postData.category[0] : postData?.category}
        tags={postData?.tags || postData?.category}
      />
      <div className="min-h-screen page-section py-6 sm:py-8 lg:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Main Content */}
          <article className="col-span-1 lg:col-span-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800" aria-label="Blog post content">
            
            {/* Login Status Indicator */}
            {!currentUser ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200 dark:border-blue-800 px-6 py-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Not Logged In</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Sign in to like, save, and comment on posts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/sign-in')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-200 dark:border-green-800 px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Logged in as <span className="font-semibold text-green-700 dark:text-green-400">{currentUser.username || currentUser.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Post Stats Display - Top Right */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{readTime} min read</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(postData?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Views - Only show if > 10 */}
                  {(postData?.postViews || 0) > 10 && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Views</span>
                        <span className="text-sm font-semibold">{postData?.postViews || 0}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Likes - Only show if > 5 */}
                  {likesCount > 5 && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                        <ThumbsUp className="w-4 h-4 text-blue-600 dark:text-blue-400" fill={isLiked ? 'currentColor' : 'none'} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Likes</span>
                        <span className="text-sm font-semibold">{likesCount}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Loves - Only show if > 5 */}
                  {lovesCount > 5 && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full">
                        <Heart className="w-4 h-4 text-red-600 dark:text-red-400" fill={isLoved ? 'currentColor' : 'none'} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Loves</span>
                        <span className="text-sm font-semibold">{lovesCount}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Saves - Only show if > 5 */}
                  {savesCount > 5 && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full">
                        <Bookmark className="w-4 h-4 text-green-600 dark:text-green-400" fill={isSaved ? 'currentColor' : 'none'} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Saves</span>
                        <span className="text-sm font-semibold">{savesCount}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-10 lg:p-14 space-y-8">
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
                <div className="mt-6">
                  <AuthorInfo
                    name={authorData?.username}
                    email={authorData?.email}
                    image={authorData?.photoURL}
                  />
                </div>
              )}
            </div>
            
            {/* Featured Image Section */}
            <div className="w-full px-6 sm:px-10 lg:px-14 mb-12">
              <figure className="relative w-full overflow-hidden rounded-xl shadow-lg">
                <img
                  src={postData?.image}
                  alt={postData?.title || "Post featured image"}
                  className="w-full h-auto object-cover max-h-[500px]"
                  loading="eager"
                />
                {/* Featured badge - bottom right white box */}
                <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold border border-gray-200 dark:border-gray-700">
                  Featured
                </div>
                <figcaption className="sr-only">Featured image for {postData?.title}</figcaption>
              </figure>
            </div>
            
            <div className="px-6 sm:px-10 lg:px-14 space-y-10">
              <section aria-labelledby="table-of-contents">
                <TableOfContents content={postData.content} />
              </section>
              
              {/* Ad Space - After TOC (Better Position) */}
              <div className="my-10">
                <div className="relative bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="absolute top-2 left-2 text-xs text-gray-400 dark:text-gray-600 font-medium uppercase tracking-wider">Advertisement</div>
                  <AdSense
                    adClient={import.meta.env.VITE_ADSENSE_CLIENT}
                    adSlot={import.meta.env.VITE_ADSENSE_SLOT}
                    adFormat="horizontal"
                    style={{ width: '100%', minHeight: 100, display: 'block', marginTop: '20px' }}
                  />
                </div>
              </div>
              
              <section aria-labelledby="post-content" className="mt-8">
                <PostContent content={postData?.content} />
              </section>
              
              {/* Ad Space - After Content */}
              <div className="my-12">
                <div className="relative bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="absolute top-2 left-2 text-xs text-gray-400 dark:text-gray-600 font-medium uppercase tracking-wider">Advertisement</div>
                  <AdSense
                    adClient={import.meta.env.VITE_ADSENSE_CLIENT}
                    adSlot={import.meta.env.VITE_ADSENSE_SLOT}
                    adFormat="horizontal"
                    style={{ width: '100%', minHeight: 100, display: 'block', marginTop: '20px' }}
                  />
                </div>
              </div>
              
              <section aria-labelledby="comments-section" className="mt-12">
                <h2 id="comments-section" className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Comments</h2>
                <CommentSection postId={postData._id} />
              </section>
            </div>
          </article>
          
          {/* Right Sidebar */}
          <aside className="col-span-1 lg:col-span-4 space-y-6" aria-label="Sidebar content">
            {/* Ad Space - Top of Sidebar */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Advertisement</p>
              <AdSense
                adClient={import.meta.env.VITE_ADSENSE_CLIENT}
                adSlot={import.meta.env.VITE_ADSENSE_SLOT}
                adFormat="vertical"
                style={{ width: '100%', minHeight: 250, display: 'block' }}
              />
            </div>
            
            {/* Latest Posts */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
                <Clock className="w-5 h-5 mr-3 text-blue-500" aria-hidden="true" />
                Latest Posts
              </h3>
              <LatestPosts excludePostId={postData._id} />
            </div>
            
            {/* Categories */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
                <Hash className="w-5 h-5 mr-3 text-green-500" aria-hidden="true" />
                Categories
              </h3>
              <SidebarCategories />
            </div>
            
            {/* Ad Space - Bottom of Sidebar */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Advertisement</p>
              <AdSense
                adClient={import.meta.env.VITE_ADSENSE_CLIENT}
                adSlot={import.meta.env.VITE_ADSENSE_SLOT}
                style={{ width: '100%', minHeight: 250, display: 'block' }}
              />
            </div>
          </aside>
        </div>
        
        {/* Related Posts Section */}
        {postData && (
          <section aria-labelledby="related-posts" className="mt-10">
            <h2 id="related-posts" className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Related Articles</h2>
            <RelatedPosts categories={postData.category} currentPostId={postData._id} />
          </section>
        )}
        
        {/* Floating Action Buttons - Always visible with login prompt */}
        {showFloatingIcons && (
          <nav 
            aria-label="Post actions"
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 border-2 border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => handleAction('like')}
              disabled={!currentUser || reactionLoading.like}
              aria-label={!currentUser ? 'Sign in to like this post' : (isLiked ? 'Unlike this post' : 'Like this post')}
              aria-pressed={isLiked}
              title={!currentUser ? 'Sign in to like' : ''}
              className={`p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative ${
                !currentUser 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60' 
                  : isLiked 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              } ${reactionLoading.like ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {reactionLoading.like ? (
                <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <ThumbsUp className="w-5 h-5" aria-hidden="true" />
                  {!currentUser && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-white text-xs">🔒</span>
                    </span>
                  )}
                  <span className="sr-only">{likesCount} likes</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => handleAction('love')}
              disabled={!currentUser || reactionLoading.love}
              aria-label={!currentUser ? 'Sign in to love this post' : (isLoved ? 'Remove love from this post' : 'Love this post')}
              aria-pressed={isLoved}
              title={!currentUser ? 'Sign in to love' : ''}
              className={`p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 relative ${
                !currentUser 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60' 
                  : isLoved 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              } ${reactionLoading.love ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {reactionLoading.love ? (
                <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <Heart className="w-5 h-5" aria-hidden="true" />
                  {!currentUser && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-white text-xs">🔒</span>
                    </span>
                  )}
                  <span className="sr-only">{lovesCount} loves</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => handleAction('save')}
              disabled={!currentUser || reactionLoading.save}
              aria-label={!currentUser ? 'Sign in to save this post' : (isSaved ? 'Remove bookmark' : 'Bookmark this post')}
              aria-pressed={isSaved}
              title={!currentUser ? 'Sign in to save' : ''}
              className={`p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative ${
                !currentUser 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60' 
                  : isSaved 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              } ${reactionLoading.save ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {reactionLoading.save ? (
                <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
                  {!currentUser && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-white text-xs">🔒</span>
                    </span>
                  )}
                  <span className="sr-only">{savesCount} saves</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowShareModal(true)}
              aria-label="Share this post"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-6 h-6 text-purple-500" />
                Share Post
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Share Options Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                aria-label="Share on Facebook"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Facebook</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                aria-label="Share on LinkedIn"
              >
                <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">LinkedIn</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                aria-label="Share on WhatsApp"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">WhatsApp</span>
              </button>

              {/* Reddit */}
              <button
                onClick={() => handleShare('reddit')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
                aria-label="Share on Reddit"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Reddit</span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                aria-label="Share on Twitter"
              >
                <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Twitter</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => handleShare('telegram')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                aria-label="Share on Telegram"
              >
                <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Telegram</span>
              </button>

              {/* Pinterest */}
              <button
                onClick={() => handleShare('pinterest')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                aria-label="Share on Pinterest"
              >
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Pinterest</span>
              </button>

              {/* Email */}
              <button
                onClick={() => handleShare('email')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                aria-label="Share via Email"
              >
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Email</span>
              </button>
            </div>

            {/* Copy Link Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Or copy link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    copySuccess 
                      ? 'bg-green-500 text-white' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                  aria-label="Copy link"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SinglePostPage;

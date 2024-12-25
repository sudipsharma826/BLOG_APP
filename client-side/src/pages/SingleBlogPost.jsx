import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PostHeader } from '../components/blog/PostHeader';
import { AuthorInfo } from '../components/blog/AuthorInfo';
import TableOfContents  from '../components/blog/TableOfContent';
import { PostContent } from '../components/blog/PostContent';
import { SEO } from '../components/blog/SEO';
import { PostLoading } from '../components/blog/PostLoading';
import { useSelector } from 'react-redux';


function SinglePostPage() {
  const { currentUser } = useSelector((state) => state.user);
  const { slug } = useParams(); // Get the slug from the URL

  const [postData, setPostData] = useState(null);
  const [authorData, setAuthorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readTime, setReadTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the post data
        const postRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPost/${slug}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser?.currentToken}`,
            },
          }
        );

        const post = postRes.data.post;
        setPostData(post);

        // Fetch the author data
        const authorRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getuser/${post.authorEmail}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser?.currentToken}`,
            },
          }
        );

        setAuthorData(authorRes.data);

        // Calculate and set the read time
        const estimatedReadTime = calculateReadTime(post.content);
        setReadTime(estimatedReadTime);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching post or author data:', error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchData(); // Call the async function
  }, [slug, currentUser]);



  // Function to calculate read time
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.split(/\s+/).length; // Count words
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  };

  if (loading) {
    return <PostLoading />;
  }

  return (
    <>
      <SEO
        title={postData?.title}
        description={postData?.description}
        image={postData?.image}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Title Section */}
          <div className="p-8">
            <PostHeader
              category={postData?.category}
              title={postData?.title}
              subtitle={postData?.subtitle}
              readTime={readTime} // Pass dynamic readTime
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

          {/* Image Section */}
          <div className="w-full h-[400px]">
            <img
              src={postData?.image}
              alt="Post Visual"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            {/* Table of Contents */}
            <TableOfContents content={postData.content} />

            {/* Post Content */}
            <PostContent content={postData?.content} />
          </div>
        </article>
      </div>
    </>
  );
}

export default SinglePostPage;

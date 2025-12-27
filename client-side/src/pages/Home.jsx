import React, { useEffect } from 'react'
import HeroSection from '../components/homepage/HeroSection'
import FeaturedPosts from '../components/homepage/FeaturePosts';
import axios from 'axios';
import { useState } from 'react';
import TechStack from '../components/homepage/TechStack';
import CategoryList from '../components/homepage/Catrgories';
import PostSlider from '../components/homepage/PostSlider';



const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  //Get Featured Posts
  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getFeaturedPosts`,
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          setPosts(res.data.posts);
          setFeaturedPosts(res.data.posts);
        }
      } catch (error) {
        console.error('Error fetching featured posts:', error.message);
      }
    };

    //Get All Catories
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getCategories`,
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    //Get All Posts
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/post/getPosts`, {
          params: {
            limit: 15,
            setDirection: -1,
          },
          withCredentials: true,
        });
        if (res.status === 200) {
          setPosts(res.data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchFeaturedPosts(), fetchCategories(), fetchPosts()]);
      setLoading(false);
    };
    fetchAll();
  }, []);
    return (
      <div className="bg-gradient-to-br from-purple-100 via-yellow-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen w-full">
        <HeroSection />
        
        <section className="relative z-20 -mt-24 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="rounded-3xl shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-8 md:p-12 mb-16 border border-purple-100 dark:border-gray-800">
            <FeaturedPosts posts={featuredPosts} loading={loading} />
          </div>
          <div className="rounded-3xl shadow-xl bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-8 md:p-12 mb-16 border border-blue-100 dark:border-gray-800">
            <PostSlider posts={(posts || []).slice(0, 40)} />
          </div>
          <div className="rounded-3xl shadow-xl bg-white/90 dark:bg-gray-900/90 p-8 md:p-12 mb-16 border border-yellow-100 dark:border-gray-800">
            <CategoryList />
          </div>
          <div className="rounded-3xl shadow-xl bg-gradient-to-r from-purple-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-8 md:p-12 mb-16 border border-purple-100 dark:border-gray-800">
            <TechStack />
          </div>
        </section>
      </div>
    );
}

export default Home;
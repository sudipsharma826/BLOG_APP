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
    fetchFeaturedPosts();
    fetchCategories();
    fetchPosts();
  }, []);
  return (
    <>
    {/* <SampleForm /> */}
  <HeroSection />


    {/* //Featured Posts */}
    <FeaturedPosts  posts={featuredPosts}/>
    <TechStack />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    {/* //Catrgores Section */}
     <CategoryList/>
    </div>

  <PostSlider posts={(posts || []).slice(0, 40)} />
    
    </>
    
  )
}

export default Home
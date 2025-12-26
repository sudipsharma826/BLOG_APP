import React, { useState, useEffect } from 'react';
import { Code, Coffee, Github, Heart, Pen } from 'lucide-react';
import axios from 'axios';
import { Facebook, Linkedin } from 'react-feather';
import AdSense from '../components/blog/AdSense';

const AboutPage = () => {
  const [admin, setAdmin] = useState({});

  // Fetching the admin
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getAdmin`
        );
        setAdmin(response.data.admin);
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    };
    fetchAdmin();
  }, []);

        {/* AdSense Ad - Top of About page */}
        <div className="my-8 flex justify-center">
          <AdSense
            adClient={import.meta.env.VITE_ADSENSE_CLIENT}
            adSlot={import.meta.env.VITE_ADSENSE_SLOT}
            adFormat="auto"
            style={{ display: 'block', minHeight: 90, maxWidth: 728, margin: '0 auto' }}
            fullWidthResponsive={true}
          />
        </div>
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950">
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 py-20 dark:from-blue-900 dark:to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Pen className="h-12 w-12 text-blue-200 inline -mt-5 dark:text-blue-400" />
          <h1 className="ml-3 text-4xl md:text-5xl font-bold text-white mb-4 inline dark:text-white">
            About TechKnows
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto dark:text-blue-100">
            Passionate about technology and dedicated to sharing knowledge through thoughtful writing.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-blue-900">
            <Code className="h-12 w-12 text-blue-600 mx-auto mb-4 dark:text-blue-300" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-blue-100">Technical Expertise</h3>
            <p className="text-gray-700 dark:text-blue-200">
              Deep knowledge in various programming languages and frameworks
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-blue-900">
            <Coffee className="h-12 w-12 text-blue-600 mx-auto mb-4 dark:text-blue-300" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-blue-100">Continuous Learning</h3>
            <p className="text-gray-700 dark:text-blue-200">
              Always staying updated with the latest tech trends
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-blue-900">
            <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4 dark:text-blue-300" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-blue-100">Passion for Sharing</h3>
            <p className="text-gray-700 dark:text-blue-200">
              Committed to helping others learn and grow
            </p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">Our Mission</h2>
          <p className="text-gray-600 mb-8 text-xl dark:text-gray-300">
            At TechKnows, we believe in making technology accessible through clear,
            comprehensive, and engaging content. Our mission is to bridge the gap between
            complex technical concepts and practical understanding.
          </p>

          <h2 className="text-3xl font-bold mb-8 dark:text-white">The Developer</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <img
              src={admin.photoURL || '/images/user.png'}
              alt="Developer"
              className="w-48 h-48 rounded-full object-cover"
            />
            <div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white">{admin.username}</h3>
              <p className="text-gray-600 mb-4 dark:text-gray-300">
              Full Stack Developer with 2 years of experience in both development and writing blogs, sharing insights and knowledge in the tech space.
              </p>
              <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/sudipsharmanp/" target="_blank" rel="noopener noreferrer">
    <Linkedin className="h-6 w-6 text-purple-600 dark:text-purple-500" />
  </a>
  <a href="https://github.com/sudipsharma826" target="_blank" rel="noopener noreferrer">
    <Github className="h-6 w-6 text-purple-600 dark:text-purple-500" />
  </a>
  <a href="https://www.facebook.com/sudipsharma.np/" target="_blank" rel="noopener noreferrer">
    <Facebook className="h-6 w-6 text-purple-600 dark:text-purple-500" />
  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

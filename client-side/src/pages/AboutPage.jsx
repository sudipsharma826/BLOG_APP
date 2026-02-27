import React, { useState, useEffect } from 'react';
import { Code, Coffee, Github, Heart, Award, Users, BookOpen, TrendingUp, Zap, Target } from 'lucide-react';
import axios from 'axios';
import { Facebook, Linkedin } from 'react-feather';
import SEOHead from '../components/SEOHead';

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

  const features = [
    { icon: Code, title: 'Technical Expertise', desc: 'Deep knowledge in various programming languages and frameworks' },
    { icon: BookOpen, title: 'Quality Content', desc: 'Well-researched articles with practical examples' },
    { icon: Users, title: 'Community First', desc: 'Built by developers, for developers' },
    { icon: Zap, title: 'Latest Trends', desc: 'Always staying updated with cutting-edge tech' },
    { icon: Target, title: 'Goal Oriented', desc: 'Helping you achieve your learning objectives' },
    { icon: Heart, title: 'Passion Driven', desc: 'Committed to spreading knowledge and growth' },
  ];

  // const stats = [
  //   { number: '500+', label: 'Articles Published' },
  //   { number: '10K+', label: 'Monthly Readers' },
  //   { number: '50+', label: 'Topics Covered' },
  //   { number: '2+', label: 'Years Experience' },
  // ];

  return (
    <>
      <SEOHead
        title="About TechKnows | Sudip Sharma"
        description="Learn more about TechKnows, a technology and programming blog dedicated to sharing knowledge through thoughtful writing and expert technical content."
        keywords="about techknows, sudip sharma, technology blog, programming expertise, tech blogger"
        url="/about"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 pt-20">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <img src="/images/logo.png" alt="TechKnow Logo" className="h-16 w-16" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              About TechKnows
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Empowering developers worldwide with high-quality technical content and practical insights
            </p>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose TechKnows?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're committed to delivering exceptional content that makes a difference
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  At TechKnows, we believe in making technology accessible through clear,
                  comprehensive, and engaging content. Our mission is to bridge the gap between
                  complex technical concepts and practical understanding.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  We strive to create a learning environment where both beginners and experienced
                  developers can find valuable insights, tutorials, and best practices.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl transform rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                  alt="Team collaboration"
                  className="relative rounded-3xl shadow-2xl w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet The Creator</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Passionate about technology and committed to sharing knowledge
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <img
                  src={admin.photoURL || '/images/user.png'}
                  alt="Developer"
                  className="w-64 h-64 rounded-full object-cover shadow-2xl ring-8 ring-white dark:ring-gray-700"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {admin.username || 'Sudip Sharma'}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Full Stack Developer with 2+ years of experience in web development and technical writing.
                  Passionate about creating content that empowers developers to build amazing things.
                </p>
                <div className="flex gap-4 mb-6">
                  <a href="https://www.linkedin.com/in/sudipsharmanp/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="https://github.com/sudipsharma826" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-colors duration-300">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="https://www.facebook.com/sudipsharma.np/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300">
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
                <a href="https://sudipsharma.info.np" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                  View Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default AboutPage;

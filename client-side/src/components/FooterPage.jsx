// components/footer/Footer.jsx
import React from 'react';
import { Github, Linkedin, Mail, Heart, Code2, Palette, Database, Cloud, Smartphone, Terminal } from 'lucide-react';
import { Facebook } from 'react-feather';
import { Link } from 'react-router-dom';

const APP_VERSION = '1.2.1'; 

const Footer = () => {
  const techStack = [
    { name: 'Web Dev', icon: Code2, color: 'text-purple-500 dark:text-purple-400' },
    { name: 'UI/UX', icon: Palette, color: 'text-blue-500 dark:text-blue-400' },
    { name: 'Backend', icon: Terminal, color: 'text-green-500 dark:text-green-400' },
    { name: 'Databases', icon: Database, color: 'text-yellow-500 dark:text-yellow-400' },
    { name: 'Mobile', icon: Smartphone, color: 'text-pink-500 dark:text-pink-400' },
    { name: 'Cloud', icon: Cloud, color: 'text-indigo-500 dark:text-indigo-400' },
  ];

  return (
    <>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-8" />
      <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900/95 dark:to-blue-900/10 text-gray-900 dark:text-gray-100 rounded-t-3xl shadow-2xl border-t-2 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* TechKnows Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <img src="/images/logo.png" alt="TechKnows Logo" className="h-16 w-16 rounded-2xl shadow-xl border-2 border-white dark:border-gray-800" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-25" />
                </div>
                <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-transparent bg-clip-text dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 tracking-tight">
                  TechKnows
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                Exploring the world of technology through insightful articles, tutorials, and thought-provoking content.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <span>by Sudip</span>
              </div>
            </div>

            {/* Technologies Section */}
            <div>
              <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Tech Stack</h4>
              <ul className="space-y-3">
                {techStack.map((tech) => (
                  <li key={tech.name} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group">
                    <tech.icon className={`w-4 h-4 ${tech.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm font-medium">{tech.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quick Links Section */}
            <div>
              <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform" />
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:scale-150 transition-transform" />
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full group-hover:scale-150 transition-transform" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:scale-150 transition-transform" />
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Connect</h4>
              <div className="flex flex-wrap gap-3 mb-6">
                <a 
                  href="https://www.facebook.com/sudipsharma.np/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://github.com/sudipsharma826" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative p-3 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/sudipsharmanp/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative p-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Follow for updates on tech, tutorials, and industry insights.
              </p>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} <span className="font-semibold text-gray-800 dark:text-gray-200">TechKnows</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Crafted by</span>
                <a 
                  href="https://sudipsharma.com.np" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-semibold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text hover:from-purple-700 hover:to-blue-600 transition-all"
                >
                  Sudip Sharma
                </a>
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                  v{APP_VERSION}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

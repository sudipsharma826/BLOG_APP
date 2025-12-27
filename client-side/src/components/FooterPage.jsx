// components/footer/Footer.jsx
import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Facebook } from 'react-feather';
import { Link } from 'react-router-dom';

const APP_VERSION = '1.2.0'; 

const Footer = () => {
  return (
    <>
      <div className="h-[2px] bg-gray-300 dark:bg-gray-700 my-6" />

      <footer className="bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 rounded-t-2xl shadow-2xl border-t border-gray-200 dark:border-gray-800 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* TechKnows Section */}
            <div>
              <div className="flex items-center space-x-3">
                <img src="/images/logo.png" alt="TechKnow Logo" className="h-14 w-14 rounded-xl shadow-lg border-2 border-white dark:border-gray-800" />
                <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text dark:from-purple-400 dark:to-blue-500 tracking-tight drop-shadow-lg">
                  TechKnow
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Exploring the world of technology through thoughtful writing.
              </p>
            </div>

            {/* Quick Links Section */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/sudipsharma.np/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://github.com/sudipsharma826"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sudipsharmanp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} TechKnows. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Designed & Developed by{' '}
              <a
                href="https://sudipsharma.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                Sudip Sharma
              </a>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Version {APP_VERSION}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

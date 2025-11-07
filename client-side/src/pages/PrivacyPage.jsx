import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50  dark:bg-gray-800">
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect and manage your data.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <div className="prose prose-lg max-w-none">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl font-bold m-0">Data Protection</h2>
          </div>
          <p className="text-gray-600 mb-8 dark:text-gray-300">
            We take the protection of your personal data seriously. This privacy policy explains how we collect, 
            use, and protect your information when you use our website.
          </p>

          <div className="flex items-center gap-4 mb-8">
            <Lock className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl font-bold m-0">Information We Collect</h2>
          </div>
          <ul className="text-gray-600 mb-8  dark:text-gray-300">
            <li>Personal information (name, email) when you contact us</li>
            <li>Usage data and analytics to improve our service</li>
            <li>Comments and interactions on our blog posts</li>
          </ul>

          <div className="flex items-center gap-4 mb-8">
            <Eye className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl font-bold m-0">Your Rights</h2>
          </div>
          <p className="text-gray-600 mb-8  dark:text-gray-300">
            You have the right to:
          </p>
          <ul className="text-gray-600  dark:text-gray-300">
            
            <li>Access your personal data</li>
            <li>Request correction of your data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
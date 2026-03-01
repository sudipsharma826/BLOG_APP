import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Data Protection</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We take the protection of your personal data seriously. This privacy policy explains how we collect, 
                use, and protect your information when you use our website.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
              </div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                  <span>Personal information (name, email) when you contact us</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                  <span>Usage data and analytics to improve our service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                  <span>Comments and interactions on our blog posts</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Rights</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                  <span>Access your personal data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                  <span>Request correction of your data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                  <span>Object to processing of your data</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
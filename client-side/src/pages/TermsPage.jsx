import React from 'react';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Please read these terms carefully before using our website.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Agreement to Terms</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                By accessing our website, you agree to be bound by these Terms and Conditions 
                and agree that you are responsible for compliance with any applicable local laws.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Limitations</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                TechKnows and its suppliers shall not be held accountable for any damages that result from the use 
                or inability to use the materials on this website.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Content Usage</h2>
              </div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                  <span>All content remains the property of TechKnows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                  <span>Content may not be used for commercial purposes without permission</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                  <span>Attribution is required when sharing or quoting content</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                  <span>Modification of content is not permitted without consent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
import React from 'react';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 py-20 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 dark:text-gray-900">
            Terms & Conditions
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto dark:text-white">
            Please read these terms carefully before using our website.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl font-bold m-0">Agreement to Terms</h2>
          </div>
          <p className="text-gray-600 mb-8 dark:text-white">
            By accessing our website, you agree to be bound by these Terms and Conditions 
            and agree that you are responsible for compliance with any applicable local laws.
          </p>

          <div className="flex items-center gap-4 mb-8">
            <AlertCircle className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl font-bold m-0">Limitations</h2>
          </div>
          <p className="text-gray-600 mb-8  dark:text-white">
            TechKnows and its suppliers shall not be held accountable for any damages that result from the use 
            or inability to use the materials on this website.
          </p>

          <div className="flex items-center gap-4 mb-8">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl font-bold m-0">Content Usage</h2>
          </div>
          <ul className="text-gray-600  dark:text-white">
            <li>All content remains the property of TechKnows</li>
            <li>Content may not be used for commercial purposes without permission</li>
            <li>Attribution is required when sharing or quoting content</li>
            <li>Modification of content is not permitted without consent.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
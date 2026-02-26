import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';

export default function NotFound({ 
  resourceType = 'Page',
  resourceName = '',
  errorCode = '404',
  errorMessage = ''
}) {
  // Default messages based on resource type
  const getDefaultMessage = () => {
    const resourceDisplay = resourceName ? `"${resourceName}"` : resourceType;
    
    switch(resourceType.toLowerCase()) {
      case 'post':
        return `The blog post ${resourceDisplay} you're looking for doesn't exist or has been removed.`;
      case 'category':
        return `The category ${resourceDisplay} couldn't be found. It may have been removed or renamed.`;
      case 'tag':
        return `No posts found with the tag ${resourceDisplay}.`;
      case 'user':
        return `The user ${resourceDisplay} doesn't exist or has been deleted.`;
      case 'page':
      default:
        return `Oops! The page you're looking for seems to have wandered off into the digital wilderness.`;
    }
  };

  const displayMessage = errorMessage || getDefaultMessage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Modern 404 Animation */}
        <div className="mb-8">
          <img
            src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
            alt="404 animation"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
        
        {/* Error Code */}
        <h1 className="mb-4 text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {errorCode}
        </h1>
        
        {/* Resource Type Title */}
        <p className="mb-4 text-3xl font-bold text-gray-700 dark:text-gray-300">
          {resourceType} Not Found
        </p>
        
        {/* Custom Error Message */}
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          {displayMessage}
        </p>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300">
              <HiHome className="mr-2 h-5 w-5" />
              Back to Homepage
            </Button>
          </Link>
          
          {resourceType !== 'Page' && (
            <Link to="/posts">
              <Button size="lg" color="gray">
                Browse All Posts
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

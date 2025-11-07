import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';

export default function NotFound() {
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
        
        {/* Error Text */}
        <h1 className="mb-4 text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          404
        </h1>
        <p className="mb-4 text-3xl font-bold text-gray-700 dark:text-gray-300">
          Page Not Found
        </p>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Oops! The page you're looking for seems to have wandered off into the digital wilderness.
        </p>
        
        {/* Home Button */}
        <div className="flex justify-center">
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 w-full">
              <HiHome className="mr-2 h-5 w-5" />
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Spinner } from 'flowbite-react';

export function PostLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (for demonstration purposes)
    const timer = setTimeout(() => setIsLoading(false), 3000); // Change to real loading logic
    return () => clearTimeout(timer);
  }, []);

  return (
    isLoading ? (
      <div className="post-loading flex flex-col items-center justify-center h-screen bg-gray-800 text-white p-6">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <img
            src="./images/logo.png"
            alt="Logo"
            className="w-32 h-32 object-cover rounded-full border-4 border-yellow-400"
          />
        </div>

        {/* Spinner Section */}
        <div className="flex justify-center mb-6">
          <Spinner size="xl" color="success" />
        </div>

        {/* Message Section */}
        <div className="text-center space-y-4">
          <p className="text-2xl font-semibold text-yellow-400">
            Gathering Valued Content for You...
          </p>
          <p className="text-lg text-white">
            Stay tuned! We're preparing something special just for you.
          </p>
          <p className="text-md text-gray-300">
            Your patience is appreciated as we get everything ready.
          </p>
        </div>

        {/* Singer Highlight */}
        <div className="mt-6 text-center">
          <img
            src="./images/singer.png"
            alt="Singer"
            className="w-20 h-20 rounded-full border-4 border-yellow-400 mb-4"
          />
          <p className="text-xl font-semibold text-yellow-400">
            "Great things are on the way, hang tight!"
          </p>
        </div>
      </div>
    ) : (
      <div>Post content goes here...</div> // Replace with the actual post content after loading
    )
  );
}

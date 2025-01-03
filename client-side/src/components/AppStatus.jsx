import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pen, WrenchIcon, PenTool } from 'lucide-react';

// Reusable animated dot component
const AnimatedDot = ({ delay, color }) => (
  <motion.div
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 1, repeat: Infinity, delay }}
    className={`h-2 w-2 ${color} rounded-full mr-3`}
  />
);

// Main component that handles both loading and maintenance states
const AppStatus = ({ type = 'loading' }) => {
  const [loadingText, setLoadingText] = useState('Loading amazing content');

  useEffect(() => {
    if (type === 'loading') {
      const textTimer = setInterval(() => {
        setLoadingText(prev =>
          prev === 'Loading amazing content...' 
            ? 'Loading amazing content' 
            : prev + '.'
        );
      }, 500);

      return () => clearInterval(textTimer);
    }
  }, [type]); // Dependency array added to rerun when type changes

  return (
    <div className="flex items-center justify-center space-x-3">
      {/* Animated dots for loading */}
      {type === 'loading' && (
        <>
          <AnimatedDot delay={0} color="bg-blue-500" />
          <AnimatedDot delay={0.2} color="bg-blue-500" />
          <AnimatedDot delay={0.4} color="bg-blue-500" />
          <span className="text-lg font-semibold">{loadingText}</span>
        </>
      )}

      {/* Maintenance Icon if type is 'maintenance' */}
      {type === 'maintenance' && (
        <div className="flex items-center">
          <WrenchIcon className="h-8 w-8 text-yellow-500 mr-3" />
          <span className="text-lg font-semibold text-yellow-500">
            We're under maintenance, please check back soon!
          </span>
        </div>
      )}
    </div>
  );
};

export default AppStatus;

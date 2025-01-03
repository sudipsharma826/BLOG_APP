import { useState } from "react";
import { Subscribe } from "./Subscribe";



// Destructure props inside the function component
export function AuthorInfo({
  name,
  email,
  image,
  }) {
  const [isLiked, setIsLiked] = useState(false);

  

  return (
    <div className="flex items-center justify-between space-x-4 mb-6">
      {/* Author Info Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
         
        </div>
          
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
          <p className="text-gray-600 dark:text-gray-400">{email}</p>
        </div>
      </div>

       {/* Buttons Section */}
       <Subscribe />
  
      
    </div>
  );
}
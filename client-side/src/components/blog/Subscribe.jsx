import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export function Subscribe() {
  const { currentUser } = useSelector((state) => state.user); // Access the current user from the Redux store
  const [showModal, setShowModal] = useState(false); // Show modal for non-logged-in users
  const [subscriberEmail, setSubscriberEmail] = useState(""); // Store email for non-logged-in users
  const [isSubscribed, setIsSubscribed] = useState(false); // Track subscription status
  const [buttonEffect, setButtonEffect] = useState(false); // Button effect when clicked

  // Check if the logged-in user is subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      if (currentUser?.email) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/checkSubscribed`,
            { email: currentUser.email },
            {
              headers: {
                Authorization: `Bearer ${currentUser.token}`,
              },
              withCredentials: true,
            }
          );
          if (response.status === 200) {
            setIsSubscribed(true); // Set as subscribed if user is subscribed
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };
    checkSubscription();
  }, [currentUser]);

  const handleSubscribe = async () => {
    if (currentUser) {
      // If the user is logged in, subscribe them
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getSubscribed`,
          { email: currentUser.email , userId: currentUser._id },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsSubscribed(true);
          alert(`Subscribed successfully with: ${currentUser.email}`);
          triggerButtonEffect();
        } else if (response.status === 400 && response.data?.message?.includes('already subscribed')) {
          setIsSubscribed(true);
          alert('You are already subscribed.');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message?.includes('already subscribed')) {
          setIsSubscribed(true);
          alert('You are already subscribed.');
        } else {
          console.error("Error subscribing:", error);
        }
      }
    } else {
      // If the user is not logged in, show the modal
      setShowModal(true);
    }
  };

  const handleModalSubscribe = async () => {
    if (!subscriberEmail) {
      alert("Please enter a valid email.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/nonusersubscribe`,
        { email: subscriberEmail },
      );
      if (response.status === 200) {
        setIsSubscribed(true);
        alert(`Subscribed successfully with: ${subscriberEmail}`);
        triggerButtonEffect();
        setShowModal(false);
        setSubscriberEmail(""); // Clear input field after subscription
      }
    } catch (error) {
      console.error("Error subscribing via modal:", error);
    }
  };

  const triggerButtonEffect = () => {
    setButtonEffect(true);
    setTimeout(() => setButtonEffect(false), 1500); // Reset button effect after 1.5 seconds
  };

  return (
    <div className="flex flex-col sm:flex-row  sm:space-x-2 relative">
      {/* Always visible Subscribe Button */}
      <button
        onClick={handleSubscribe}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-300 shadow-md whitespace-nowrap text-xs sm:text-base max-w-full overflow-hidden text-ellipsis ${
          isSubscribed
            ? "bg-white text-black cursor-not-allowed"
            : "bg-red-900 text-white hover:bg-gray-600 hover:shadow-lg active:bg-red-700"
        } ${buttonEffect ? "animate-ping bg-yellow-500 text-black" : ""}`}
        disabled={isSubscribed}
        style={{lineHeight: 1.2, minWidth: '110px'}}
      >
        {isSubscribed ? (
          <span className="truncate flex items-center gap-1">
            Subscribed
            <img
              src="/images/logo.png"
              alt="Logo"
              className="inline w-5 h-5 sm:w-6 sm:h-6 object-cover rounded-full ml-1 align-middle"
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
            />
          </span>
        ) : (
          <span className="truncate block">Subscribe <span role="img" aria-label="bell">🔔</span></span>
        )}
      </button>
      {/* Modal for non-logged-in users */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white w-[90%] sm:w-[400px] p-6 rounded-lg shadow-lg dark:bg-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subscribe</h3>
            </div>
            <p className="text-gray-600 mb-4 dark:text-gray-300">
              Subscribe to receive the latest updates and newsletters.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 dark:bg-gray-600 dark:text-white"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubscribe}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

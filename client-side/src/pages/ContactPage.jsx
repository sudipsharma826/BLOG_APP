import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Contact2, Contact2Icon, LucideContactRound } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TextInput } from 'flowbite-react';

const ContactPage = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Initialize form data based on user login status
  const [formData, setFormData] = useState({
    name: currentUser ? currentUser.username : '',
    email: currentUser ? currentUser.email : '',
    subject: 'For Feedback/Query',
    message: '',
  });

  const [statusMessage, setStatusMessage] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/sendEmail`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setStatusMessage({ type: 'success', text: 'Email sent successfully!' });
        setFormData({ name: '', email: '', subject: 'For Feedback/Query', message: '' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to send email.' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'An error occurred while sending the email.' });
    }
    // Clear the message after 6 seconds
    setTimeout(() => setStatusMessage(null), 6000);
  };

        {/* AdSense Ad - Top of Contact page */}
        <div className="my-8 flex justify-center">
          <AdSense
            adClient={import.meta.env.VITE_ADSENSE_CLIENT}
            adSlot={import.meta.env.VITE_ADSENSE_SLOT}
            adFormat="auto"
            style={{ display: 'block', minHeight: 90, maxWidth: 728, margin: '0 auto' }}
            fullWidthResponsive={true}
          />
        </div>
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950">
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 py-20 dark:from-blue-900 dark:to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LucideContactRound className="h-12 w-12 text-white inline -mt-7 mr-4 dark:text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 inline">
            Get in Touch
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-8 dark:text-white">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold dark:text-gray-100">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">info@sudipsharma.com.np</p>
                </div>
              </div>
              <div className="flex items-start">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold dark:text-gray-100">Social Media</h3>
                  <a
                    href="https://www.linkedin.com/in/sudipsharmanp/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-gray-600 dark:text-gray-300"
                  >
                    @sudipsharmanp on Linkedin
                  </a>
                  <a
                    href="https://facebook.com/sudipsharma.np/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-gray-600 dark:text-gray-300 block"
                  >
                    @sudipsharma.np on Facebook
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold dark:text-gray-100">Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">Pokhara, Nepal</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <TextInput
                  type="text"
                  id="name"
                  value={formData?.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Send Message
              </button>
            </form>

            {statusMessage && (
              <div
                className={`mt-6 text-center py-2 px-4 rounded-md ${
                  statusMessage.type === 'success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-200'
                }`}
              >
                {statusMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, Phone, Globe } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TextInput } from 'flowbite-react';
import SEOHead from '../components/SEOHead';

const ContactPage = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Initialize form data based on user login status
  const [formData, setFormData] = useState({
    name: currentUser ? currentUser.username : '',
    email: currentUser ? currentUser.email : '',
    subject: '',
    message: '',
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      setTimeout(() => setStatusMessage(null), 6000);
      return;
    }
    if (!formData.subject || !formData.message || !formData.name || !formData.email) {
      setStatusMessage({ type: 'error', text: 'All fields are required.' });
      setTimeout(() => setStatusMessage(null), 6000);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/sendEmail`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setStatusMessage({ type: 'success', text: 'Email sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to send email.' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'An error occurred while sending the email.' });
    }
    setIsSubmitting(false);
    setTimeout(() => setStatusMessage(null), 6000);
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', content: 'sudeepsharma826@gmail.com', link: 'mailto:sudeepsharma826@gmail.com' },
    { icon: MapPin, title: 'Location', content: 'Pokhara, Nepal', link: null },
    { icon: Globe, title: 'Website', content: 'sudipsharma.com.np', link: 'https://sudipsharma.com.np' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/sudipsharmanp/', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Facebook', url: 'https://facebook.com/sudipsharma.np/', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'GitHub', url: 'https://github.com/sudipsharma826', color: 'bg-gray-800 hover:bg-gray-900' },
  ];
        
  return (
    <>
      <SEOHead
        title="Contact Us | TechKnows"
        description="Get in touch with TechKnows. Have questions or suggestions? We'd love to hear from you."
        keywords="contact techknows, get in touch, tech blog contact, sudip sharma contact"
        url="/contact"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 pt-20">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Have questions, suggestions, or just want to say hello? We're here to help!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Contact Information</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Feel free to reach out through any of the following channels. We typically respond within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mr-4 flex-shrink-0">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                      {item.link ? (
                        <a href={item.link} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-xl text-white">
                <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
                <p className="mb-6 text-white/90">Follow us on social media for the latest updates</p>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-3 ${social.color} rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1`}
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData?.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-1'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {statusMessage && (
                <div
                  className={`mt-6 p-4 rounded-xl text-center font-semibold ${
                    statusMessage.type === 'success'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

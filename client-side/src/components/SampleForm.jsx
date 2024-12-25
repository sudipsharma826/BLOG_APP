import React, { useState } from 'react';
import axios from 'axios';

const SampleForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page refresh)

    // Prepare data to send to the server
    const userData = {
      name: name,
      email: email,
      password: password,
    };

    try {
      // Make a POST request to the backend to save the user data
      const response = await axios.post('http://localhost:3000/signup', 
        userData, // The body of the request
        {
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
          },
          withCredentials: true, // This should be part of the config object
        }
      );
      
      
      // If successful, show a success message
      if(response.status === 201){
        setMessage('User added successfully!');
      }
      
      // Clear form inputs after successful submission
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      // Handle errors - add fallback for error message
      const errorMsg = error.response?.data || error.message || 'Error adding user';
      setMessage('Error: ' + errorMsg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">Create User</h1>
        <form onSubmit={handleSubmit}>
          {/* Name input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SampleForm;

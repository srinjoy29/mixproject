import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../api/index';
import { useAuth } from '../context/AuthContext';
import carImage from '../assets/car1.svg'; // Ensure you have the correct path for the car image

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (isLogin) {
        // Call the login API
        response = await api.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Call the signup API
        response = await api.signup({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }

      // Handle response - check if login/signup was successful
      if (response.success) {
        setAuth(response.user, response.token);
        toast.success(`Successfully ${isLogin ? 'logged in' : 'signed up'}!`);

        // Store the token (assuming response contains a token)
        localStorage.setItem('token', response.token);

        // Navigate to the dashboard
        navigate('/dashboard');
      } else {
        // Handle any errors from the server
        toast.error(response.message || 'An error occurred.');
      }
    } catch (error) {
      // Catch and display any unexpected errors
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl">
        {/* Car Image and Heading Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Left Side - Text Heading and Subheading */}
          <div className="max-w-xl flex-1">
            <h3 className="text-4xl font-bold text-gray-900">Welcome to Own-CarShowroom!</h3>
            <p className="text-gray-600 mt-4 text-2xl">
              This platform helps you manage your car collection easily. You can track all your vehicles, add new cars to your collection, and manage important information like car name, model, purchase date, price, and more.
            </p>
            <p className="text-gray-500 mt-4 text-md text-xl">
              Start by adding your first car, or search through your collection to see all the cars you've added so far.
            </p>
          </div>

          {/* Right Side - Car Vector Image */}
          <div className="hidden md:block w-1/3 flex-shrink-0">
            <img
              src={carImage} // Use imported image here
              alt="Car Vector"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Auth Form Section */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-600 hover:text-red-800 font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

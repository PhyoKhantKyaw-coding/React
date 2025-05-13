import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterView = () => {
    const navigate = useNavigate();
  return (
      <div className="bg-gradient-to-r from-blue-400 to-green-400 shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Create an Account</h2>
        <form className="space-y-4  text-gray-900 text-lg">
          <div>
            <label htmlFor="username" className="block mb-1">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block t mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block  mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-200"
          >
            Register
          </button>
        </form>
        <button onClick={() => navigate('/Auth/login')}>
            Already have an account? Login
        </button>
      </div>
  );
};

export default RegisterView;

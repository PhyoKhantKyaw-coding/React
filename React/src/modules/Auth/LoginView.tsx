import React from "react";
import { useNavigate } from "react-router-dom";

const LoginView = () => {
  const navigate = useNavigate();
  return (
      <div className="bg-gradient-to-r from-blue-400 to-green-400 shadow-xl rounded-4xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Welcome Back
        </h2>
        <form className="space-y-4  text-gray-900 sm:text-1xl">
          <div>
            <label
              className="block  mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              className="block  mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-black hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <button onClick={() => navigate("/Auth/register")}>
          Don't have an account? Register
        </button>
      </div>
  );
};

export default LoginView;

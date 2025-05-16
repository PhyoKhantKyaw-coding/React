import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openLoader, hideLoader } from "@/store/features/LoaderSlice";
import api from "@/api";
import Loader from "@/components/Loader";

const LoginView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = api.login.login.useMutation({
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("token", data.data);
      // Navigate to dashboard
      navigate("/");
    },
    onError: (err: Error) => {
      setError(err.message || "Login failed");
    },
  });

  useEffect(() => {
    if (isPending) {
      dispatch(openLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isPending, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutate({ email, password });
  };

  return (
    <>
      <Loader />
      <div className="bg-gradient-to-r from-blue-400 to-green-400 shadow-xl rounded-4xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Welcome Back
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4 text-gray-900 sm:text-1xl" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        <button onClick={() => navigate("/Auth/register")} className="text-black hover:underline">
          Don't have an account? Register
        </button>
      </div>
    </>
  );
};

export default LoginView;
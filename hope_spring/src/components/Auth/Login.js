import React from "react";
import { Link } from "react-router-dom";
import HopeSpringLogo from "../../Assets/HopeSpring_Logo.svg"

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7f5fb] to-[#f3f0fa] px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 w-full max-w-md sm:max-w-lg md:max-w-xl text-center transition-all duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <img
            src={HopeSpringLogo }
            alt="HopeSpring Logo"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain mx-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#7c6cf2] to-[#a88ff0] bg-clip-text text-transparent mb-1">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-8">
          "Empowering hope through connection"
        </p>

        {/* Form */}
        <form className="text-left space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 sm:px-5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88ff0] text-gray-700 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 sm:px-5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88ff0] text-gray-700 text-sm sm:text-base"
            />
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-[#9b87f5] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#8c7cf0] text-white font-semibold py-2 sm:py-3 rounded-lg text-sm sm:text-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 sm:mt-10 border-t pt-4 sm:pt-5 text-sm sm:text-base text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#9b87f5] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

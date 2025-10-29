import React from "react";
import { Link } from "react-router-dom";
import HopeSpringLogo from "../../Assets/HopeSpring_Logo.svg"; // ✅ correct path

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7f5fb] to-[#f3f0fa] px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 w-full max-w-md sm:max-w-lg md:max-w-xl text-center transition-all duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <img
            src={HopeSpringLogo}
            alt="HopeSpring Logo"
            className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#7c6cf2] to-[#a88ff0] bg-clip-text text-transparent mb-1">
          Join HopeSpring
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-8">
          "Together, we create strength and support"
        </p>

        {/* Form */}
        <form className="text-left space-y-5 sm:space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 sm:px-5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88ff0] text-gray-700 text-sm sm:text-base"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 sm:px-5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88ff0] text-gray-700 text-sm sm:text-base"
            />
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <select
              className="w-full px-4 py-2 sm:px-5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88ff0] text-gray-700 text-sm sm:text-base"
              defaultValue=""
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="member">Member</option>
              <option value="volunteer">Volunteer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#67c6c6] hover:bg-[#5ab7b7] text-white font-semibold py-2 sm:py-3 rounded-lg text-sm sm:text-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 sm:mt-10 border-t pt-4 sm:pt-5 text-sm sm:text-base text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#9b87f5] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

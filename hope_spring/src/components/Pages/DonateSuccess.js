// src/pages/DonateSuccess.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const DonateSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-[#0b1c33]">
          Thank you for your donation!
        </h1>
        <p className="mt-2 text-gray-600">
          Your support helps ensure no one faces cancer alone.
        </p>
        {sessionId && (
          <p className="mt-2 text-xs text-gray-400">
            Payment reference: {sessionId}
          </p>
        )}
        <Link
          to="/"
          className="mt-4 inline-block rounded-xl bg-[#0e2340] text-white px-5 py-2.5 text-sm font-semibold hover:brightness-110"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default DonateSuccess;

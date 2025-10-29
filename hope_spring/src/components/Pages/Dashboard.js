import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f5fb] to-[#f3f0fa] py-10 px-6 sm:px-12 lg:px-24">
      {/* Welcome Section */}
      <section className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 mb-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#8c7cf0] mb-2">
          Welcome, Aman!
        </h2>
        <p className="text-gray-600 text-base mb-2">
          You are logged in as <span className="font-semibold text-[#5f57d3]">Staff</span>
        </p>
        <p className="italic text-gray-500 text-sm sm:text-base">
          "Every day is a new beginning. Take a deep breath, smile, and start again."
        </p>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-gray-600 text-sm mb-2">Upcoming Sessions</h3>
          <p className="text-3xl font-bold text-[#7c6cf2]">3</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-gray-600 text-sm mb-2">Programs Enrolled</h3>
          <p className="text-3xl font-bold text-[#67c6c6]">2</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-gray-600 text-sm mb-2">Community Members</h3>
          <p className="text-3xl font-bold text-[#9b87f5]">127</p>
        </div>
      </section>

      {/* Action Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book a Session */}
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Book a Session
            </h3>
            <p className="text-gray-600 mb-4">
              Schedule your next support session or wellness program.
            </p>
          </div>
          <button className="self-start bg-[#9b87f5] hover:bg-[#8c7cf0] text-white font-semibold px-5 py-2 rounded-lg text-sm transition duration-200 shadow-md hover:shadow-lg">
            View Calendar
          </button>
        </div>

        {/* Support Programs */}
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Support Programs
            </h3>
            <p className="text-gray-600 mb-4">
              Explore our comprehensive support and wellness programs.
            </p>
          </div>
          <button className="self-start bg-[#67c6c6] hover:bg-[#5ab7b7] text-white font-semibold px-5 py-2 rounded-lg text-sm transition duration-200 shadow-md hover:shadow-lg">
            Browse Programs
          </button>
        </div>

        {/* Community */}
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Community
            </h3>
            <p className="text-gray-600 mb-4">
              Connect with others on similar journeys.
            </p>
          </div>
          <button className="self-start bg-[#9b87f5] hover:bg-[#8c7cf0] text-white font-semibold px-5 py-2 rounded-lg text-sm transition duration-200 shadow-md hover:shadow-lg">
            Join Discussion
          </button>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Resources
            </h3>
            <p className="text-gray-600 mb-4">
              Access helpful resources and educational materials.
            </p>
          </div>
          <button className="self-start bg-[#a0e4e4] hover:bg-[#90d6d6] text-[#045a5a] font-semibold px-5 py-2 rounded-lg text-sm transition duration-200 shadow-md hover:shadow-lg">
            View Resources
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

import { Calendar, LogOut } from 'lucide-react';

const UserHeader = ({ name, onBook, onLogout }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Welcome back, {name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your wellness journey
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBook}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-500 transition-all shadow-md hover:shadow-lg"
            aria-label="Book a new program"
          >
            <Calendar className="w-5 h-5" />
            Book New Program
          </button>
          
          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Logout from dashboard"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;

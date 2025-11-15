import { Calendar, Clock, MapPin, User, Eye } from 'lucide-react';

const MyPrograms = ({ programs }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Programs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {program.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  program.status === 'upcoming'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {program.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{program.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{program.time}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{program.instructor}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{program.location}</span>
              </div>
            </div>
            
            <button
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              aria-label={`View details for ${program.title}`}
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyPrograms;

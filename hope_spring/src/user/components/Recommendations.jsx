import { Plus, Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';

const Recommendations = ({ recommendations, onAdd }) => {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {recommendation.title}
              </h3>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                {recommendation.category}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{recommendation.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{recommendation.time}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{recommendation.instructor}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{recommendation.location}</span>
              </div>
            </div>
            
            <button
              onClick={() => onAdd(recommendation)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-500 transition-all shadow-sm hover:shadow-md"
              aria-label={`Add ${recommendation.title} to your programs`}
            >
              <Plus className="w-4 h-4" />
              Add to My Programs
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Recommendations;

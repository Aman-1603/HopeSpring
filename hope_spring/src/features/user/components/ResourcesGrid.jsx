import { Apple, Headphones, Users, ArrowRight } from 'lucide-react';

const iconMap = {
  apple: Apple,
  headphones: Headphones,
  users: Users
};

const ResourcesGrid = ({ resources }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const IconComponent = iconMap[resource.icon] || Users;
          
          return (
            <a
              key={resource.id}
              href={resource.link}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-indigo-300 transition-all"
              aria-label={`Access ${resource.title}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {resource.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {resource.description}
              </p>
              
              <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
                Access Now
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default ResourcesGrid;

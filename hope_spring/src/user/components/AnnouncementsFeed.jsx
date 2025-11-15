import { Megaphone, ExternalLink, Calendar } from 'lucide-react';

const AnnouncementsFeed = ({ announcements }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Announcements</h2>
      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {announcement.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    {announcement.date}
                  </div>
                </div>
                
                <p className="mt-2 text-gray-600">
                  {announcement.description}
                </p>
                
                {announcement.link && (
                  <a
                    href={announcement.link}
                    className="mt-3 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    aria-label={`Learn more about ${announcement.title}`}
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnnouncementsFeed;

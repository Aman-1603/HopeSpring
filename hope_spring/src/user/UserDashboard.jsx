import { useState } from 'react';
import UserHeader from './components/UserHeader';
import MyPrograms from './components/MyPrograms';
import AnnouncementsFeed from './components/AnnouncementsFeed';
import Recommendations from './components/Recommendations';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UserDashboard = () => {
  const navigate = useNavigate();

  // Mock user
  const user = { name: 'Guest User' };

  // Mock data
  const [programs] = useState([
    {
      id: 1,
      title: 'Yoga & Meditation',
      date: '2024-01-20',
      time: '10:00 AM',
      instructor: 'Sarah Johnson',
      location: 'Room 101',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Art Therapy Workshop',
      date: '2024-01-22',
      time: '2:00 PM',
      instructor: 'Michael Chen',
      location: 'Studio A',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Support Group Session',
      date: '2024-01-18',
      time: '6:00 PM',
      instructor: 'Dr. Emily Roberts',
      location: 'Conference Room',
      status: 'completed'
    }
  ]);

  const [announcements] = useState([
    {
      id: 1,
      title: 'New Wellness Program Launching',
      description: 'Join our new holistic wellness program starting next month. Limited spots available!',
      link: '/programs',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Community Fundraiser Event',
      description: 'Help us raise funds for our community support initiatives. Every contribution counts.',
      link: null,
      date: '2024-01-12'
    },
    {
      id: 3,
      title: 'Updated Support Resources',
      description: 'We\'ve added new meditation guides and nutrition plans to our resources library.',
      link: '/resources',
      date: '2024-01-10'
    }
  ]);

  const [recommendations] = useState([
    {
      id: 4,
      title: 'Mindfulness Workshop',
      category: 'Wellness',
      date: '2024-01-25',
      time: '3:00 PM',
      instructor: 'Lisa Anderson',
      location: 'Wellness Center'
    },
    {
      id: 5,
      title: 'Cooking Class',
      category: 'Nutrition',
      date: '2024-01-28',
      time: '11:00 AM',
      instructor: 'Chef David Martinez',
      location: 'Kitchen Studio'
    },
    {
      id: 6,
      title: 'Dance Therapy',
      category: 'Movement',
      date: '2024-01-30',
      time: '4:00 PM',
      instructor: 'Amanda Green',
      location: 'Dance Studio'
    }
  ]);

  const handleBookProgram = () => {
    navigate('/programs');
  };

  const handleLogout = () => {
    toast.info('Logout functionality disabled in demo view.');
  };

  const handleAddRecommendation = (recommendation) => {
    toast.success(`Added "${recommendation.title}" to your programs!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserHeader 
          name={user.name}
          onBook={handleBookProgram}
          onLogout={handleLogout}
        />
        
        <div className="mt-8 space-y-8">
          <MyPrograms programs={programs} />
          <AnnouncementsFeed announcements={announcements} />
          <Recommendations 
            recommendations={recommendations}
            onAdd={handleAddRecommendation}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

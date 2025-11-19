import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import hopespringLogo from '@/assets/hopespring-logo.png';

const UserSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Profile', path: '/user-dashboard', icon: LayoutDashboard },
    { name: 'Past Sessions', path: '/user-dashboard/past-sessions', icon: Clock },
    { name: 'My Orders', path: '/user-dashboard/orders', icon: ShoppingBag },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-card to-muted/30 border-r border-border/50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <img src={hopespringLogo} alt="HopeSpring" className="h-10 w-10" />
              <div>
                <h1 className="text-lg font-bold text-foreground">HopeSpring</h1>
                <p className="text-xs text-muted-foreground">Member Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/user-dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border/50">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;

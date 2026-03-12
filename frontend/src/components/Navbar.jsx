import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Network, Search, MessageSquare, PlusCircle, LogOut, User, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Lightbulb size={20} /> },
    { name: 'Explore', path: '/explore', icon: <Search size={20} /> },
    { name: 'Evolution Graph', path: '/graph', icon: <Network size={20} /> },
    { name: 'Alumni', path: '/alumni', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Community', path: '/community', icon: <MessageSquare size={20} /> },
  ];

  if (currentUser) {
    navItems.splice(2, 0, { name: 'Submit Idea', path: '/submit', icon: <PlusCircle size={20} /> });
  }

  const bottomNavItems = [...navItems];
  if (currentUser) {
    bottomNavItems.push({ name: 'Profile', path: '/profile', icon: <User size={20} /> });
  }

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-card rounded-none border-t-0 shadow-sm border-x-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-gradient-to-tr from-indigo-500 to-cyan-400 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
                  <Lightbulb size={24} />
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 hidden xs:block">
                  CampusIdeaHub
                </span>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 block xs:hidden">
                  IdeaHub
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
                      isActive ? 'text-indigo-700 font-semibold' : 'text-slate-600 hover:text-indigo-500 hover:bg-indigo-50/50 font-medium'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-indigo-100/50 rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {item.icon}
                      <span className="text-sm">{item.name}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Profile / Logout Section (Top Right) */}
            <div className="flex items-center gap-4">
              {currentUser ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer group">
                    <img src={currentUser.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=c7d2fe&color=3730a3`} 
                        alt="Profile" className="w-8 h-8 rounded-full border-2 border-indigo-100 group-hover:border-indigo-300 transition-all"/>
                    <span className="hidden sm:inline" style={{display: 'inline-block'}}>Hi, {currentUser.name || currentUser.email.split('@')[0]}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors bg-slate-50 hover:bg-rose-50 p-2 rounded-xl">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="glass-button text-sm px-5 py-2 min-h-0 h-10 shadow-sm flex items-center rounded-xl">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (PWA Style) */}
      <div className="md:hidden fixed bottom-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-full h-full space-y-1"
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-indigo-700 font-bold' : 'text-slate-500'}`}>
                  {item.name.split(' ')[0]} {/* Shorten name for mobile */}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-[1px] w-12 h-[3px] bg-indigo-500 rounded-b-full shadow-[0_2px_8px_rgba(99,102,241,0.6)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

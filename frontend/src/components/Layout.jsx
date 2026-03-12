import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Search, PlusCircle, MessageSquare, Users, BarChart3, User, Settings, Menu, Bell, LogOut, Lightbulb } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch(err) {
      console.error(err);
    }
  }

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Explore Projects', path: '/explore', icon: <Search size={20} /> },
    { name: 'Submit Idea', path: '/submit', icon: <PlusCircle size={20} />, auth: true },
    { name: 'AI Idea Suggestions', path: '/ai-assistant', icon: <Lightbulb size={20} />, auth: true },
    { name: 'Community', path: '/community', icon: <MessageSquare size={20} /> },
    { name: 'Alumni Connect', path: '/alumni', icon: <Users size={20} /> },
    { name: 'Analytics Dashboard', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} />, auth: true },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, auth: true },
  ];

  const visibleItems = menuItems.filter(item => !item.auth || currentUser);

  const expanded = isMobile ? isSidebarOpen : (isSidebarOpen || isHovered);

  const sidebarVariants = {
    expanded: { width: 250 },
    collapsed: { width: 72 }
  };

  return (
    <div className="min-h-screen relative bg-slate-50/50 overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-900">
      <div className="absolute top-0 w-full h-full pointer-events-none -z-10 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-20 hidden"></div>
      
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] h-16 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4 w-1/3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-gradient-to-tr from-indigo-500 to-cyan-400 p-1.5 rounded-lg text-white shadow-md">
              <Lightbulb size={20} />
            </div>
            <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-600 hidden sm:block tracking-tight">
              CampusIdeaHub
            </span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center w-1/3 max-w-xl px-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects, domains, or alumni..." 
              className="w-full bg-slate-100 hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors rounded-xl py-2 pl-10 pr-4 text-sm font-semibold outline-none text-slate-700 border border-slate-200 focus:border-indigo-300 shadow-inner"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-4 w-1/3">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors relative hidden xs:block">
            <Bell size={20} />
            <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          {currentUser ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-1">
              <Link to="/profile" className="flex items-center gap-2 group cursor-pointer">
                <img src={currentUser.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=c7d2fe&color=3730a3`} 
                     alt="Profile" className="w-8 h-8 rounded-full border-2 border-indigo-100 group-hover:border-indigo-400 transition-all object-cover"/>
                <span className="hidden md:block text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{currentUser.name || currentUser.email.split('@')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-bold px-5 py-2 min-h-0 h-9 shadow-md hover:shadow-lg flex items-center rounded-xl transition-all ml-2">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Sidebar Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-30 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Left Sidebar */}
      <motion.aside
        initial={false}
        animate={expanded ? 'expanded' : 'collapsed'}
        variants={isMobile ? { expanded: { x: 0, width: 250 }, collapsed: { x: '-100%', width: 250 } } : sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] z-30 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl flex flex-col`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden no-scrollbar">
          {visibleItems.map(item => {
            const isActive = location.pathname === item.path;
            const isSettings = item.name === 'Settings';
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                className={`relative flex items-center gap-4 px-3 py-3 rounded-xl transition-all group ${
                  isActive ? 'text-indigo-700 bg-indigo-50 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                } ${isSettings ? 'mt-auto mb-4' : ''}`}
                title={expanded ? "" : item.name}
              >
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-md" />
                )}
                <div className={`shrink-0 flex items-center justify-center ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}>
                  {item.icon}
                </div>
                <AnimatePresence>
                  {(expanded || isMobile) && (
                    <motion.span 
                      initial={isMobile ? false : { opacity: 0, width: 0 }} 
                      animate={isMobile ? false : { opacity: 1, width: 'auto' }} 
                      exit={isMobile ? false : { opacity: 0, width: 0 }} 
                      className={`font-semibold whitespace-nowrap text-sm ${isActive ? 'text-indigo-700' : ''}`}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${!isMobile ? 'pl-[72px]' : ''} pt-16 min-h-screen`}>
        {children}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaUserGraduate, 
  FaChalkboardTeacher,
  FaChartLine, 
  FaCog, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaUpload
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/Logo.jpg';
import Button from '../ui/Button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const studentItems = [
    { path: '/student', label: 'Dashboard', icon: <FaHome /> },
    { path: '/student/courses', label: 'My Courses', icon: <FaBook /> },
    { path: '/student/progress', label: 'Progress', icon: <FaChartLine /> },
  ];

  const teacherItems = [
    { path: '/teacher', label: 'Dashboard', icon: <FaHome /> },
    { path: '/teacher/courses', label: 'My Courses', icon: <FaBook /> },
    { path: '/teacher/courses/create', label: 'Create Course', icon: <FaChalkboardTeacher /> },
    { path: '/teacher/uploads', label: 'Uploads', icon: <FaUpload /> },
    { path: '/teacher/analytics', label: 'Analytics', icon: <FaChartLine /> },
  ];

  const commonItems = [
    { path: '/settings', label: 'Settings', icon: <FaCog /> },
  ];

  const navItems = [
    ...(isStudent ? studentItems : []),
    ...(isTeacher ? teacherItems : []),
    ...commonItems
  ];

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarVariants = {
    open: { width: '16rem' },
    closed: { width: '5rem' }
  };

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <FaTimes className="text-gray-700" /> : <FaBars className="text-gray-700" />}
      </button>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={collapsed ? 'closed' : 'open'}
        animate={collapsed ? 'closed' : 'open'}
        variants={sidebarVariants}
        transition={{ type: 'spring', damping: 25 }}
        className="hidden md:flex flex-col bg-white shadow-md z-40 h-screen fixed"
      >
        <div className={`flex items-center p-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center">
              <img src={Logo} alt="Learning Dashboard" className="h-10 mr-3" />
              <span className="font-bold text-xl whitespace-nowrap">LearnDash</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 hidden md:block"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center p-3 transition-colors rounded-lg mx-1 ${
                      isActive
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <FaUserGraduate className="text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Student'}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                collapsed ? 'justify-center' : ''
              }`}
              aria-label="Logout"
            >
              <FaSignOutAlt className="text-gray-700" />
              {!collapsed && <span className="ml-2 text-gray-700">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={toggleMobileSidebar}
            />
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileSidebarVariants}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <img src={Logo} alt="Learning Dashboard" className="h-10 mr-3" />
                  <span className="font-bold text-xl">LearnDash</span>
                </div>
                <button 
                  onClick={toggleMobileSidebar}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => 
                          `flex items-center p-3 transition-colors rounded-lg ${
                            isActive
                              ? 'bg-purple-100 text-purple-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        onClick={toggleMobileSidebar}
                      >
                        <span className="text-lg mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <FaUserGraduate className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role || 'Student'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="text-gray-700" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const TopBanner = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications] = useState([
    { id: 1, message: 'New course added: Web Development Fundamentals', time: '2h ago' },
    { id: 2, message: 'Assignment due tomorrow: HTML/CSS Project', time: '1d ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search courses, lessons, or resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"
              >
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20"
                >
                  <div className="p-3 border-b">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-3 border-b hover:bg-gray-50">
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-gray-500 text-sm">No new notifications</p>
                    )}
                  </div>
                  <div className="p-2 bg-gray-50 text-center">
                    <button className="text-sm text-purple-600 hover:text-purple-800">
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="hidden md:block text-right">
                <p className="font-medium">{user?.name || 'Guest'}</p>
                <p className="text-xs text-gray-500">{user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : ''}</p>
              </div>
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
                <FaUserCircle className="text-gray-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBanner;
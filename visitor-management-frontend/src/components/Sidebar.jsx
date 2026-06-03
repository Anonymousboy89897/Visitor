import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaHome, 
  FaUserPlus, 
  FaUsers, 
  FaHistory, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';

const Sidebar = ({ onClose }) => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FaHome /> },
    { name: 'Add Visitor', path: '/add-visitor', icon: <FaUserPlus /> },
    { name: 'Active Visitors', path: '/active', icon: <FaUsers /> },
    { name: 'Visitor History', path: '/history', icon: <FaHistory /> },
    { name: 'Reports', path: '/reports', icon: <FaChartBar /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-full flex flex-col shadow-2xl relative z-20">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      {/* Mobile close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white md:hidden"
      >
        <FaTimes className="text-xl" />
      </button>

      <div className="p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">PVMS</h2>
        <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide uppercase">Paryatan Visitors</p>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300 hover:translate-x-1">
          <FaCog />
          <span>Settings</span>
        </button>
        <button 
          onClick={logout}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 hover:translate-x-1"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

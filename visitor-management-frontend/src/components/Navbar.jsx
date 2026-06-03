import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ title }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      
      <div className="flex items-center space-x-6">
        <button className="text-gray-500 hover:text-indigo-600 transition-colors">
          <FaBell className="text-xl" />
        </button>
        <div className="flex items-center space-x-2 cursor-pointer group">
          <FaUserCircle className="text-2xl text-gray-600 group-hover:text-indigo-600 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

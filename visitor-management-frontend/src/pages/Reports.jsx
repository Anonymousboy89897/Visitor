import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Reports = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Reports" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily & Monthly Reports</h2>
            <p className="text-gray-500">This section is under construction. It will feature detailed analytics and charts based on visitor data.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;

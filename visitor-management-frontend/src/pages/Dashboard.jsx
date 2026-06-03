import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { FaUsers, FaCheckCircle, FaClock, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalToday: 0,
    active: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('?action=getAll');
        
        const today = new Date().toISOString().split('T')[0];
        
        const totalToday = data.filter(v => v.check_in.startsWith(today)).length;
        const active = data.filter(v => v.status === 'Active').length;
        const completed = data.filter(v => v.status === 'Completed').length;
        
        setStats({ totalToday, active, completed });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { 
      title: 'Total Visitors Today', 
      value: stats.totalToday, 
      icon: <FaUsers className="text-white text-3xl" />, 
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-200'
    },
    { 
      title: 'Active Visitors', 
      value: stats.active, 
      icon: <FaClock className="text-white text-3xl" />, 
      gradient: 'from-orange-400 to-red-500',
      shadow: 'shadow-orange-200'
    },
    { 
      title: 'Completed Visits', 
      value: stats.completed, 
      icon: <FaCheckCircle className="text-white text-3xl" />, 
      gradient: 'from-emerald-400 to-teal-500',
      shadow: 'shadow-teal-200'
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Dashboard" />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Paryatan Visitors Dashboard
                </h2>
                <p className="text-slate-500 mt-2 font-medium">Monitor daily visitor traffic and track active check-ins in real-time.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {cards.map((card, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white border border-slate-100 group">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-10 group-hover:scale-150 transition-transform duration-500 ease-in-out pointer-events-none" />
                    <div className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{card.title}</p>
                          <h3 className="text-5xl font-black text-slate-800 tracking-tight">{card.value}</h3>
                        </div>
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg ${card.shadow}`}>
                          {card.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800">Quick Overview</h3>
                  <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All Reports &rarr;</button>
                </div>
                <div className="h-80 w-full rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="h-20 w-20 bg-white rounded-2xl shadow-lg shadow-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-bold text-lg">Interactive charts coming soon</p>
                  <p className="text-slate-400 font-medium mt-2">Beautiful Recharts data visualizations will be integrated here.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

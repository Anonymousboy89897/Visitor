import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

import { FaSignOutAlt, FaSearch } from 'react-icons/fa';

const ActiveVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchActiveVisitors = async () => {
    try {
      const baseUrl = 'https://script.google.com/macros/s/AKfycbzJnb5479droeVA_qkIiD7lV0sxbjjAyDUpKOioTKSMIXmj9PI0hBeoDnLTuq8AAUjcZg/exec';
      const response = await fetch(`${baseUrl}?action=getActive&t=${new Date().getTime()}`);
      const data = await response.json();
      
      // Convert Apps Script object response {"0": {...}, "1": {...}, "status": 200} to an array
      const visitorsArray = Array.isArray(data) 
        ? data 
        : Object.keys(data)
            .filter(key => key !== 'status' && typeof data[key] === 'object')
            .map(key => data[key]);
        
      setVisitors(visitorsArray);
    } catch (error) {
      console.error('Failed to fetch active visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveVisitors();
  }, []);

  const handleCheckout = async (id) => {
    if (window.confirm('Are you sure you want to checkout this visitor?')) {
      try {
        const baseUrl = 'https://script.google.com/macros/s/AKfycbzJnb5479droeVA_qkIiD7lV0sxbjjAyDUpKOioTKSMIXmj9PI0hBeoDnLTuq8AAUjcZg/exec';
        await fetch(`${baseUrl}?action=checkout&id=${id}&t=${new Date().getTime()}`);
        fetchActiveVisitors();
      } catch (error) {
        alert('Failed to checkout visitor: ' + error.message);
      }
    }
  };

  const filteredVisitors = visitors.filter(v => 
    v.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    v.phone?.includes(search)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Active Visitors" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaSearch />
              </span>
              <input 
                type="text" 
                placeholder="Search by name or phone..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
            {loading ? (
              <div className="p-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Visitor ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name & Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Host & Dept</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Check In Time</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredVisitors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium">No active visitors right now.</td>
                    </tr>
                  ) : (
                    filteredVisitors.map((visitor) => (
                      <tr key={visitor.visitor_id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{visitor.visitor_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="font-bold text-slate-800">{visitor.full_name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{visitor.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{visitor.purpose}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <div className="font-medium">{visitor.person_to_meet}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{visitor.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{visitor.check_in}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleCheckout(visitor.visitor_id)}
                            className="bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all font-bold py-1.5 px-4 rounded-lg shadow-sm"
                          >
                            Checkout
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActiveVisitors;

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

import { FaSearch, FaTrash, FaDownload } from 'react-icons/fa';

const VisitorHistory = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchVisitors = async () => {
    try {
      const baseUrl = 'https://script.google.com/macros/s/AKfycbzJnb5479droeVA_qkIiD7lV0sxbjjAyDUpKOioTKSMIXmj9PI0hBeoDnLTuq8AAUjcZg/exec';
      const response = await fetch(`${baseUrl}?action=getAll&t=${new Date().getTime()}`);
      const data = await response.json();
      
      // Convert Apps Script object response to an array
      const visitorsArray = Array.isArray(data) 
        ? data 
        : Object.keys(data)
            .filter(key => key !== 'status' && typeof data[key] === 'object')
            .map(key => data[key]);
        
      setVisitors(visitorsArray.reverse()); // Show newest first
    } catch (error) {
      console.error('Failed to fetch visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const baseUrl = 'https://script.google.com/macros/s/AKfycbzJnb5479droeVA_qkIiD7lV0sxbjjAyDUpKOioTKSMIXmj9PI0hBeoDnLTuq8AAUjcZg/exec';
        await fetch(`${baseUrl}?action=delete&id=${id}&t=${new Date().getTime()}`);
        fetchVisitors();
      } catch (error) {
        alert('Failed to delete visitor: ' + error.message);
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
        <Navbar title="Visitor History" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Visitor History
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Complete log of all past and present visitor records.</p>
            </div>
            <div className="flex gap-4">
              <div className="relative w-72">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <FaSearch />
                </span>
                <input 
                  type="text" 
                  placeholder="Search history..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none shadow-sm transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5 transition-all duration-200">
                <FaDownload />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            {loading ? (
              <div className="p-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name & Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Host</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Check Out Time</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredVisitors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium">No visitors found.</td>
                    </tr>
                  ) : (
                    filteredVisitors.map((visitor) => (
                      <tr key={visitor.visitor_id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{visitor.created_at?.split(' ')[0] || visitor.check_in?.split(' ')[0]}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="font-bold text-slate-800">{visitor.full_name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{visitor.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{visitor.person_to_meet}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                            visitor.status === 'Active' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {visitor.status || 'Completed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{visitor.check_out || '--'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleDelete(visitor.visitor_id)}
                            className="bg-white border border-red-200 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all font-bold p-2.5 rounded-lg shadow-sm"
                          >
                            <FaTrash />
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

export default VisitorHistory;

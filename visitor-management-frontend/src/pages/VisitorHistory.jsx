import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaDownload } from 'react-icons/fa';

const VisitorHistory = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDate, setFilterDate] = useState('');

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

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.full_name?.toLowerCase().includes(search.toLowerCase()) || v.phone?.includes(search);
    
    let matchesMonth = true;
    let matchesDate = true;
    
    const recordDateStr = v.created_at || v.check_in;
    
    if (recordDateStr) {
      const recordDate = new Date(recordDateStr);
      // Check if it's a valid date
      if (!isNaN(recordDate.getTime())) {
        if (filterMonth) {
          const recordMonth = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
          matchesMonth = recordMonth === filterMonth;
        }
        
        if (filterDate) {
          const recordDay = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}-${String(recordDate.getDate()).padStart(2, '0')}`;
          matchesDate = recordDay === filterDate;
        }
      }
    } else {
      if (filterMonth || filterDate) return false;
    }

    return matchesSearch && matchesMonth && matchesDate;
  });

  const exportToExcel = () => {
    if (filteredVisitors.length === 0) {
      alert("No data to export");
      return;
    }
    
    const headers = ['Visitor ID', 'Date', 'Full Name', 'Phone', 'Email', 'Purpose', 'Person to Meet', 'Person Name / Dept', 'ID Type', 'ID Number', 'Vehicle', 'Status', 'Check In', 'Check Out'];
    
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    filteredVisitors.forEach(v => {
      const row = [
        v.visitor_id || '',
        v.created_at?.split(' ')[0] || v.check_in?.split(' ')[0] || '',
        `"${v.full_name || ''}"`,
        `"${v.phone || ''}"`,
        `"${v.email || ''}"`,
        `"${v.purpose || ''}"`,
        `"${v.person_to_meet || ''}"`,
        `"${v.department || ''}"`,
        `"${v.idType || ''}"`,
        `"${v.idNumber || ''}"`,
        `"${v.vehicleNumber || ''}"`,
        v.status || '',
        `"${v.check_in || ''}"`,
        `"${v.check_out || ''}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Visitor_Log_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Visitor History
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Complete log of all past and present visitor records.</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-4">
                <div className="relative w-72">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <FaSearch />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search name or phone..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none shadow-sm transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={exportToExcel}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FaDownload />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Month:</label>
                <input 
                  type="month" 
                  value={filterMonth}
                  onChange={(e) => { setFilterMonth(e.target.value); setFilterDate(''); }}
                  className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500 text-slate-700 font-medium"
                />
                
                <span className="text-slate-300">|</span>
                
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Day:</label>
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => { setFilterDate(e.target.value); setFilterMonth(''); }}
                  className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500 text-slate-700 font-medium"
                />

                {(filterMonth || filterDate) && (
                  <button 
                    onClick={() => { setFilterMonth(''); setFilterDate(''); }}
                    className="ml-2 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-md transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            {loading ? (
              <div className="p-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
            </div>
            )}
          </div>
    </>
  );
};

export default VisitorHistory;

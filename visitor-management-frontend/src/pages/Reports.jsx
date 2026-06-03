import React, { useState, useEffect } from 'react';
import { FaDownload, FaChartLine, FaUsers, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6'];

const Reports = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchVisitors = async () => {
    try {
      const baseUrl = 'https://script.google.com/macros/s/AKfycbzJnb5479droeVA_qkIiD7lV0sxbjjAyDUpKOioTKSMIXmj9PI0hBeoDnLTuq8AAUjcZg/exec';
      const response = await fetch(`${baseUrl}?action=getAll&t=${new Date().getTime()}`);
      const data = await response.json();
      
      const visitorsArray = Array.isArray(data) 
        ? data 
        : Object.keys(data).filter(key => key !== 'status' && typeof data[key] === 'object').map(key => data[key]);
        
      setVisitors(visitorsArray);
    } catch (error) {
      console.error('Failed to fetch visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const filteredVisitors = visitors.filter(v => {
    let matchesMonth = true;
    let matchesDate = true;
    
    const recordDateStr = v.created_at || v.check_in;
    if (recordDateStr) {
      const recordDate = new Date(recordDateStr);
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
    return matchesMonth && matchesDate;
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
    link.setAttribute('download', `Analytics_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalInPeriod = filteredVisitors.length;
  
  const purposeCounts = {};
  filteredVisitors.forEach(v => {
    if (v.purpose) {
      purposeCounts[v.purpose] = (purposeCounts[v.purpose] || 0) + 1;
    }
  });
  const mostCommonPurpose = Object.keys(purposeCounts).sort((a,b) => purposeCounts[b] - purposeCounts[a])[0] || 'N/A';

  const chartData = [];
  if (filterDate) {
    // If a specific day is selected, show Visitors by Purpose
    Object.keys(purposeCounts).forEach(key => {
      chartData.push({ name: key, visitors: purposeCounts[key] });
    });
    chartData.sort((a,b) => b.visitors - a.visitors);
  } else {
    // Otherwise, show Month-wise visitors
    const monthMap = {};
    filteredVisitors.forEach(v => {
      const recordDateStr = v.created_at?.split(' ')[0] || v.check_in?.split(' ')[0];
      if (recordDateStr) {
        // Extract YYYY-MM
        const yearMonth = recordDateStr.substring(0, 7);
        monthMap[yearMonth] = (monthMap[yearMonth] || 0) + 1;
      }
    });
    
    Object.keys(monthMap).sort().forEach(key => {
      // Create a readable label like "Jan 2026"
      const dateObj = new Date(key + "-01T00:00:00");
      const monthLabel = !isNaN(dateObj.getTime()) 
        ? dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : key;
      chartData.push({ name: monthLabel, visitors: monthMap[key] });
    });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 tracking-tight">
            Analytics & Reports
          </h2>
          <p className="text-slate-500 mt-2 font-medium text-lg">Generate summaries and export custom reports.</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Month:</label>
            <input 
              type="month" 
              value={filterMonth}
              onChange={(e) => { setFilterMonth(e.target.value); setFilterDate(''); }}
              className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 text-slate-700 font-medium"
            />
            
            <span className="text-slate-300 mx-1">|</span>
            
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Day:</label>
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => { setFilterDate(e.target.value); setFilterMonth(''); }}
              className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 text-slate-700 font-medium"
            />

            {(filterMonth || filterDate) && (
              <button 
                onClick={() => { setFilterMonth(''); setFilterDate(''); }}
                className="ml-3 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          <button 
            onClick={exportToExcel}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <FaDownload />
            <span>Download Report (CSV)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Visitors</p>
                <h3 className="text-4xl font-black text-slate-800">{totalInPeriod}</h3>
                <p className="text-xs font-medium text-slate-400 mt-2">In selected period</p>
              </div>
              <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <FaUsers className="text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Most Common Purpose</p>
                <h3 className="text-2xl font-black text-slate-800 truncate max-w-[150px]">{mostCommonPurpose}</h3>
                <p className="text-xs font-medium text-slate-400 mt-2">In selected period</p>
              </div>
              <div className="h-16 w-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                <FaBriefcase className="text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Visitors / Day</p>
                <h3 className="text-4xl font-black text-slate-800">
                  {filterMonth ? Math.round((totalInPeriod / 30) * 10) / 10 : (filterDate ? totalInPeriod : Math.round((totalInPeriod / Math.max(1, Math.ceil((new Date() - new Date(visitors[0]?.created_at || new Date())) / (1000 * 60 * 60 * 24)))) * 10) / 10 || 0)}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-2">Estimated average</p>
              </div>
              <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <FaChartLine className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative mt-8">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <FaChartLine className="text-indigo-400" /> 
                {filterDate ? 'Visitors by Purpose (Daily Distribution)' : 'Monthly Visitors (Paryatan NGO)'}
              </h3>
            </div>
            <div className="p-6">
              {chartData.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                        dy={10}
                      />
                      <YAxis 
                        allowDecimals={false} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                        dx={-10}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }} 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="visitors" radius={[6, 6, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-slate-500 font-medium">
                  No data to display on chart
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddVisitor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    purpose: '',
    personToMeet: '',
    department: '',
    idType: 'Aadhar',
    idNumber: '',
    vehicleNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Explicit browser alert for debugging
    alert('Register Visitor button clicked! Attempting to save...');
    
    // Fallback URL in case api.js has issues
    const baseUrl = 'https://script.google.com/macros/s/AKfycbzJnb5479droeVA_qkIiD7lV0sxbjjAyDUpKOioTKSMIXmj9PI0hBeoDnLTuq8AAUjcZg/exec';
    
    setLoading(true);
    setMessage('Sending data to Google Sheets...');
    
    try {
      const targetUrl = `${baseUrl}?action=add&payload=${encodeURIComponent(JSON.stringify(formData))}&t=${new Date().getTime()}`;
      
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const responseData = await response.json();
      
      if (responseData && (responseData.status === 201 || responseData.status === 200 || responseData.message === 'Visitor Added Successfully')) {
        setMessage('Visitor added successfully! Redirecting...');
        setTimeout(() => navigate('/active'), 1500);
      } else {
        setMessage(responseData?.message || 'Error saving to spreadsheet. Please check backend.');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setMessage(`Network error: ${error.message}. (Browser might be blocking the request)`);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Register New Visitor
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Enter visitor details to generate a new check-in record.</p>
            </div>
            
            {message && (
              <div className={`mb-6 p-4 rounded-xl shadow-sm ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                    <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Purpose of Visit *</label>
                    <select required name="purpose" value={formData.purpose} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all">
                      <option value="">Select Purpose</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Internship">Internship</option>
                      <option value="Personal work">Personal work</option>
                      <option value="Student related query">Student related query</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Person to Meet *</label>
                    <input required type="text" name="personToMeet" value={formData.personToMeet} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Department *</label>
                    <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ID Type *</label>
                    <select required name="idType" value={formData.idType} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all">
                      <option value="Aadhar">Aadhar</option>
                      <option value="PAN">PAN</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Passport">Passport</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ID Number *</label>
                    <input required type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Number</label>
                    <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                  </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => navigate('/')} 
                    className="px-8 py-3.5 border-2 border-slate-200 text-slate-600 font-bold rounded-xl mr-4 hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? 'Saving...' : 'Register Visitor'}
                  </button>
                </div>
              </form>
            </div>
      </div>
    </>
  );
};

export default AddVisitor;

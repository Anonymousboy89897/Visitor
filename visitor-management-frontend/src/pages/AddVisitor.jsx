import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaPhone, FaEnvelope, FaBuilding, 
  FaIdCard, FaCar, FaBriefcase, FaIdBadge
} from 'react-icons/fa';

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
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 tracking-tight">
              Register Visitor
            </h2>
            <p className="text-slate-500 mt-2 font-medium text-lg">Securely check-in a new guest to the premises.</p>
          </div>
        </div>
        
        {message && (
          <div className={`mb-8 p-5 rounded-2xl shadow-sm flex items-center gap-3 ${message.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <div className={`p-2 rounded-full ${message.includes('success') ? 'bg-emerald-200' : 'bg-red-200'}`}>
              {message.includes('success') ? <FaIdBadge /> : <FaIdCard />}
            </div>
            <p className="font-bold">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Section 1: Personal Details */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-8 border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-200/40 transition-all duration-300">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FaUser /></span>
                Personal Information
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaUser /></span>
                    <input required minLength="2" type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" placeholder="John Doe" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaPhone /></span>
                      <input required type="tel" pattern="[0-9]{10}" maxLength="10" minLength="10" title="Please enter exactly 10 digits" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" placeholder="9876543210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaEnvelope /></span>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" placeholder="john@example.com" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ID Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaIdCard /></span>
                      <select required name="idType" value={formData.idType} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all appearance-none">
                        <option value="Aadhar">Aadhar Card</option>
                        <option value="PAN">PAN Card</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Passport">Passport</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ID Number <span className="text-red-500">*</span></label>
                    <input required minLength="4" type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all font-mono" placeholder="XXXX-XXXX-XXXX" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Visit Details */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-8 border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-pink-200/40 transition-all duration-300">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-pink-500 to-orange-400"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="p-2 bg-pink-50 text-pink-600 rounded-lg"><FaBuilding /></span>
                Visit Details
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Purpose of Visit <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaBriefcase /></span>
                    <select required name="purpose" value={formData.purpose} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all appearance-none">
                      <option value="">Select Purpose...</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Internship">Internship</option>
                      <option value="Personal work">Personal work</option>
                      <option value="Student related query">Student related query</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Person to Meet <span className="text-red-500">*</span></label>
                    <input required minLength="2" type="text" name="personToMeet" value={formData.personToMeet} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all" placeholder="Host Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Person Name <span className="text-red-500">*</span></label>
                    <input required minLength="2" type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all" placeholder="Host's Full Name" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Number (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaCar /></span>
                    <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all font-mono uppercase" placeholder="UP 16 XX 0000" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-10">
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="w-full sm:w-auto px-8 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Generate Entry Pass'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddVisitor;

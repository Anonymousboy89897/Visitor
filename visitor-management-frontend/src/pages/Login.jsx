import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaLock, FaUser } from "react-icons/fa";
// wait, FaLock, FaUser from react-icons/fa
import { FaLock as LockIcon, FaUser as UserIcon } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-md border border-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="text-center mb-10 mt-2">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-3 font-medium">Sign in to PVMS</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-6 relative">
            <label className="block text-slate-700 text-sm font-bold mb-2">Email Address</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <UserIcon />
              </span>
              <input
                type="email"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-8 relative">
            <label className="block text-slate-700 text-sm font-bold mb-2">Password</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <LockIcon />
              </span>
              <input
                type="password"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

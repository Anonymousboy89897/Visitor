import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Lazy loading pages for better performance could be added here
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AddVisitor from '../pages/AddVisitor';
import VisitorHistory from '../pages/VisitorHistory';
import ActiveVisitors from '../pages/ActiveVisitors';
import Reports from '../pages/Reports';
import NotFound from '../pages/NotFound';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/add-visitor" element={<PrivateRoute><AddVisitor /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><VisitorHistory /></PrivateRoute>} />
      <Route path="/active" element={<PrivateRoute><ActiveVisitors /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

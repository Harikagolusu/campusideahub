import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from './StudentDashboard';
import FacultyDashboard from './FacultyDashboard';
import AdminDashboard from './AdminDashboard';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;

  const role = currentUser.role || 'student';

  if (role === 'faculty') return <FacultyDashboard />;
  if (role === 'admin') return <AdminDashboard />;
  
  return <StudentDashboard />;
}

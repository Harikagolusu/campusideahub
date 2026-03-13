import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Users, LayoutList, Shield, ShieldCheck, Tag } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/admin/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">Platform Management Overview</p>
        </div>
        <div className="px-4 py-1.5 bg-rose-50 text-rose-700 font-bold rounded-full text-sm border border-rose-100 flex items-center gap-2">
          ⚙️ Campus Admin
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Platform Analytics</h2>
      {loading ? (
        <div className="text-center text-slate-400 py-10">Loading Data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Cards */}
          <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform border-rose-50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-700">Total Users</h3>
              <span className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Users size={20} /></span>
            </div>
            <p className="text-4xl font-black text-rose-600">{stats?.total_users || 0}</p>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-700">Total Projects</h3>
              <span className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><LayoutList size={20} /></span>
            </div>
            <p className="text-4xl font-black text-slate-800">{stats?.total_projects || 0}</p>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-700">Verified Projects</h3>
              <span className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><ShieldCheck size={20} /></span>
            </div>
            <p className="text-4xl font-black text-slate-800">{stats?.verified_projects || 0}</p>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-700">Faculty Members</h3>
              <span className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Shield size={20} /></span>
            </div>
            <p className="text-4xl font-black text-slate-800">{stats?.total_faculty || 0}</p>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-700">Total Students</h3>
              <span className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Users size={20} /></span>
            </div>
            <p className="text-4xl font-black text-slate-800">{stats?.total_students || 0}</p>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform border-t-amber-100">
             <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-700">Active Domains</h3>
              <span className="p-2 bg-purple-50 text-purple-500 rounded-lg"><Tag size={20} /></span>
            </div>
            <p className="text-4xl font-black text-slate-800">{stats?.active_domains || 0}</p>
          </div>
        </div>
      )}
      
      <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 font-bold">
        Extended Admin features (User Data & Database Pruning Tools) unavailable in mock view.
      </div>
    </div>
  );
}

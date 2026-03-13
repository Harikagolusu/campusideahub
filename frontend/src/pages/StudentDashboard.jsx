import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, PlusCircle, Network, TrendingUp, Presentation, Users, Lightbulb } from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Student Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-sm border border-indigo-100 flex items-center gap-2">
          🎓 Student
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-700">My Ideas</h3>
            <span className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><Folder size={20} /></span>
          </div>
          <p className="text-4xl font-black text-slate-800">0</p>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-700">Projects Extended</h3>
            <span className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><Network size={20} /></span>
          </div>
          <p className="text-4xl font-black text-slate-800">0</p>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-700">Avg. Innovation Score</h3>
            <span className="p-2 bg-amber-50 text-amber-500 rounded-lg"><TrendingUp size={20} /></span>
          </div>
          <p className="text-4xl font-black text-slate-800">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/submit" className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-indigo-50 hover:border-indigo-100 text-slate-700 hover:text-indigo-700 transition-colors">
          <PlusCircle size={32} />
          <span className="font-bold text-sm">Submit New Idea</span>
        </Link>
        <Link to="/graph" className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-emerald-50 hover:border-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors">
          <Network size={32} />
          <span className="font-bold text-sm">Extend Idea via Graph</span>
        </Link>
        <Link to="/ai-assistant" className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-cyan-50 hover:border-cyan-100 text-slate-700 hover:text-cyan-700 transition-colors">
          <Lightbulb size={32} />
          <span className="font-bold text-sm">AI Idea Assistant</span>
        </Link>
        <Link to="/alumni" className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-purple-50 hover:border-purple-100 text-slate-700 hover:text-purple-700 transition-colors">
          <Users size={32} />
          <span className="font-bold text-sm">Alumni Connect</span>
        </Link>
      </div>
    </div>
  );
}

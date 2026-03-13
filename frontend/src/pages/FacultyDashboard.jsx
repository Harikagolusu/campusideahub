import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FileSearch, CheckCircle2, XCircle, FileClock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function FacultyDashboard() {
  const { currentUser } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ score: 50, comment: '', is_verified: false });

  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/projects/pending`);
      setPending(res.data.pending || []);
      setReviewedCount(res.data.reviewed_count || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const submitReview = async (pid) => {
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/projects/${pid}/review`, {
        ...reviewForm,
        faculty_name: currentUser.name
      });
      setPending(pending.filter(p => p._id !== pid));
      setReviewedCount(prev => prev + 1);
      setActiveReviewId(null);
      setReviewForm({ score: 50, comment: '', is_verified: false });
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Faculty Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, Prof. {currentUser?.name?.split(' ')[0]}</p>
        </div>
        <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-sm border border-emerald-100 flex items-center gap-2">
          🏛️ Faculty
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-700">Pending Reviews</h3>
            <span className="p-2 bg-amber-50 text-amber-500 rounded-lg"><FileClock size={20} /></span>
          </div>
          <p className="text-4xl font-black text-slate-800">{pending.length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-700">Projects Reviewed</h3>
            <span className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><CheckCircle2 size={20} /></span>
          </div>
          <p className="text-4xl font-black text-slate-800">{reviewedCount}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Pending Project Submissions</h2>
      {loading ? (
        <div className="flex justify-center items-center py-10">
           <FileSearch className="animate-spin text-indigo-400" size={32} />
        </div>
      ) : pending.length === 0 ? (
        <div className="text-center p-10 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 font-medium shadow-inner flex flex-col items-center gap-3">
          <CheckCircle2 size={40} className="text-emerald-400" />
          No projects awaiting review. You're all caught up!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pending.map(p => (
            <motion.div key={p._id} className="glass-card border-indigo-100 flex flex-col transition-colors p-6">
               <div className="flex justify-between items-start mb-2">
                 <Link to={`/project/${p._id}`} target="_blank" className="font-bold text-lg text-indigo-600 hover:text-indigo-800 line-clamp-1">{p.title}</Link>
                 <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase shrink-0">{p.domain}</span>
               </div>
               <p className="text-sm text-slate-500 line-clamp-3 mb-4">{p.description}</p>
               
               {activeReviewId === p._id ? (
                 <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-600 mb-1">Innovation Score (0-100)</label>
                     <input type="number" min="0" max="100" className="w-full glass-input" value={reviewForm.score} onChange={(e) => setReviewForm({...reviewForm, score: parseInt(e.target.value)})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-600 mb-1">Faculty Feedback</label>
                     <textarea className="w-full glass-input text-sm p-3 h-20" placeholder="Constructive feedback..." value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                   </div>
                   <label className="flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" checked={reviewForm.is_verified} onChange={(e) => setReviewForm({...reviewForm, is_verified: e.target.checked})} />
                     <span className="text-sm font-bold text-emerald-700">Grant "Faculty Verified" Badge</span>
                   </label>
                   <div className="flex gap-2">
                     <button onClick={() => setActiveReviewId(null)} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
                     <button onClick={() => submitReview(p._id)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                       <Send size={14}/> Submit
                     </button>
                   </div>
                 </div>
               ) : (
                 <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100">
                   <Link to={`/project/${p._id}`} target="_blank" className="flex-1 py-2 text-center text-sm font-semibold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors">View Project Details</Link>
                   <button onClick={() => setActiveReviewId(p._id)} className="flex-1 py-2 text-center text-sm font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl transition-colors">Grade Project</button>
                 </div>
               )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

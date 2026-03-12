import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science',
    year: '1'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        const userCred = await signup(formData.email, formData.password);
        // Save additional details to backend immediately
        const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/login`, {
          uid: userCred.user.uid,
          email: formData.email,
          name: formData.name,
          department: formData.department,
          year: formData.year
        });
        setCurrentUser({ ...userCred.user, ...res.data });
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 shadow-2xl border-indigo-100"
      >
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-500 mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm mb-4 font-medium border border-rose-100 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full glass-input" placeholder="e.g. Alice Dev" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} className="w-full glass-input bg-white">
                    <option>Computer Science</option>
                    <option>Electrical Eng</option>
                    <option>Mechanical Eng</option>
                    <option>Civil Eng</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Year</label>
                  <select name="year" value={formData.year} onChange={handleChange} className="w-full glass-input bg-white">
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full glass-input" placeholder="student@university.edu" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full glass-input" placeholder="••••••••" />
          </div>

          <button disabled={loading} type="submit" className="w-full glass-button flex justify-center items-center gap-2 h-12 text-lg shadow-lg mt-6 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white border-0">
            {isLogin ? <><LogIn size={20} /> Login</> : <><UserPlus size={20} /> Sign Up</>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-sm text-indigo-600 font-semibold hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

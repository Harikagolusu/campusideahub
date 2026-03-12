import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Save, Server, BookOpen, Lightbulb, ExternalLink, Activity } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AIAssistant() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: 'AI'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const domains = ['AI', 'Web', 'IoT', 'Cybersecurity', 'Cloud', 'App', 'Machine Learning', 'Other'];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetSuggestions = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/ideas/suggest`, formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to get suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToPlatform = async () => {
    setSaving(true);
    try {
      const newProject = {
        title: formData.title,
        description: formData.description + '\n\n' + (result?.suggestions?.length ? 'AI Recommendations:\n' + result.suggestions.join('\n') : ''),
        domain: formData.domain,
        tech_stack: result?.technologies ? result.technologies.join(', ') : '',
        keywords: [formData.domain.toLowerCase()],
        year: currentUser?.year || new Date().getFullYear().toString(),
        submitted_by: currentUser?.name || currentUser?.email?.split('@')[0] || 'Anonymous',
        extends_id: null
      };

      const res = await axios.post(`http://${window.location.hostname}:5000/api/projects`, newProject);
      navigate(`/project/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert('Error saving project idea.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-500 mb-4 tracking-tight">
          AI Project Idea Assistant
        </h1>
        <p className="text-slate-600 font-medium text-lg leading-relaxed">
          Validate and brainstorm your raw concepts. Provide an idea that isn't on the platform yet, and our AI mentor will structure it for you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.1 }}
          className={result ? 'lg:col-span-5' : 'lg:col-span-8 lg:col-start-3'}
        >
          <div className="glass-card p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Lightbulb size={120} />
            </div>
            
            <form onSubmit={handleGetSuggestions} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Project Idea Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  className="w-full glass-input shadow-inner font-medium" 
                  placeholder="e.g. Drone based delivery"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Project Description</label>
                <textarea 
                  name="description"
                  required
                  className="w-full glass-input min-h-[160px] resize-none shadow-inner font-medium" 
                  placeholder="Describe your rough concept, the problem it solves, and your goals..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Domain</label>
                <div className="relative">
                  <select 
                    name="domain"
                    className="w-full glass-input bg-white appearance-none cursor-pointer font-bold text-indigo-900"
                    value={formData.domain}
                    onChange={handleInputChange}
                  >
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Activity size={18} />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full glass-button flex justify-center items-center gap-2 h-14 text-lg shadow-xl shadow-indigo-200 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 border-0 text-white transition-all hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center gap-2 animate-pulse"><Sparkles size={20} /> Generating Insights...</span>
                ) : (
                  <><Sparkles size={20} /> Get AI Suggestions</>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Results Column */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="lg:col-span-7 space-y-6"
            >
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Suggestions Card */}
                <div className="bg-white border border-indigo-100 rounded-3xl p-6 shadow-xl shadow-indigo-100/50">
                  <div className="flex items-center gap-3 mb-4 text-indigo-700">
                    <div className="p-2 bg-indigo-50 rounded-xl"><Lightbulb size={24} /></div>
                    <h3 className="font-bold text-lg">AI Suggestions</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.suggestions?.map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 text-sm font-medium leading-relaxed">
                        <span className="text-indigo-400 font-bold shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Card */}
                <div className="bg-white border border-cyan-100 rounded-3xl p-6 shadow-xl shadow-cyan-100/50">
                  <div className="flex items-center gap-3 mb-4 text-cyan-700">
                    <div className="p-2 bg-cyan-50 rounded-xl"><Server size={24} /></div>
                    <h3 className="font-bold text-lg">Recommended Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.technologies?.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research & Examples */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-100">
                <div className="flex items-center gap-3 mb-6 text-slate-800">
                  <div className="p-2 bg-slate-100 rounded-xl"><BookOpen size={24} /></div>
                  <h3 className="font-bold text-lg">References & Examples</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Example Projects</h4>
                    <ul className="space-y-3">
                      {result.example_projects?.map((item, i) => (
                        <li key={i} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50/50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                          <ExternalLink size={16} className="text-slate-400 mt-0.5 shrink-0 group-hover:text-indigo-500" />
                          <span className="text-slate-600 text-sm font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Research Papers</h4>
                    <ul className="space-y-3">
                      {result.research_papers?.map((item, i) => (
                        <li key={i} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50/50 border border-slate-100 group hover:border-cyan-200 transition-colors">
                          <BookOpen size={16} className="text-slate-400 mt-0.5 shrink-0 group-hover:text-cyan-500" />
                          <span className="text-slate-600 text-sm font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Save Action */}
              <div className="flex justify-end p-2">
                <button 
                  onClick={handleSaveToPlatform}
                  disabled={saving}
                  className="glass-button bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-200/50 transition-all hover:-translate-y-1"
                >
                  <Save size={20} /> {saving ? "Saving Idea..." : "Save to CampusIdeaHub"}
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

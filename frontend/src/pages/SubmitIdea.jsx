import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function SubmitIdea() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const extendsId = searchParams.get('extends_id');
  const { currentUser } = useAuth();
  
  const defaultName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Anonymous';
  const defaultYear = currentUser?.year || '2024';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: 'AI',
    tech_stack: '',
    keywords: '',
    year: defaultYear,
    submitted_by: defaultName,
    extends_id: extendsId || null
  });

  const [similarIdeas, setSimilarIdeas] = useState([]);
  const [checking, setChecking] = useState(false);
  const [warningBypassed, setWarningBypassed] = useState(false);
  const typingTimeoutRef = useRef(null);

  const domains = ['AI', 'Web', 'IoT', 'Cybersecurity', 'Cloud', 'App', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'description' && !extendsId) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => checkSimilarity(value), 1000);
    }
  };

  const checkSimilarity = async (description) => {
    if (!description || description.length < 20) {
      setSimilarIdeas([]);
      return;
    }
    setChecking(true);
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/projects/check_similarity`, { description });
      setSimilarIdeas(res.data.similar_ideas || []);
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (similarIdeas.length > 0 && !warningBypassed && !extendsId) {
      alert("Please review the similar ideas. If you still want to submit, click 'Proceed Anyway' first.");
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim())
      };
      
      const res = await axios.post(`http://${window.location.hostname}:5000/api/projects`, dataToSubmit);
      navigate(`/project/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Error submitting project.");
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-500 mb-2">
          {extendsId ? 'Extend Project Idea' : 'Submit a Project Idea'}
        </h1>
        <p className="text-slate-600 font-medium">Contribute to the CampusIdeaHub knowledge base.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.1 }}
          className="col-span-2 glass-card p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Project Title</label>
              <input 
                type="text" 
                name="title"
                required
                className="w-full glass-input" 
                placeholder="e.g. AI Smart Attendance System"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea 
                name="description"
                required
                className="w-full glass-input min-h-[120px] resize-none" 
                placeholder="Describe your project, features, and goals..."
                value={formData.description}
                onChange={handleInputChange}
              />
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Sparkles size={12}/> We actively check for similar ideas as you type.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Domain</label>
                <select 
                  name="domain"
                  className="w-full glass-input bg-white"
                  value={formData.domain}
                  onChange={handleInputChange}
                >
                  {domains.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tech Stack</label>
                <input 
                  type="text" 
                  name="tech_stack"
                  className="w-full glass-input" 
                  placeholder="e.g. React, Python, MongoDB"
                  value={formData.tech_stack}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Keywords</label>
              <input 
                type="text" 
                name="keywords"
                className="w-full glass-input" 
                placeholder="Comma separated: attendance, computer vision, AI"
                value={formData.keywords}
                onChange={handleInputChange}
              />
            </div>

            <button 
              type="submit" 
              className="w-full glass-button flex justify-center items-center gap-2 h-12 text-lg shadow-lg"
            >
              Submit Idea <Lightbulb size={20} />
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }}
          className="col-span-1"
        >
          <div className="glass-card p-6 sticky top-24 bg-white/80 border-indigo-50">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle className="text-indigo-500" size={20} /> AI Similarity Engine
            </h3>
            
            {checking && <p className="text-sm text-indigo-500 animate-pulse font-medium">Analyzing description...</p>}
            
            {!checking && similarIdeas.length === 0 && (
              <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center">
                Start typing your description to check for similarities against existing ideas.
              </p>
            )}

            <AnimatePresence>
              {!checking && similarIdeas.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                    <p className="text-sm text-rose-700 font-semibold mb-1">⚠ Similar ideas found!</p>
                    <p className="text-xs text-rose-600/80">Consider extending an existing project instead of duplicating it.</p>
                  </div>

                  {similarIdeas.map(idea => (
                    <div key={idea.id} className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-all hover:border-indigo-200 group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{idea.title}</h4>
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{idea.similarity}%</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{idea.description}</p>
                      <button 
                        onClick={() => navigate(`/submit?extends_id=${idea.id}`)}
                        className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:text-indigo-800 transition-colors"
                      >
                        Extend this idea <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}

                  {!warningBypassed && !extendsId && (
                    <button 
                      type="button"
                      onClick={() => setWarningBypassed(true)}
                      className="w-full mt-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Bypass & Submit Anyway
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

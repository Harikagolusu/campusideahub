import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, GitMerge, Link as LinkIcon, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function ExtendIdea() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parent_id');
  const { currentUser } = useAuth();
  
  const defaultName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Anonymous';
  const defaultYear = currentUser?.year || '2024';

  const [parentProject, setParentProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    improvements_made: '',
    additional_features: '',
    github_repo: '',
    demo_link: '',
    domain: '',
    keywords: '',
    year: defaultYear,
    submitted_by: defaultName,
    parent_project_id: parentId
  });

  useEffect(() => {
    if (!parentId) {
      navigate('/explore');
      return;
    }
    const fetchParent = async () => {
      try {
        const res = await axios.get(`http://${window.location.hostname}:5000/api/projects/${parentId}`);
        setParentProject(res.data);
        setFormData(prev => ({
          ...prev,
          domain: res.data.domain,
          keywords: res.data.keywords ? res.data.keywords.join(', ') : '',
        }));
      } catch (err) {
        console.error("Parent project not found", err);
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetchParent();
  }, [parentId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.github_repo && !formData.github_repo.startsWith('https://github.com/')) {
      alert("GitHub Repository link must start with https://github.com/");
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
      };
      
      const res = await axios.post(`http://${window.location.hostname}:5000/api/projects`, dataToSubmit);
      navigate(`/project/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Error submitting extended project.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-indigo-500">Loading...</div>;

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative">
        <button onClick={() => navigate(-1)} className="absolute -left-16 top-2 p-2 text-slate-400 hover:text-indigo-600 transition-colors hidden md:block">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-400 mb-2 flex items-center gap-3">
          <GitMerge className="text-emerald-500" size={32} /> Extend Project Idea
        </h1>
        <p className="text-slate-600 font-medium text-lg">You are building upon <span className="text-indigo-600 font-bold">{parentProject?.title}</span></p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Basic Info</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Extended Project Title</label>
              <input 
                type="text" name="title" required
                className="w-full glass-input text-lg font-bold" 
                placeholder={`e.g. ${parentProject?.title} v2.0`}
                value={formData.title} onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Improvements & Additions</h3>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">What Improvements Were Made?</label>
              <textarea 
                name="improvements_made" required
                className="w-full glass-input min-h-[100px] resize-none" 
                placeholder="Explain what limitations of the original project you solved..."
                value={formData.improvements_made} onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Features Added</label>
              <textarea 
                name="additional_features" required
                className="w-full glass-input min-h-[100px] resize-none" 
                placeholder="List new features, APIs integrated, or components built..."
                value={formData.additional_features} onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Implementation Summary (Overall Description)</label>
              <textarea 
                name="description" required
                className="w-full glass-input min-h-[120px] resize-none" 
                placeholder="Provide a full summary of your extended project."
                value={formData.description} onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Technical Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Updated Tech Stack</label>
                <input 
                  type="text" name="tech_stack" required
                  className="w-full glass-input" 
                  placeholder="e.g. Added TypeScript, Prisma..."
                  value={formData.tech_stack} onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Keywords</label>
                <input 
                  type="text" name="keywords" required
                  className="w-full glass-input" 
                  placeholder="Comma separated"
                  value={formData.keywords} onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <LinkIcon className="text-slate-500" size={20} /> Project Resources
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  GitHub Repository Link <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="url" name="github_repo" required
                  className="w-full glass-input bg-white" 
                  placeholder="https://github.com/username/project"
                  value={formData.github_repo} onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Live Demo Link (Optional)</label>
                <input 
                  type="url" name="demo_link"
                  className="w-full glass-input bg-white" 
                  placeholder="https://your-demo.vercel.app"
                  value={formData.demo_link} onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full glass-button bg-emerald-600 hover:bg-emerald-700 text-white flex justify-center items-center gap-2 h-14 text-lg font-bold shadow-xl shadow-emerald-200"
          >
            Publish Extension <ExternalLink size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Lightbulb, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Explore() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');

  const domains = ['All', 'AI', 'Web', 'IoT', 'Cybersecurity', 'Cloud', 'App', 'Other'];

  useEffect(() => {
    fetchProjects();
  }, [search, domain]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/projects`, {
        params: { search, domain }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-500 mb-2">
          Explore Ideas
        </h1>
        <p className="text-slate-600 font-medium">Discover, extend, and collaborate on campus projects.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search projects by title, keywords or tech stack..."
            className="w-full glass-input pl-12 h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                domain === d 
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 flex flex-col group hover:-translate-y-1 transition-transform"
          >
            {project.image_url ? (
              <div className="w-full h-40 mb-4 rounded-xl overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10"></div>
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute bottom-3 left-3 px-3 py-1 bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full z-20 shadow-md">
                  {project.domain}
                </span>
                <div className="absolute top-3 right-3 flex items-center text-white/90 text-[10px] gap-1 z-20 bg-slate-900/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  <Calendar size={12} />
                  <span>{project.year}</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                  {project.domain}
                </span>
                <div className="flex items-center text-slate-400 text-sm gap-1">
                  <Calendar size={14} />
                  <span>{project.year}</span>
                </div>
              </div>
            )}
            
            <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {project.title}
            </h3>
            
            <p className="text-slate-600 text-sm mb-4 flex-1 line-clamp-3">
              {project.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                  {project.submitted_by.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-600">{project.submitted_by}</span>
              </div>
              <Link 
                to={`/project/${project._id}`}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View Details <span className="text-lg">→</span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <Lightbulb className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-slate-600">No projects found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}

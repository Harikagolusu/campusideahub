import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Network, Sparkles, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/projects?sort_by=trending`);
      setTrending(res.data.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-indigo-100 shadow-sm text-indigo-700 font-semibold text-sm"
        >
          <Sparkles size={16} /> CampusIdeaHub MVP v1.0
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6"
        >
          Connecting Student Ideas <br className="hidden md:block"/> to Build the <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">Future</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl font-medium"
        >
          Stop reinventing the wheel. Discover existing projects, avoid duplicates, and visually see how your ideas can extend previous innovations.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md"
        >
          <Link to="/submit" className="glass-button flex-1 flex justify-center items-center gap-2 h-14 text-lg">
            Share Idea <Lightbulb size={20} />
          </Link>
          <Link to="/explore" className="glass-button-secondary flex-1 flex justify-center items-center gap-2 h-14 text-lg">
            Explore <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      <section className="py-16 px-4 bg-white/40 border-y border-white/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Trending Ideas</h2>
              <p className="text-slate-500 font-medium">Projects with the most interaction this week.</p>
            </div>
            <Link to="/explore" className="text-indigo-600 hover:text-indigo-800 font-semibold hidden md:flex items-center gap-1 group">
              View All <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trending.map((project, i) => (
              <motion.div 
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-card p-6 flex flex-col group hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {project.image_url ? (
                  <div className="w-full h-40 mb-4 rounded-xl overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10"></div>
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full z-20 shadow-md">
                      {project.domain}
                    </span>
                    <div className="absolute top-3 right-3 text-white/90 font-semibold text-[10px] bg-slate-900/40 px-2 py-0.5 rounded-md backdrop-blur-sm z-20">
                      {project.views} views
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">{project.domain}</span>
                    <div className="text-slate-400 font-semibold text-xs bg-slate-100 px-2 py-1 rounded-md">{project.views} views</div>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3">{project.description}</p>
                
                <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500">By {project.submitted_by}</span>
                  <Link to={`/project/${project._id}`} className="text-indigo-600 text-sm font-semibold hover:underline">Read more</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Network size={32} />
            </div>
            <h2 className="text-4xl font-bold leading-tight">Visualize Idea Evolution</h2>
            <p className="text-lg text-slate-600 font-medium">
              Don't start from scratch. See how projects connect, find the root idea, and collaborate to build the next iteration of an existing project.
            </p>
            <Link to="/graph" className="text-indigo-600 font-bold hover:gap-2 flex items-center gap-1 transition-all w-max py-2 border-b-2 border-indigo-200 hover:border-indigo-600">
              Explore the Graph <ArrowRight size={20} />
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-square glass-card bg-white/80 border-2 border-white/40 shadow-2xl rounded-3xl p-4 flex items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
            <img src="/idea-graph.png" alt="Graph Visualization Abstract" className="w-full h-full object-cover opacity-80 mix-blend-multiply rounded-2xl" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

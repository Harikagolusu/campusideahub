import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Network, Sparkles, MessageSquare, Zap, Shield, Users, BarChart } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.png';

export default function Home() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`http://${window.location.hostname}:5000/api/projects?sort_by=trending`);
        setTrending(res.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-24 px-4 flex flex-col items-center justify-center text-center w-full min-h-[80vh] overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 bg-slate-900 pointer-events-none">
          <img src="/hero-bg.jpg" alt="Data background" className="w-full h-full object-cover opacity-40 mix-blend-screen" />
          {/* Gradient fade to match the body background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/60 to-slate-50/50"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mb-8"
          >
            <img src={logo} alt="CampusIdeaHub" className="h-[160px] w-auto mx-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-lg"
          >
            Connecting Student Ideas <br className="hidden md:block"/> to Build the <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300 drop-shadow-md">Future</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl font-medium drop-shadow-md"
          >
            Stop reinventing the wheel. Discover existing projects, avoid duplicates, and visually see how your ideas can extend previous innovations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md"
          >
            <Link to="/submit" className="flex-1 flex justify-center items-center gap-2 h-14 text-lg bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-105">
              Share Idea <Lightbulb size={20} />
            </Link>
            <Link to="/explore" className="flex-1 flex justify-center items-center gap-2 h-14 text-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-bold rounded-xl transition-all hover:scale-105">
              Explore <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white/40 border-y border-white/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Trending Projects 🔥</h2>
              <p className="text-slate-500 font-medium">Projects with the most interaction this week.</p>
            </div>
            <Link to="/explore" className="text-indigo-600 hover:text-indigo-800 font-semibold hidden md:flex items-center gap-1 group">
              View All <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x snap-mandatory hide-scrollbars">
            {trending.map((project, i) => (
              <motion.div 
                key={project._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="snap-start shrink-0 w-80 sm:w-96 glass-card p-6 flex flex-col group hover:shadow-2xl transition-all hover:-translate-y-1 relative"
              >
                {project.is_verified && (
                  <span className="absolute top-4 right-4 z-30 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                     ✔ Verified
                  </span>
                )}
                {project.image_url ? (
                  <div className="w-full h-40 mb-4 rounded-xl overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10"></div>
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full z-20 shadow-md">
                      {project.domain}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-start mb-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">{project.domain}</span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{project.title}</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Innovation Score</span>
                      <span className="text-sm font-black text-indigo-600">{project.innovation_score || 0} / 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                       <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full" style={{ width: `${project.innovation_score || 0}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <Link to={`/project/${project._id}`} className="w-full py-2 bg-slate-900 hover:bg-indigo-600 text-white text-center rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2">
                    View Project <ArrowRight size={16} />
                  </Link>
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
      <section className="py-20 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">Why CampusIdeaHub?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Everything you need to take your academic projects from a raw idea to a successful deployment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Zap size={28} />, title: 'AI Matchmaking', desc: 'Our smart AI assistant helps you refine ideas and suggests relevant technologies instantly.', color: 'text-amber-500', bg: 'bg-amber-100' },
              { icon: <Shield size={28} />, title: 'Duplicate Prevention', desc: 'Before you write a single line of code, we cross-check existing projects to prevent redundant work.', color: 'text-emerald-500', bg: 'bg-emerald-100' },
              { icon: <Users size={28} />, title: 'Alumni Mentorship', desc: 'Connect with graduated seniors who built similar projects and can guide you through roadblocks.', color: 'text-blue-500', bg: 'bg-blue-100' },
              { icon: <BarChart size={28} />, title: 'Impact Analytics', desc: 'Track how many students are viewing, starring, or extending your original repository over time.', color: 'text-purple-500', bg: 'bg-purple-100' },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`${feature.bg} ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-indigo-700 to-cyan-600 text-white flex justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="py-4">
            <h4 className="text-5xl font-black mb-2 drop-shadow-sm">1</h4>
            <p className="text-indigo-100 text-lg font-medium">Exclusive Campus Beta</p>
          </div>
          <div className="py-4">
            <h4 className="text-5xl font-black mb-2 drop-shadow-sm">500+</h4>
            <p className="text-indigo-100 text-lg font-medium">Active Students</p>
          </div>
          <div className="py-4">
            <h4 className="text-5xl font-black mb-2 drop-shadow-sm">150+</h4>
            <p className="text-indigo-100 text-lg font-medium">Projects Published</p>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 border border-indigo-100 shadow-inner">
            <Sparkles size={36} className="text-indigo-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Ready to build the future?</h2>
          <p className="text-xl text-slate-600 mb-10 font-medium">Join your fellow students in building, collaborating, and innovating on CampusIdeaHub.</p>
          <Link to="/login" className="px-10 py-4 bg-slate-900 hover:bg-indigo-600 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

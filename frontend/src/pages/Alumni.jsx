import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, GraduationCap, Briefcase, Code, Send, X, Linkedin, Github } from 'lucide-react';
import axios from 'axios';

export default function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [selectedAlum, setSelectedAlum] = useState(null);

  const departments = ['All', 'Computer Science', 'Electrical Eng', 'Mechanical Eng', 'Civil Eng', 'Other'];

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/alumni`);
      setAlumni(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAlumni = alumni.filter(a => {
    const matchSearch = a.name?.toLowerCase().includes(search.toLowerCase()) || 
                       a.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
                       a.current_role?.toLowerCase().includes(search.toLowerCase()) ||
                       a.company?.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === 'All' || a.department === department;
    return matchSearch && matchDept;
  });

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center md:text-left"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-500 mb-2">
          Alumni Network
        </h1>
        <p className="text-slate-600 font-medium text-lg">Connect with past contributors, find mentors, and get inspired.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search alumni by name, role, company, or skills..."
            className="w-full glass-input pl-12 h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setDepartment(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                department === d 
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              {d.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alum, index) => (
          <motion.div
            key={alum._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 flex flex-col group hover:-translate-y-1 transition-all hover:shadow-2xl border-indigo-50"
          >
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={alum.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(alum.name)}`} 
                alt={alum.name} 
                className="w-16 h-16 rounded-full border-2 border-indigo-100 object-cover shadow-sm"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-800">{alum.name}</h3>
                <div className="flex items-center text-sm font-semibold text-indigo-600 gap-1 bg-indigo-50 w-max px-2 py-0.5 rounded-md mt-1">
                  <GraduationCap size={14} /> Class of {alum.graduation_year}
                </div>
              </div>
            </div>

            <div className="mb-4 text-sm space-y-2 flex-1">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Briefcase size={16} className="text-slate-400" /> 
                {alum.current_role} @ <span className="text-slate-800 font-bold">{alum.company}</span>
              </div>
              <p className="text-slate-500 italic line-clamp-2">"{alum.bio}"</p>
            </div>

            <div className="flex flex-wrap gap-1 mb-6">
              {alum.skills?.slice(0, 3).map(skill => (
                <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                  {skill}
                </span>
              ))}
              {(alum.skills?.length || 0) > 3 && (
                <span className="px-2 py-1 bg-slate-50 text-slate-400 text-xs font-semibold rounded-md border border-slate-100">
                  +{alum.skills.length - 3}
                </span>
              )}
            </div>

            <button 
              className="mt-auto w-full glass-button-secondary border-indigo-200 hover:border-indigo-500 flex justify-center items-center gap-2 font-bold py-2.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors"
              onClick={() => setSelectedAlum(alum)}
            >
              <Send size={16} /> View Profile & Connect
            </button>
          </motion.div>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="text-center py-20">
          <GraduationCap className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-slate-600">No alumni found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your filters.</p>
        </div>
      )}

      {/* Profile Modal */}
      {selectedAlum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="glass-card w-full max-w-2xl overflow-hidden shadow-2xl relative bg-white border-0">
            <button onClick={() => setSelectedAlum(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-rose-500 text-white hover:text-white rounded-full transition-colors z-10 backdrop-blur-sm"><X size={20} /></button>
            <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 relative"></div>
            <div className="px-8 pb-8 -mt-12 relative">
              <div className="flex justify-between items-end mb-4">
                <img src={selectedAlum.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAlum.name)}`} alt={selectedAlum.name} className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg bg-white" />
                <div className="flex gap-2 mb-2">
                   {selectedAlum.linkedin && <a href={selectedAlum.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors shadow-sm"><Linkedin size={20} /></a>}
                   {selectedAlum.github && <a href={selectedAlum.github} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors shadow-sm"><Github size={20} /></a>}
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-800">{selectedAlum.name}</h2>
              <div className="flex flex-wrap items-center text-sm font-semibold text-indigo-600 gap-3 mt-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 rounded-lg"><GraduationCap size={16} /> Class of {selectedAlum.graduation_year}</span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600"><Briefcase size={16}/> {selectedAlum.department}</span>
              </div>
              
              <div className="my-6">
                <p className="text-slate-600 font-medium leading-relaxed">{selectedAlum.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-6 border-t border-slate-100">
                <div>
                   <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Briefcase size={18} className="text-indigo-500"/> Current Role</h4>
                   <p className="text-slate-600 font-medium">{selectedAlum.current_role} at <span className="font-bold text-slate-800">{selectedAlum.company}</span></p>
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Code size={18} className="text-indigo-500"/> Tech Skills</h4>
                   <div className="flex flex-wrap gap-2">
                     {selectedAlum.skills?.map(skill => (
                       <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg">{skill}</span>
                     ))}
                   </div>
                </div>
              </div>

              <button 
                className="w-full glass-button py-3.5 text-base justify-center flex items-center gap-2"
                onClick={() => {
                  alert("Mentorship direct requests from the Alumni page are coming soon! Please visit a Project Details page to use the integrated mentorship connect feature.");
                }}
              >
                 <Send size={18} /> Request Mentorship from {selectedAlum.name.split(' ')[0]}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

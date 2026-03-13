import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, User, Code2, Tag, Network, ArrowRight, GraduationCap, Briefcase, Send, CheckCircle2, Github, ExternalLink, GitMerge } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [requestStatus, setRequestStatus] = useState({});
  const [mentorshipMsg, setMentorshipMsg] = useState('');
  const [activeAlumni, setActiveAlumni] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/projects/${id}`);
      setProject(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleMentorshipRequest = async (alumniId) => {
    if (!currentUser) return alert("Please login to request mentorship");
    
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/alumni/mentorship`, {
        student_name: currentUser.name || "Student",
        student_id: currentUser._id,
        alumni_id: alumniId,
        project_id: project._id,
        message: mentorshipMsg || `I'm interested in learning more about your work on ${project.title}.`
      });
      setRequestStatus(prev => ({ ...prev, [alumniId]: 'sent' }));
      setMentorshipMsg('');
      setActiveAlumni(null);
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center animate-pulse text-indigo-500"><Network size={40} className="animate-spin-slow" /></div>;
  if (!project) return <div className="pt-32 text-center text-xl text-slate-600">Project Not Found</div>;

  return (
    <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-2 items-center">
                <span className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-bold rounded-full text-sm shadow-md">
                  {project.domain}
                </span>
                {project.is_verified && (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 font-bold rounded-full text-sm border border-emerald-100 flex items-center gap-1">
                     ✔ Faculty Verified
                  </span>
                )}
                <span className="px-3 py-1.5 bg-amber-50 text-amber-600 font-bold rounded-full text-sm border border-amber-100 flex items-center gap-1">
                   ⭐ Innovation: {project.innovation_score} / 100
                </span>
              </div>
              <div className="flex bg-slate-100 px-3 py-1 rounded-lg items-center gap-2 text-slate-500 text-sm font-semibold border border-slate-200">
                <Calendar size={16} /> {project.year}
              </div>
            </div>

            <h1 className="text-4xl font-black text-slate-800 mb-4 leading-tight">{project.title}</h1>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {project.submitted_by.charAt(0)}
                </div>
                <span>{project.submitted_by}</span>
              </div>
              <div className="text-slate-400 flex items-center gap-1 text-sm bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {project.views} views
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Description</h3>
              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{project.description}</p>
            </div>

            {project.faculty_score && (
               <div className="mt-6 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                 <div className="flex justify-between items-center mb-3">
                   <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                     <CheckCircle2 size={18} className="text-indigo-500" /> Faculty Review
                   </h4>
                   <span className="text-sm font-black text-indigo-700 bg-white px-3 py-1 rounded-full shadow-sm">
                     Score: {project.faculty_score}/100
                   </span>
                 </div>
                 {project.faculty_comment && (
                   <p className="text-sm text-indigo-800/80 italic border-l-2 border-indigo-300 pl-3">"{project.faculty_comment}"</p>
                 )}
                 {project.reviewed_by && (
                   <p className="text-xs text-indigo-400 font-bold mt-2">— Reviewed by {project.reviewed_by}</p>
                 )}
               </div>
            )}

            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <Code2 className="text-indigo-500" size={20} /> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.split(',').map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <Tag className="text-indigo-500" size={20} /> Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.keywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold uppercase tracking-wide">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Resources Block */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                Project Resources
              </h3>
              <div className="flex flex-wrap gap-4">
                {project.github_repo ? (
                  <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-colors shadow-md">
                    <Github size={18} /> Open Repository
                  </a>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl font-bold text-sm border border-slate-200 cursor-not-allowed">
                    <Github size={18} /> No Repository Linked
                  </span>
                )}
                
                {project.demo_link && (
                  <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm transition-colors shadow-sm border border-emerald-200">
                    <ExternalLink size={18} /> View Live Demo
                  </a>
                )}
              </div>
            </div>
            
            {/* Build Guide Section */}
            <div className="mt-8 pt-8 border-t border-slate-100">
               <details className="group glass-card border-indigo-100 open:bg-indigo-50/10 cursor-pointer overflow-hidden p-6 transition-colors rounded-2xl">
                 <summary className="font-bold text-lg text-slate-800 flex items-center justify-between outline-none list-none">
                   <div className="flex items-center gap-2">
                     <Code2 className="text-indigo-500" size={20} /> How to Build This Project
                   </div>
                   <span className="text-slate-400 font-normal text-sm group-open:hidden">Click to expand</span>
                   <span className="text-slate-400 font-normal text-sm hidden group-open:block">Collapse</span>
                 </summary>
                 <div className="mt-6 space-y-6 text-sm text-slate-600 font-medium cursor-auto">
                   <div>
                     <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 w-max">Required Technologies</h4>
                     <ul className="list-disc pl-5 space-y-1">
                       {(project.tech_stack || "Node.js, React, MongoDB").split(',').map((t, idx) => <li key={idx}>{t.trim()}</li>)}
                     </ul>
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 w-max">Basic Implementation Steps</h4>
                     <ol className="list-decimal pl-5 space-y-2">
                       <li>Environment Setup and Boilerplate Initialization</li>
                       <li>Database modeling and Schema design</li>
                       <li>Core API Development and third-party integrations</li>
                       <li>Frontend UI/UX design matching the schema</li>
                       <li>Testing and final deployment</li>
                     </ol>
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 w-max">Tools & Frameworks</h4>
                     <p>Git, VS Code, Postman or Insomnia, Cloud Hosting (Vercel / Heroku)</p>
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 w-max">Learning Resources</h4>
                     <ul className="list-disc pl-5 space-y-1 text-indigo-500 underline">
                       <li><a href="https://react.dev">React Official Docs</a></li>
                       <li><a href="https://python.org">Python Guide</a></li>
                       <li>GitHub trending examples</li>
                     </ul>
                   </div>
                 </div>
               </details>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <Link 
                to={`/extend?parent_id=${project._id}`}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 glass-button"
              >
                <GitMerge size={20} className="text-indigo-400" /> Extend this Idea <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Connect with Previous Contributors (Alumni) */}
          {(project.alumni?.length > 0 || project.suggested_mentors?.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 mt-8 border-indigo-100/50">
              <h3 className="font-bold text-2xl text-slate-800 mb-6 flex items-center gap-2">
                <GraduationCap className="text-indigo-500" size={24} /> {project.alumni?.length > 0 ? "Past Contributors / Alumni Mentors" : "Suggested Mentors"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(project.alumni?.length > 0 ? project.alumni : project.suggested_mentors).map(alum => (
                  <div key={alum._id} className="bg-white/60 p-5 rounded-2xl border border-indigo-50 shadow-sm flex flex-col hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={alum.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(alum.name)}`} alt={alum.name} className="w-12 h-12 rounded-full shadow-sm" />
                      <div>
                        <h4 className="font-bold text-slate-800">{alum.name}</h4>
                        <span className="text-xs font-semibold text-indigo-600">Class of {alum.graduation_year}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                      <Briefcase size={14} className="text-slate-400" /> {alum.current_role} @ {alum.company}
                    </div>

                    {requestStatus[alum._id] === 'sent' ? (
                      <div className="mt-auto flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 py-2 px-4 rounded-xl justify-center text-sm">
                        <CheckCircle2 size={16} /> Request Sent!
                      </div>
                    ) : activeAlumni === alum._id ? (
                      <div className="mt-auto space-y-3">
                        <textarea 
                          className="w-full glass-input text-sm p-3 h-20" 
                          placeholder={`Hi ${alum.name.split(' ')[0]}, I'm interested in your work...`}
                          value={mentorshipMsg}
                          onChange={e => setMentorshipMsg(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => setActiveAlumni(null)} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
                          <button onClick={() => handleMentorshipRequest(alum._id)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                            <Send size={14}/> Send
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveAlumni(alum._id)}
                        className="mt-auto w-full glass-button-secondary py-2 border-indigo-100 flex items-center justify-center gap-2 font-semibold text-indigo-600 rounded-xl"
                      >
                         Request Mentorship
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="col-span-1 space-y-6">
          
          {/* Parent Project Panel */}
          {project.parent_project && (
            <div className="glass-card p-6 border-emerald-100 bg-emerald-50/30">
              <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                <GitMerge className="text-emerald-500" size={20} /> Parent Project
              </h3>
              <p className="text-xs text-slate-600 mb-3 font-medium">This project is an extension of:</p>
              <Link to={`/project/${project.parent_project._id}`} className="block p-3 bg-white hover:bg-emerald-50 border border-emerald-100 rounded-xl transition-colors shadow-sm group">
                <h4 className="font-bold text-emerald-700 text-sm mb-1 group-hover:text-emerald-800 line-clamp-1 flex items-center justify-between">
                  {project.parent_project.title} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">{project.parent_project.description}</p>
              </Link>
            </div>
          )}

           {/* Idea Graph Connections Panel */}
          {project.extensions?.length > 0 && (
            <div className="glass-card p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Network className="text-indigo-500" size={20} /> Extensions
              </h3>
              <p className="text-sm text-slate-600 mb-4">Ideas built on top of this project:</p>
              <div className="space-y-3">
                {project.extensions.map(ext => (
                  <Link key={ext._id} to={`/project/${ext._id}`} className="block p-3 bg-white hover:bg-indigo-50 border border-indigo-100 rounded-xl transition-colors group shadow-sm">
                    <h4 className="font-semibold text-indigo-700 text-sm mb-1 group-hover:text-indigo-800 flex justify-between">
                      {ext.title} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </h4>
                    <span className="text-xs text-slate-500 font-medium tracking-wide">{ext.submitted_by}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Innovation Timeline Panel */}
          {project.timeline?.length > 1 && (
             <div className="glass-card p-6 border-slate-200">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar className="text-indigo-500" size={20} /> Innovation Timeline
                </h3>
                <div className="relative border-l-2 border-indigo-100 ml-3 space-y-6">
                  {project.timeline.map((node, idx) => (
                    <div key={node._id} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${node._id === project._id ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}></div>
                      <Link to={`/project/${node._id}`} className="block block group">
                        <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md mb-1 inline-block">{node.year || '2024'}</span>
                        <h4 className={`text-sm font-bold transition-colors ${node._id === project._id ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>{node.title}</h4>
                      </Link>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {/* Similar Ideas Panel */}
          {project.similar?.length > 0 && (
            <div className="glass-card p-6 border-slate-200/60 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2 relative">
                <Network className="text-indigo-500" size={20} /> Similar Ideas
              </h3>
              <div className="space-y-4 relative">
                {project.similar.map(simInfo => (
                  <div key={simInfo._id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/project/${simInfo._id}`} className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1 flex-1 pr-2">
                        {simInfo.title}
                      </Link>
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full shrink-0 shadow-inner">
                        {simInfo.similarity}% fit
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-2 leading-relaxed">{simInfo.description}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                       <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                         {simInfo.domain}
                       </span>
                       <Link to={`/project/${simInfo._id}`} className="text-xs font-semibold text-indigo-500 hover:text-indigo-700">
                         View details &rarr;
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Edit, GraduationCap, Mail, Building2, Github, Linkedin, Award, Lightbulb, Code, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const isFaculty = currentUser.role === 'faculty';
  const skillsList = currentUser.skills ? currentUser.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="pt-24 px-4 max-w-2xl mx-auto min-h-[calc(100vh-64px)] pb-12 flex justify-center items-center">
      <div className="w-full">
        {/* ID Card Wrapper */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 group hover:shadow-indigo-200/50 transition-all duration-300"
        >
          {/* Card Header Background Gradient */}
          <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 relative">
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-20mix-blend-overlay"></div>
            {/* Lanyard Hole Mockup */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-white/20 rounded-full backdrop-blur-sm shadow-inner overflow-hidden flex justify-center items-center">
              <div className="w-10 h-1 bg-white/40 rounded-full"></div>
            </div>
            {/* University Tag */}
            <div className="absolute bottom-4 left-6 flex items-center gap-2 text-white/90">
              <Building2 size={24} className="opacity-90 drop-shadow-md" />
              <span className="font-bold tracking-wider text-sm uppercase drop-shadow-md">Campus University</span>
            </div>
          </div>

          <div className="px-8 pb-10 pt-20 relative bg-slate-50/50">
            {/* Profile Photo - Negative Margin to Overlap Header */}
            <div className="absolute -top-16 left-8 z-10">
              <div className="relative">
                <img 
                  src={currentUser.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'Student')}&background=c7d2fe&color=3730a3`} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-[1.5rem] border-4 border-white shadow-xl object-cover bg-white"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
              </div>
            </div>

            <div className="flex justify-between items-start mb-6 mt-2">
              <div className="w-full">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">
                  {currentUser.name || (isFaculty ? "Faculty Member" : "Student")}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-indigo-600 font-bold mb-6">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>{currentUser.email}</span>
                  </div>
                  {isFaculty && currentUser.faculty_id && (
                    <div className="flex items-center gap-2 bg-indigo-50 px-2 py-0.5 rounded text-xs text-indigo-800">
                      ID: {currentUser.faculty_id}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex justify-around bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
              {isFaculty ? (
                <>
                  <div className="text-center group-hover:-translate-y-1 transition-transform">
                    <div className="flex justify-center text-amber-500 mb-1"><Target size={24} /></div>
                    <div className="text-2xl font-black text-slate-800 leading-none">--</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide px-2">Evaluations<br/>Pending</div>
                  </div>
                  <div className="w-px bg-slate-100"></div>
                  <div className="text-center group-hover:-translate-y-1 transition-transform delay-75">
                    <div className="flex justify-center text-emerald-500 mb-1"><Award size={24} /></div>
                    <div className="text-2xl font-black text-slate-800 leading-none">--</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide px-2">Projects<br/>Verified</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center group-hover:-translate-y-1 transition-transform">
                    <div className="flex justify-center text-amber-500 mb-1"><Award size={24} /></div>
                    <div className="text-2xl font-black text-slate-800 leading-none">{currentUser.projects_contributed || 0}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Projects</div>
                  </div>
                  <div className="w-px bg-slate-100"></div>
                  <div className="text-center group-hover:-translate-y-1 transition-transform delay-75">
                    <div className="flex justify-center text-cyan-500 mb-1"><Lightbulb size={24} /></div>
                    <div className="text-2xl font-black text-slate-800 leading-none">{currentUser.ideas_submitted || 0}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ideas</div>
                  </div>
                </>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><GraduationCap size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</p>
                  <p className="font-bold text-slate-700">{currentUser.department || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><Target size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isFaculty ? "Designation" : "Area of Interest"}</p>
                  <p className="font-bold text-slate-700">{isFaculty ? (currentUser.designation || 'Faculty Member') : (currentUser.area_of_interest || 'Not specified')}</p>
                </div>
              </div>

              {isFaculty && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Lightbulb size={20} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expertise</p>
                      <p className="font-bold text-slate-700">{currentUser.expertise || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl"><Building2 size={20} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Office</p>
                      <p className="font-bold text-slate-700">{currentUser.office_location || 'Not specified'}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 col-span-1 md:col-span-2 mt-2">
                {currentUser.linkedin && (
                  <a href={currentUser.linkedin} target="_blank" rel="noreferrer" className="flex-1 py-2.5 flex justify-center items-center gap-2 bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 rounded-xl font-bold transition-colors">
                    <Linkedin size={18} /> LinkedIn
                  </a>
                )}
                {!isFaculty && currentUser.github && (
                  <a href={currentUser.github} target="_blank" rel="noreferrer" className="flex-1 py-2.5 flex justify-center items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition-colors">
                    <Github size={18} /> GitHub
                  </a>
                )}
                {isFaculty && currentUser.google_scholar && (
                  <a href={currentUser.google_scholar} target="_blank" rel="noreferrer" className="flex-1 py-2.5 flex justify-center items-center gap-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-bold transition-colors">
                    <GraduationCap size={18} /> Google Scholar
                  </a>
                )}
              </div>
            </div>

            {/* Bio */}
            {(currentUser.bio || isFaculty) && (
              <div className="mb-6 relative">
                 <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isFaculty ? "Research Interests" : "Bio"}
                 </div>
                 <div className="absolute -left-3 top-6 bottom-0 w-1 bg-indigo-200 rounded-full"></div>
                 <p className="text-slate-600 italic font-medium leading-relaxed">"{currentUser.bio || (isFaculty ? 'No research interests provided.' : 'No bio provided.')}"</p>
              </div>
            )}

            {/* Skills Tags */}
            {!isFaculty && skillsList.length > 0 && (
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <Code size={16} /> Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-lg shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Watermark */}
            <div className="absolute bottom-4 right-6 opacity-5 pointer-events-none">
              <Lightbulb size={120} />
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link 
            to="/settings" 
            className="glass-button bg-white text-indigo-600 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Edit size={18} /> Edit Profile Details
          </Link>
        </div>

      </div>
    </div>
  );
}

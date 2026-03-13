import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Save, LogOut } from 'lucide-react';
import axios from 'axios';

export default function Settings() {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    department: currentUser?.department || 'Computer Science',
    year: currentUser?.year || '1',
    github: currentUser?.github || '',
    linkedin: currentUser?.linkedin || '',
    skills: currentUser?.skills || '',
    bio: currentUser?.bio || '',
    profile_picture: currentUser?.profile_picture || '',
    area_of_interest: currentUser?.area_of_interest || '',
    designation: currentUser?.designation || 'Assistant Professor',
    expertise: currentUser?.expertise || '',
    experience_years: currentUser?.experience_years || '',
    office_location: currentUser?.office_location || '',
    google_scholar: currentUser?.google_scholar || '',
    faculty_id: currentUser?.faculty_id || ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) {
         setError('Image must be less than 1MB');
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/login`, {
        uid: currentUser.uid,
        email: currentUser.email,
        ...formData
      });
      setCurrentUser({ ...currentUser, ...res.data });
      setSuccess('Profile settings updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
    setLoading(false);
  };

  if (!currentUser) return null;

  const isFaculty = currentUser?.role === 'faculty';

  return (
    <div className="pt-24 px-4 max-w-3xl mx-auto min-h-screen pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card shadow-lg p-6 sm:p-10 border-indigo-100"
      >
        <div className="flex justify-between items-center mb-8 border-b border-indigo-50 flex-wrap gap-4 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Account Settings
            </h1>
            <p className="text-slate-500 font-medium">Manage your campus profile data.</p>
          </div>
        </div>

        {success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm mb-6 font-semibold border border-emerald-100 flex items-center gap-2">{success}</div>}
        {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm mb-6 font-semibold border border-rose-100 flex items-center gap-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload & Display */}
          <div className="flex items-center gap-6 mb-6">
            <div className="shrink-0 relative group">
              <img 
                src={formData.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Student')}&background=c7d2fe&color=3730a3`} 
                alt="Profile" 
                className="h-28 w-28 object-cover rounded-full border-4 border-indigo-50 shadow-md group-hover:border-indigo-100 transition-all"
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 mb-2">Profile Photo</h3>
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2.5 file:px-5
                  file:rounded-xl file:border-0
                  file:text-sm file:font-bold
                  file:bg-indigo-50 file:text-indigo-600
                  hover:file:bg-indigo-100 cursor-pointer transition-colors"
                />
              </label>
              <p className="text-xs text-slate-400 mt-2 font-medium">JPEG, PNG under 1MB.</p>
            </div>
          </div>

          {!isFaculty ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full glass-input" placeholder="e.g. John Doe"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Area of Interest</label>
                  <input type="text" name="area_of_interest" value={formData.area_of_interest || ''} onChange={handleChange} className="w-full glass-input" placeholder="e.g. Data Science, UI/UX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} className="w-full glass-input bg-white cursor-pointer">
                    <option>Computer Science</option>
                    <option>Electrical Eng</option>
                    <option>Mechanical Eng</option>
                    <option>Civil Eng</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Year of Study</label>
                  <select name="year" value={formData.year} onChange={handleChange} className="w-full glass-input bg-white cursor-pointer">
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Skills / Technologies (comma separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full glass-input" placeholder="e.g. React, Python, Machine Learning" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Short Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full glass-input min-h-[100px] resize-none" placeholder="Passionate about building cool tech..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-indigo-50 pt-6 mt-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn URL</label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full glass-input" placeholder="https://linkedin.com/in/yourprofile" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">GitHub URL</label>
                  <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full glass-input" placeholder="https://github.com/yourusername" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full glass-input" placeholder="e.g. Prof. Alan Turing"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Faculty ID</label>
                  <input type="text" name="faculty_id" value={formData.faculty_id || ''} onChange={handleChange} className="w-full glass-input" placeholder="e.g. FAC-2023-014" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Designation</label>
                  <select name="designation" value={formData.designation} onChange={handleChange} className="w-full glass-input bg-white cursor-pointer">
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Adjunct Faculty">Adjunct Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} className="w-full glass-input bg-white cursor-pointer">
                    <option>Computer Science</option>
                    <option>Electrical Eng</option>
                    <option>Mechanical Eng</option>
                    <option>Civil Eng</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Research Domain / Expertise</label>
                  <input type="text" name="expertise" value={formData.expertise} onChange={handleChange} className="w-full glass-input" placeholder="e.g. AI, Cyber-Physical Systems" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Years of Experience</label>
                  <input type="number" min="0" name="experience_years" value={formData.experience_years} onChange={handleChange} className="w-full glass-input" placeholder="e.g. 15" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Office Location</label>
                  <input type="text" name="office_location" value={formData.office_location} onChange={handleChange} className="w-full glass-input" placeholder="e.g. Tech Building, Room 402" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Research Interests</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full glass-input min-h-[100px] resize-none" placeholder="Primary focus on scaling large models..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-indigo-50 pt-6 mt-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn URL</label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full glass-input" placeholder="https://linkedin.com/in/yourprofile" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Google Scholar Profile</label>
                  <input type="url" name="google_scholar" value={formData.google_scholar} onChange={handleChange} className="w-full glass-input" placeholder="https://scholar.google.com/citations..." />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={() => window.location.href = '/profile'}
              className="flex-1 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={loading} 
              type="submit" 
              className="flex-1 glass-button py-3 border-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex justify-center items-center gap-2 shadow-lg shadow-indigo-200 transition-all rounded-xl"
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

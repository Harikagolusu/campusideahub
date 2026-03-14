import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const { currentUser } = useAuth();
  
  const currentUserName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Anonymous';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://${window.location.hostname}:5000/api/community`);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !currentUser) return;
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/community`, {
        user_name: currentUserName,
        content: newPost
      });
      setNewPost('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (postId, text) => {
    if (!text.trim() || !currentUser) return;
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/community/${postId}/comments`, {
        user_name: currentUserName,
        text: text
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-500 mb-2">
          Student Community
        </h1>
        <p className="text-slate-600 font-medium">Discuss ideas, find collaborators, and extend projects.</p>
      </motion.div>

      {currentUser ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          onSubmit={handlePostSubmit} 
          className="glass-card p-6 mb-8 flex gap-4 border-indigo-100 shadow-md"
        >
          <div className="w-12 h-12 bg-indigo-500 rounded-full hidden sm:flex text-white font-bold items-center justify-center shadow-sm">
            {currentUserName.charAt(0)}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share an idea, ask a question, or find a team..."
              className="w-full glass-input min-h-[100px] resize-none pb-12 shadow-inner"
            />
            <button 
              type="submit" 
              className="absolute bottom-3 right-3 glass-button px-4 py-1.5 text-sm flex items-center gap-1 shadow-md hover:shadow-lg"
            >
              Post <Send size={14} />
            </button>
          </div>
        </motion.form>
      ) : (
        <div className="glass-card p-6 mb-8 text-center text-slate-500 bg-white/50">
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link> to share an idea, ask a question, or find a team.
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post, i) => (
          <motion.div 
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card p-6 border border-white hover:border-indigo-100 transition-colors shadow-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                {post.user_name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800">{post.user_name}</span>
                <span className="text-xs text-slate-400">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <p className="text-slate-700 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100 inline-block w-full">{post.content}</p>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-sm font-semibold text-slate-500 mb-4 flex items-center gap-2">
                <MessageSquare size={16} /> Comments ({post.comments.length})
              </div>
              
              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-2">
                {post.comments.map((comment, j) => (
                  <div key={j} className="flex gap-3 bg-white/60 p-3 rounded-xl shadow-sm border border-slate-50">
                    <User size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-xs text-slate-700 block mb-0.5">{comment.user_name}</span>
                      <span className="text-sm text-slate-600">{comment.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 glass-input focus:ring-1 text-sm bg-white"
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post._id, commentInputs[post._id])}
                />
                <button
                  onClick={() => handleCommentSubmit(post._id, commentInputs[post._id])}
                  className="p-2 border border-slate-200 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

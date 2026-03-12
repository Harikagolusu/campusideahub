import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, CheckCircle2, ChevronRight, Server, Save } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Chatbot() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { isBot: true, text: "Hi! I am the Campus AI Chatbot. Tell me what kind of project you want to build and I'll find similar ideas or generate a new concept for you." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { isBot: false, text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/chatbot`, { query: userMessage });
      const botResponse = res.data;
      setMessages(prev => [...prev, { 
        isBot: true, 
        text: botResponse.reply,
        type: botResponse.type || 'text',
        data: botResponse 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { isBot: true, text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveIdea = async (suggestion) => {
    try {
      const newProject = {
        title: suggestion.project_concept.split(' - ')[0] || "AI Recommended Idea",
        description: suggestion.project_concept + '\n\nImplementation Steps:\n' + suggestion.implementation_steps.join('\n') + '\n\nApplications:\n' + suggestion.example_applications.join('\n'),
        domain: 'Other',
        tech_stack: suggestion.technologies ? suggestion.technologies.join(', ') : '',
        keywords: ['AI_Suggestion'],
        year: currentUser?.year || new Date().getFullYear().toString(),
        submitted_by: currentUser?.name || currentUser?.email?.split('@')[0] || 'Anonymous',
        extends_id: null
      };

      const res = await axios.post(`http://${window.location.hostname}:5000/api/projects`, newProject);
      setIsOpen(false);
      navigate(`/project/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert('Error saving project idea.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all z-50 flex items-center justify-center animate-bounce group"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 glass-card shadow-2xl z-50 overflow-hidden flex flex-col border border-indigo-100"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Bot size={24} />
                <h3 className="font-semibold text-lg">AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex gap-2 max-w-[80%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${msg.isBot ? 'bg-indigo-500' : 'bg-cyan-500'}`}>
                      {msg.isBot ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.isBot 
                        ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm' 
                        : 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                    }`}>
                      <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                      
                      {msg.isBot && msg.type === 'existing_projects' && msg.data?.projects && (
                        <div className="mt-3 space-y-2">
                          {msg.data.projects.map(p => (
                            <div key={p.id} className="p-3 bg-slate-50 border border-indigo-100 rounded-xl">
                              <h4 className="font-bold text-indigo-900 leading-tight mb-1">{p.title}</h4>
                              <p className="text-xs text-slate-500 mb-2">Domain: {p.domain} • Tech: {p.tech_stack}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{p.similarity}% Match</span>
                                <button onClick={() => { setIsOpen(false); navigate(`/project/${p.id}`); }} className="text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-md transition-colors flex items-center">
                                  View <ChevronRight size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.isBot && msg.type === 'ai_suggestion' && msg.data?.suggestion && (
                        <div className="mt-4 space-y-4 text-xs">
                          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                            <h4 className="font-bold text-indigo-900 mb-1 flex items-center gap-1"><CheckCircle2 size={14}/> Concept</h4>
                            <p className="text-indigo-800 font-medium">{msg.data.suggestion.project_concept}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-1"><Server size={14}/> Tech Stack</h4>
                            <div className="flex flex-wrap gap-1">
                              {msg.data.suggestion.technologies?.map((t, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">{t}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-slate-700 mb-1">Steps</h4>
                            <ul className="list-disc pl-4 text-slate-600 space-y-1">
                              {msg.data.suggestion.implementation_steps?.slice(0,3).map((t, i) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ul>
                          </div>

                          <button 
                            onClick={() => handleSaveIdea(msg.data.suggestion)}
                            className="w-full mt-2 py-2 px-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                          >
                            <Save size={16} /> Save this Idea to CampusIdeaHub
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex gap-1">
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for ideas..."
                className="flex-1 glass-input focus:ring-1 bg-slate-50 text-sm"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

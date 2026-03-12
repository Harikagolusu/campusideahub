import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import axios from 'axios';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { isBot: true, text: "Hi! I am the Campus AI Chatbot. Try asking me to 'suggest ideas' or 'find AI projects'." }
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
      const botResponse = res.data.reply;
      setMessages(prev => [...prev, { isBot: true, text: botResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { isBot: true, text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
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
                      <p className="whitespace-pre-wrap">{msg.text}</p>
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

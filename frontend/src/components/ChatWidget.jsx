import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! I'm Hawkins, your event concierge. Ask me about upcoming events or how to register." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        const newHistory = [...messages, { role: 'user', text: userMsg }]; // Local update
        setMessages(newHistory);
        setInput('');
        setLoading(true);

        try {
            // Send history (last 10 messages to keep context light)
            const historyPayload = newHistory.slice(-10).map(m => ({ role: m.role, text: m.text }));

            const res = await api.post('/ai/chat', {
                message: userMsg,
                history: historyPayload
            });

            const reply = res.data.reply;

            // Check for Action Tag
            const actionMatch = reply.match(/\[ACTION:REGISTER_EVENT:(.*?)\]/);

            if (actionMatch) {
                const eventId = actionMatch[1];
                setMessages(prev => [...prev, { role: 'assistant', text: "Processing registration..." }]);

                try {
                    await api.post(`/registrations/${eventId.trim()}`, {});
                    setMessages(prev => [...prev, { role: 'assistant', text: "✅ Access Granted: You are now registered!" }]);
                } catch (regError) {
                    setMessages(prev => [...prev, { role: 'assistant', text: `❌ Registration Failed: ${regError.response?.data?.message || 'Unknown error'}` }]);
                }
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
            }

        } catch (error) {
            console.error('AI Error', error);
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting to the Upside Down. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 transform transition-all duration-300">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-black/90 border border-retro-cyan/50 rounded-lg shadow-2xl mb-4 w-80 md:w-96 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-retro-cyan/10 p-4 border-b border-retro-cyan/30 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-retro-cyan animate-pulse" />
                                <span className="font-retro text-retro-cyan text-sm tracking-widest">HAWKINS_LAB_AI</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded ${msg.role === 'user'
                                        ? 'bg-retro-cyan/20 text-gray-100 border border-retro-cyan/30 rounded-br-none'
                                        : 'bg-gray-800/80 text-gray-300 border border-gray-700 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800/80 text-gray-400 p-3 rounded rounded-bl-none text-xs italic animate-pulse">
                                        Processing neural query...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 border-t border-gray-800 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about events..."
                                className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-gray-200 text-sm focus:border-retro-cyan outline-none font-mono"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="p-2 bg-retro-cyan/20 text-retro-cyan rounded border border-retro-cyan/50 hover:bg-retro-cyan hover:text-black transition-colors disabled:opacity-50"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-retro-cyan text-black p-4 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transition-all border-2 border-transparent hover:border-white"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;

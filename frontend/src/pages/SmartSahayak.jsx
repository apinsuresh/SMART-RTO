import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  MessageSquare,
  Clock,
  FileText,
  Paperclip,
  Plus,
  Bot,
  User,
  Trash2,
  Mic,
  MoreVertical,
  CreditCard,
  RefreshCw,
  Calendar
} from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 'setup-1',
    type: 'bot',
    content: "Namaste! I am your **Smart RTO**. I can help you with vehicle registration, driving licenses, challan payments, and more.",
    time: '10:00 AM'
  },
  {
    id: 'setup-2',
    type: 'bot',
    content: "How can I assist you with your RTO services today?",
    time: '10:01 AM'
  }
];

const SUGGESTIONS = [
  { label: 'Check application status', icon: FileText },
  { label: 'How to pay challan', icon: CreditCard },
  { label: 'Renew Driving License', icon: RefreshCw },
  { label: 'Book Slot for Test', icon: Calendar },
];

export default function SmartSahayak() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const chatBottomRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = async (text) => {
    const msgText = typeof text === 'string' ? text : input;
    if (!msgText || !msgText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}-${Math.random()}`,
      type: 'user',
      content: msgText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build API messages context
      const apiMessages = messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }));
      apiMessages.push({ role: 'user', content: msgText.trim() });

      const res = await fetch('http://127.0.0.1:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'API error');

      const textReply = typeof data.reply === 'string' ? data.reply : data.reply?.content || 'I received an empty response. Please try again.';

      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}-${Math.random()}`,
        type: 'bot',
        content: textReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Chat AI Error:', err);
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}-${Math.random()}`,
        type: 'bot',
        content: '⚠️ Sorry, I am having trouble connecting to the network right now. Please try again later.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages(INITIAL_MESSAGES);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-transparent animate-in fade-in duration-500">
      <div className="flex flex-1 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">

        {/* Left Sidebar (Internal) */}
        <div className="hidden lg:flex flex-col w-72 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-6">
            <button
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              <Plus size={20} /> New Conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            <NavItem icon={<MessageSquare size={20} />} label="Active Assistant" active />
            <NavItem icon={<Clock size={20} />} label="Recent Queries" />
            <NavItem icon={<FileText size={20} />} label="Saved Documents" />
          </div>

          <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bot size={40} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Support Contact</p>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 truncate">support@smartrto.gov.in</p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Available Mon-Sat, 9AM-6PM IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1 relative bg-white dark:bg-slate-900">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                  <Bot className="text-white" size={24} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Smart RTO</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Agent v2.4</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={clearChat}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                title="Clear Conversation"
              >
                <Trash2 size={20} />
              </button>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 hover:scrollbar-thumb-slate-300">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 animate-in slide-in-from-bottom-2 duration-300 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border-2 ${msg.type === 'bot'
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700 shadow-sm'
                  }`}>
                  {msg.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`flex flex-col max-w-[75%] ${msg.type === 'user' ? 'items-end' : ''}`}>
                  <div className={`px-5 py-4 rounded-3xl text-[14px] leading-[1.6] shadow-sm ${msg.type === 'bot'
                      ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800'
                      : 'bg-red-600 text-white rounded-tr-none'
                    }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {(msg.content || '').toString().split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i} className="font-black underline underline-offset-4 decoration-red-500/30">{part}</strong> : part
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-2 px-1 uppercase tracking-tighter opacity-70">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center border-2 border-red-500">
                  <Bot size={20} />
                </div>
                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/80 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Bottom Control Area */}
          <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative">
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {SUGGESTIONS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSend(chip.label)}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-[12px] font-bold text-slate-600 dark:text-slate-400 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all shadow-sm active:scale-95"
                >
                  <chip.icon size={14} />
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Box Component */}
            <div className="relative group max-w-5xl mx-auto">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-[24px] px-5 py-4 focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:shadow-2xl focus-within:shadow-red-500/10 transition-all duration-300">
                <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors tooltip" title="Attach file">
                  <Paperclip size={22} />
                </button>
                <input
                  type="text"
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about RTO services..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 font-medium"
                />
                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3">
                  <button className="p-2 text-slate-400 hover:text-red-600 transition-colors hidden md:block">
                    <Mic size={22} />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() && !isTyping}
                    className="flex items-center gap-2 py-3 px-6 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/30 active:scale-95"
                  >
                    Send <Send size={16} />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-5 font-black uppercase tracking-[0.3em] opacity-40">Government of India AI Regulatory Compliance Secured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <button className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${active
        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 font-bold'
        : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
      }`}>
      {icon}
      <span className="text-sm tracking-tight">{label}</span>
    </button>
  );
}

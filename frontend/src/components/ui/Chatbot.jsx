import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react';

const FAQ_RESPONSES = {
  'driving licence': '🪪 To apply for a Driving Licence:\n1. Go to **Applications** in the sidebar.\n2. Fill the DL application form.\n3. Upload required documents (Aadhaar, photo, address proof).\n4. Book a test slot at your nearest RTO.',
  'vehicle registration': '🚗 Vehicle Registration requires:\n• Form 20 (application)\n• Insurance certificate\n• PUC certificate\n• ID & address proof\nVisit the Applications section to start.',
  'challan': '💳 To pay a traffic challan:\n1. Click **e-Challan** in the sidebar.\n2. Enter your vehicle number or challan ID.\n3. View the penalty details and pay online securely.',
  'track': '📋 To track your application:\n1. Click **Track Application** in the sidebar.\n2. Enter your Application ID.\n3. View real-time status updates.',
  'rc': '📄 For Duplicate RC:\n1. Go to **Applications** → New Application.\n2. Select "Duplicate RC" as the service.\n3. Upload your FIR copy and identity proof.\n4. Pay the applicable fee.',
  'transfer': '🔄 Vehicle ownership transfer requires:\n• Form 29 & 30 (seller & buyer)\n• Original RC book\n• Valid insurance\n• Identity proofs of both parties\nVisit Applications to submit.',
  'status': '📊 You can check your application status from the **Track Application** section or view it on your Dashboard under "Active Registrations".',
  'contact': '📞 RTO Helpline: **1800-120-4500** (Toll Free)\n📧 Email: support@smartrto.gov.in\n🕒 Available: Mon–Sat, 9AM–6PM',
  'hello': '👋 Hello! I\'m the Smart RTO Assistant. I can help you with:\n• Driving Licence queries\n• Vehicle Registration\n• Challan payment\n• Application tracking\n• RC & Transfer services\n\nWhat do you need help with?',
  'hi': '👋 Hi there! How can I assist you with RTO services today?',
  'help': '🤖 I can help you with:\n• **Driving Licence** – Apply, renew, track\n• **Vehicle Registration** – New & transfer\n• **e-Challan** – View & pay fines\n• **Track Application** – Real-time status\n• **Contact** – Reach RTO support\n\nJust type your query!',
};

function getBotResponse(message) {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return "🤖 I'm not sure about that. You can:\n• Try rephrasing your question\n• Call the RTO Helpline: **1800-120-4500**\n• Visit the **Help Center** section in the sidebar.";
}

function formatText(text) {
  return text
    .split('\n')
    .map((line, i) => {
      const boldReplaced = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} dangerouslySetInnerHTML={{ __html: boldReplaced }} className={i > 0 ? 'mt-1' : ''} />;
    });
}

const QUICK_PROMPTS = [
  'How to apply for DL?',
  'Pay my challan',
  'Track application',
  'Vehicle transfer',
  'Contact RTO',
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: "👋 Hello! I'm the **Smart RTO Assistant**.\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open]);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('open-rto-chatbot', handleOpen);
    return () => window.removeEventListener('open-rto-chatbot', handleOpen);
  }, []);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');
    const userMsg = { id: Date.now(), from: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    
    try {
      // Map existing messages to API format
      const apiMessages = messages.map(m => ({
        role: m.from === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      // Add new message
      apiMessages.push({ role: 'user', content: userText });

      const res = await fetch('https://smart-rto.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'API error');

      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: data.reply }]);
    } catch (err) {
      console.error('Chat AI Error:', err);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        from: 'bot', 
        text: '⚠️ Sorry, I am having trouble connecting to the network right now. Please try again later.' 
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl shadow-red-600/50 flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="RTO Assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[520px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-red-600 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">RTO Assistant</p>
              <p className="text-red-100 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block" /> Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.from === 'bot' ? 'bg-red-600 text-white' : 'bg-slate-600 text-white'}`}>
                  {msg.from === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.from === 'bot'
                    ? 'bg-slate-800 text-slate-100 rounded-bl-sm'
                    : 'bg-red-600 text-white rounded-br-sm'
                }`}>
                  {formatText(msg.text)}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 text-xs bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white border border-slate-700 hover:border-red-500 px-3 py-1 rounded-full transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-red-500 transition-colors">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about RTO services..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="w-7 h-7 bg-red-600 disabled:bg-slate-700 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

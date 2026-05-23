import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, X, TerminalSquare } from 'lucide-react';
import { aiService } from '../services/api';

export const AiCopilot: React.FC<{ incidentContext?: any }> = ({ incidentContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: "Hi! I'm your SRE AI Copilot. Ask me to analyze an incident, explain logs, or generate remediation scripts." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenCopilot = (e: any) => {
      setIsOpen(true);
      const incidentData = e.detail?.incident;
      const rcaData = e.detail?.rcaData;
      
      // We automatically send a message if we have context
      if (incidentData || rcaData) {
        const messageContext = `Can you provide more details about this incident? ${incidentData?.title || incidentData?.id || ''}`;
        setMessages(prev => [...prev, { role: 'user', content: messageContext }]);
        setLoading(true);
        
        aiService.askCopilot(messageContext, { ...incidentContext, incident: incidentData, rca: rcaData })
          .then(response => {
            setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
          })
          .catch(error => {
            setMessages(prev => [...prev, { role: 'ai', content: "Failed to connect to the Gemini inference engine." }]);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };

    window.addEventListener('open-copilot', handleOpenCopilot);
    return () => window.removeEventListener('open-copilot', handleOpenCopilot);
  }, [incidentContext]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await aiService.askCopilot(userMessage, incidentContext);
      setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Failed to connect to the Gemini inference engine." }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    // Simple markdown-like parser for bold and code blocks
    // In a real app we'd use react-markdown
    const parts = content.split(/(```[\s\S]*?```|\*\*.*?\*\*)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.substring(3, part.length - 3).replace(/^[\w]+\n/, '');
        return (
          <div key={i} className="my-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[6px] overflow-hidden transition-colors duration-300">
             <div className="bg-gray-50 dark:bg-gray-800 px-3 py-1.5 border-b border-gray-200 dark:border-gray-800 flex items-center transition-colors duration-300">
               <TerminalSquare className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 mr-1.5" />
               <span className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Snippet</span>
             </div>
             <pre className="p-3 text-[11px] font-mono text-gray-900 dark:text-gray-100 overflow-x-auto whitespace-pre-wrap">
               {code}
             </pre>
          </div>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-gray-900 dark:text-gray-100">{part.substring(2, part.length - 2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-purple-600 dark:bg-purple-500 rounded-[12px] shadow-[0_8px_30px_rgb(139,92,246,0.3)] hover:-translate-y-1 transition-all z-50 group flex items-center justify-center border border-purple-500 dark:border-[rgba(255,255,255,0.1)]"
      >
        <Sparkles className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/40 dark:bg-[#0A0D14]/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsOpen(false)}></div>
      
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[450px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 flex flex-col animate-in slide-in-from-right-full duration-300 transition-colors">
        
        {/* Header */}
        <div className="h-[64px] px-[20px] bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center shrink-0 transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center border border-purple-200 dark:border-purple-800/50 transition-colors duration-300">
              <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">SRE Copilot</h2>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center transition-colors duration-300">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1.5"></span>
                 Online (Gemini Flash)
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-[20px] space-y-[24px]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 transition-colors duration-300 ${
                  msg.role === 'user' 
                    ? 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ml-3' 
                    : 'bg-purple-600 dark:bg-purple-500 mr-3 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                }`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                </div>
                
                <div className={`p-[14px] text-[13px] leading-[1.6] transition-colors duration-300 ${
                  msg.role === 'user' 
                    ? 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[12px] rounded-tr-[4px] text-gray-900 dark:text-gray-100' 
                    : 'bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-[12px] rounded-tl-[4px] text-purple-900 dark:text-purple-100'
                }`}>
                  {renderMessageContent(msg.content)}
                </div>

              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[85%]">
                 <div className="shrink-0 w-7 h-7 rounded-full bg-purple-600 dark:bg-purple-500 mr-3 shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center mt-1 transition-colors duration-300">
                   <Bot className="w-3.5 h-3.5 text-white" />
                 </div>
                 <div className="p-[16px] bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-[12px] rounded-tl-[4px] flex items-center space-x-1.5 h-[48px] transition-colors duration-300">
                    <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-[16px] border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 transition-colors duration-300">
          <form onSubmit={handleSend} className="relative flex items-end bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[12px] focus-within:border-gray-300 dark:focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-200 dark:focus-within:ring-gray-700 transition-all overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Ask Copilot..."
              className="w-full bg-transparent text-gray-900 dark:text-gray-100 text-[13px] px-[16px] py-[14px] min-h-[48px] max-h-[120px] resize-none outline-none placeholder-gray-500 dark:placeholder-gray-400"
              rows={1}
            />
            <div className="p-[8px] shrink-0">
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center transition-all ${
                  !input.trim() || loading 
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                } ${loading ? 'animate-pulse' : ''}`}
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-500 dark:text-gray-400">AI can make mistakes. Verify important information.</span>
          </div>
        </div>

      </div>
    </>
  );
};

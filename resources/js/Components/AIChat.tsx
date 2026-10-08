import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Plus, ArrowUp, Bot, User } from 'lucide-react';
import { usePage } from '@inertiajs/react';

import ReactMarkdown from 'react-markdown';

type Message = {
  id: number;
  text: string;
  role: 'user' | 'model';
};

interface AIChatProps {
  onDragStart?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
}

export default function AIChat({ onDragStart, isDragging = false }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { auth } = usePage<any>().props;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const newUserMsg: Message = { id: Date.now(), text: userText, role: 'user' };
    const newMessages = [...messages, newUserMsg];

    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Setup CSRF token from page meta tag if available
      const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

      const response = await fetch('/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt: userText,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Oops, something went wrong.');
      }

      const botReply = data.reply;
      setMessages([...newMessages, { id: Date.now(), text: botReply, role: 'model' }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || 'Oops, something went wrong.';
      setMessages([...newMessages, { id: Date.now(), text: errorMsg, role: 'model' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div
      className="min-w-[320px] w-[400px] max-w-[90vw] min-h-[400px] h-[600px] max-h-[80vh] flex flex-col bg-[#09090b] text-zinc-50 rounded-[2rem] border border-zinc-800 shadow-xl overflow-hidden font-sans resize"
    >

      {/* Header */}
      <div
        className={`flex items-start justify-between p-6 border-b border-zinc-800/60 shrink-0 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={onDragStart}
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">WiliCafe AI Assistant</h2>
          <p className="text-sm text-zinc-400 mt-1">Asisten Penjualan</p>
        </div>
        <button
          onClick={handleClear}
          title="Clear chat"
          className="p-2.5 rounded-full hover:bg-zinc-800 transition-colors border border-zinc-800/80 group"
        >
          <RefreshCw className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent bg-slate-50 text-[#1c1c1c]">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 h-full">
            <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6">
              <Bot className="w-7 h-7 text-[#1c1c1c]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight text-[#1c1c1c]">
              Halo, {auth.user.name}!
            </h3>
            <p className="text-sm text-[#1c1c1c] max-w-[260px] leading-relaxed">
              What are we working on today? Type a message below to start a conversation with Gemini AI.
            </p>
          </div>
        ) : (
          /* Messages List */
          <div className="flex flex-col space-y-4 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-zinc-800'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-zinc-300" />}
                </div>
                <div
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-white text-zinc-950 rounded-tr-sm shadow-2xl border border-zinc-800/60'
                    : 'bg-white text-zinc-950 border border-zinc-800/60 rounded-tl-sm shadow-2xl overflow-hidden'
                    }`}
                >
                  {msg.role === 'model' ? (
                    <div className="prose prose-sm prose-zinc max-w-none prose-p:my-1 prose-ul:my-1 prose-headings:my-2">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-zinc-300" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-zinc-800/60 rounded-tl-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-[#1c1c1c] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#1c1c1c] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#1c1c1c] rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Area Input Chat */}
      <div className="p-4 pt-2 shrink-0 bg-slate-100">
        <div className="bg-slate-50 rounded-3xl p-3 border border-zinc-800/60 flex flex-col gap-2">

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm resize-none outline-none placeholder:text-[#1c1c1c] text-[#1c1c1c] min-h-[50px] max-h-[50px] p-2 leading-relaxed focus:ring-0 border-0"
            placeholder="Type your message here..."
            disabled={isLoading}
          />

          {/* Tombol Aksi Bawah */}
          <div className="flex items-center justify-between px-1 pb-1">
            <button className="p-2.5 rounded-full bg-zinc-800/60 hover:bg-zinc-700 text-white transition-colors border border-zinc-700/50">
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-full bg-zinc-800/60 hover:bg-zinc-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

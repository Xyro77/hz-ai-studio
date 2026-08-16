'use client';

import React, { useState } from 'react';
import { Video, Sparkles, Download, Film, Layers, Bot, Send, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Home() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'chat' | 'video'>('chat');

  // AI Chat States
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your AI Assistant. How can I help you today?' }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Video Generator States
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [style, setStyle] = useState('Cyberpunk Anime');

  // Chat Handler
  const handleSendMessage = async () => {
    if (!inputPrompt.trim() || isChatLoading) return;

    const userText = inputPrompt;
    setInputPrompt('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      // Free reliable poll AI chat response engine
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(userText)}`);
      const reply = await res.text();
      setMessages((prev) => [...prev, { sender: 'ai', text: reply || "I'm here to assist you!" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: "Service temporary busy. Please try again!" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Video Generator Handler
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setIsVideoLoading(true);

    try {
      const encodedPrompt = encodeURIComponent(`${videoPrompt}, ${style} style, 4k resolution, cinematic lighting`);
      const generatedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
      
      setTimeout(() => {
        setVideoUrl(generatedUrl);
        setIsVideoLoading(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setIsVideoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-white font-sans flex flex-col justify-between relative overflow-hidden">
      {/* Background Neon Glowing Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-fuchsia-600 to-cyan-400 rounded-xl shadow-[0_0_15px_rgba(255,0,255,0.5)]">
            {currentView === 'chat' ? <Bot className="w-6 h-6 text-black" /> : <Video className="w-6 h-6 text-black" />}
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            HZ_PROGAMER AI STUDIO
          </h1>
        </div>
        <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full animate-pulse">
          {currentView === 'chat' ? 'AI CHAT MODE' : 'VIDEO GENERATOR'}
        </span>
      </header>

      {/* VIEW 1: AI CHAT (FIRST PAGE) */}
      {currentView === 'chat' && (
        <main className="max-w-3xl mx-auto w-full px-6 py-6 flex-1 flex flex-col relative z-10">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-extrabold text-white mb-1">
              Smart <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">AI Assistant</span>
            </h2>
            <p className="text-gray-400 text-xs">Ask questions or request assistance in any language!</p>
          </div>

          {/* Chat Messages Box */}
          <div className="flex-1 bg-[#0e0f17]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-y-auto space-y-3 h-[380px] shadow-[0_0_25px_rgba(0,0,0,0.8)]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                      : 'bg-[#151724] text-gray-200 border border-white/10'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
                <Sparkles className="w-4 h-4" /> AI is thinking...
              </div>
            )}
          </div>

          {/* Chat Input Field */}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your prompt or question..."
              className="flex-1 bg-[#0e0f17] border border-cyan-500/30 rounded-xl px-4 py-3 text-xs text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
            />
            <button
              onClick={handleSendMessage}
              disabled={isChatLoading}
              className="px-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Switch Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView('video')}
              className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(255,0,255,0.4)] transition flex items-center justify-center gap-2"
            >
              Open AI Video Studio <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      )}

      {/* VIEW 2: AI VIDEO STUDIO */}
      {currentView === 'video' && (
        <main className="max-w-4xl mx-auto w-full px-6 py-6 flex-1 flex flex-col justify-center relative z-10">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentView('chat')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to AI Chat
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              Create <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">AI Videos & Media</span>
            </h2>
          </div>

          {/* Input Card */}
          <div className="bg-[#0e0f17]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-4">
            <textarea
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Type your detailed scene prompt here (e.g., A futuristic space sports car drifting on neon highway)..."
              className="w-full h-24 bg-[#05050a] border border-cyan-500/30 rounded-xl p-4 text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-fuchsia-500 transition text-xs"
            />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-fuchsia-400" />
                <span className="text-xs font-semibold text-gray-300">Style:</span>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="bg-[#151724] text-xs text-cyan-300 border border-cyan-500/30 rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option>Cyberpunk Anime</option>
                  <option>3D Futuristic Realism</option>
                  <option>Neon Pixel Art</option>
                  <option>Cinematic Unreal Engine 5</option>
                </select>
              </div>

              <button
                onClick={handleGenerateVideo}
                disabled={isVideoLoading}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-pink-500 hover:opacity-90 text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.4)] transition disabled:opacity-50"
              >
                {isVideoLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-black" /> Generating...
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 text-black" /> Generate Media
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Media Area */}
          <div className="mt-6">
            {videoUrl ? (
              <div className="relative group bg-[#0e0f17] border border-fuchsia-500/40 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,0,255,0.2)]">
                <img src={videoUrl} alt="AI Result" className="w-full h-[300px] object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <a
                    href={videoUrl}
                    target="_blank"
                    download
                    className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-xs flex items-center gap-2 hover:bg-cyan-400 transition"
                  >
                    <Download className="w-4 h-4" /> Download Result
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-44 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 gap-2">
                <Film className="w-6 h-6 text-gray-600 animate-pulse" />
                <p className="text-xs">Your generated AI media output will appear here.</p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-600 border-t border-white/5">
        HZ_PROGAMER Studio © Powered by High-Performance AI Engine
      </footer>
    </div>
  );
}
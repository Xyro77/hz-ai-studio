'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Code2, Bot, Copy, Check, Sparkles, RefreshCw, FileCode, Send, Terminal } from 'lucide-react';

export default function Home() {
  // Code States
  const [html, setHtml] = useState('<div class="box"><h1>HZ_PROGAMER AI Studio</h1><p>Welcome to Cyber Edition!</p><button onclick="alert(\'Welcome!\')">Click Me</button></div>');
  const [css, setCss] = useState('body {\n  background: #0d0f17;\n  color: #00ffcc;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n.box {\n  text-align: center;\n  padding: 20px;\n  border: 2px solid #00ffcc;\n  border-radius: 12px;\n  box-shadow: 0 0 15px rgba(0,255,204,0.4);\n}\nbutton {\n  background: #00ffcc;\n  color: #0d0f17;\n  border: none;\n  padding: 10px 20px;\n  font-weight: bold;\n  border-radius: 6px;\n  cursor: pointer;\n}');
  const [js, setJs] = useState('console.log("HZ AI Studio Initialized!");');
  
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [srcDoc, setSrcDoc] = useState('');

  // AI Chat States
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your AI Code Assistant. Ask me anything or request code explanations!' }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Live Preview Update
  const runCode = () => {
    setSrcDoc(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `);
  };

  useEffect(() => {
    runCode();
  }, []);

  // Gemini API Fetch with High-Demand Fallback
  const callGeminiAPI = async (prompt: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return "Error: API Key is missing in environment variables.";
    }

    const primaryModel = "gemini-3.7-flash";
    const fallbackModel = "gemini-2.5-flash";

    const fetchAI = async (model: string) => {
      return await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert coding assistant for HZ_PROGAMER AI Studio. 
                    Current Context:
                    HTML: ${html}
                    CSS: ${css}
                    JS: ${js}

                    User Request: ${prompt}`
                  }
                ]
              }
            ]
          }),
        }
      );
    };

    try {
      let response = await fetchAI(primaryModel);

      // High Demand (503/429) എറർ വന്നാൽ താനേ അടുത്ത മോഡൽ ട്രൈ ചെയ്യും
      if (!response.ok) {
        console.warn(`Primary model ${primaryModel} failed. Trying fallback model ${fallbackModel}...`);
        response = await fetchAI(fallbackModel);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "Sorry, I couldn't generate a valid response right now.";
      }
    } catch (err) {
      console.error(err);
      return "Network error or API high demand spike. Please try again in a few seconds.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputPrompt.trim() || isLoading) return;

    const userText = inputPrompt;
    setInputPrompt('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    const aiReply = await callGeminiAPI(userText);
    setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    setIsLoading(false);
  };

  const handleCopyCode = () => {
    const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#090a0f] text-gray-100 font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-cyan-500/20 bg-[#0d0f17]">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-cyan-400 animate-pulse" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-500 bg-clip-text text-transparent">
            HZ_PROGAMER AI Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runCode}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-lg shadow-[0_0_12px_rgba(0,255,204,0.4)] transition"
          >
            <Play className="w-4 h-4 fill-black" /> Run Code
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor Section */}
        <div className="w-1/2 flex flex-col border-r border-cyan-500/20 bg-[#0b0d14]">
          {/* Editor Header / Tabs */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#0e111a] border-b border-cyan-500/10">
            <div className="flex gap-2">
              {(['html', 'css', 'js'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md tracking-wider uppercase transition ${
                    activeTab === tab
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-gray-400 hover:text-cyan-400 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Textarea Input */}
          <textarea
            value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
            onChange={(e) => {
              const val = e.target.value;
              if (activeTab === 'html') setHtml(val);
              else if (activeTab === 'css') setCss(val);
              else setJs(val);
            }}
            className="flex-1 w-full p-4 bg-[#090a0f] text-cyan-300 font-mono text-sm leading-relaxed resize-none focus:outline-none selection:bg-cyan-500/30"
            spellCheck={false}
          />
        </div>

        {/* Live Preview Section */}
        <div className="w-1/4 flex flex-col border-r border-cyan-500/20 bg-white">
          <div className="px-4 py-2.5 bg-[#0e111a] text-gray-300 text-xs font-semibold flex items-center gap-2 border-b border-cyan-500/10">
            <Terminal className="w-4 h-4 text-cyan-400" /> Live Preview
          </div>
          <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            className="w-full flex-1 border-none bg-white"
          />
        </div>

        {/* AI Assistant Section */}
        <div className="w-1/4 flex flex-col bg-[#0b0d14]">
          <div className="px-4 py-2.5 bg-[#0e111a] border-b border-cyan-500/10 flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wide">
            <Bot className="w-4 h-4 text-cyan-400" /> Gemini AI Assistant
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed max-w-[90%] whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                      : 'bg-[#131722] text-gray-300 border border-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> AI is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-cyan-500/20 bg-[#0d0f17] flex gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AI to fix code or add features..."
              className="flex-1 bg-[#090a0f] border border-cyan-500/30 text-xs text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code, Image as ImageIcon, Video, Gamepad2, Bot, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// HZ_PROGAMER's Gemini API Key Setup
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6KNbGhZQVjcyKaJMpAYG7a8eF277-vIq5hdV_4MSwumuw' });

export default function HZStudio() {
  const [activeTab, setActiveTab] = useState('code');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'ഹലോ മച്ചാനേ! ഞാനാ **HZ_PROGAMER** ഉണ്ടാക്കിയ സീൻ AI! എന്ത് സംശയമുണ്ടെങ്കിലും ചോദിച്ചോ, ഏത് ഭാഷയും പറയും! 😎🔥' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Image & Video Generator States
  const [imgPrompt, setImgPrompt] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [imgLoading, setImgLoading] = useState(false);

  const [vidPrompt, setVidPrompt] = useState('');
  const [generatedVid, setGeneratedVid] = useState('');
  const [vidLoading, setVidLoading] = useState(false);

  // 1. All Language Multilingual AI Chat Logic (HZ_PROGAMER Personality)
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userText,
        config: {
          systemInstruction: `You are a hilarious, friendly, super-smart AI created exclusively by the legendary developer "HZ_PROGAMER".
          - You KNOW ALL LANGUAGES IN THE WORLD. You must reply fluently in whatever language the user talks to you (Malayalam, Manglish, Tamil, Hindi, English, Arabic, Spanish, etc.).
          - If anyone asks who created you, who made you, or who is your boss/master, ALWAYS boast proudly in a hilarious way that "HZ_PROGAMER" created you and gave you supreme powers!
          - Use a funny, cool tone with slangs like 'Scene', 'Machane', 'Poli', 'Alaiya'.`
        }
      });

      setMessages([...newMessages, { sender: 'ai', text: response.text }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'ai', text: 'സീനായി മച്ചാനേ! API എറർ വന്നു. ഒന്നുകൂടി ട്രൈ ചെയ്തു നോക്ക്!' }]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Real AI Photo Generator (Pollinations Engine)
  const handleGenerateImage = () => {
    if (!imgPrompt.trim()) return;
    setImgLoading(true);
    const encodedPrompt = encodeURIComponent(imgPrompt);
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}`;
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setGeneratedImg(imageUrl);
      setImgLoading(false);
    };
  };

  // 3. Real AI Video Generator Engine
  const handleGenerateVideo = () => {
    if (!vidPrompt.trim()) return;
    setVidLoading(true);
    const encodedPrompt = encodeURIComponent(vidPrompt);
    const videoUrl = `https://gen.pollinations.ai/video/${encodedPrompt}`;
    setGeneratedVid(videoUrl);
    setVidLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-amber-400 mb-8 flex items-center gap-2">
            🔥 HZ_PROGAMER AI
          </h1>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('code')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition ${activeTab === 'code' ? 'bg-amber-500 text-black font-bold' : 'hover:bg-gray-800 text-gray-400'}`}>
              <Code size={20} /> VS Code Studio
            </button>
            <button onClick={() => setActiveTab('image')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition ${activeTab === 'image' ? 'bg-amber-500 text-black font-bold' : 'hover:bg-gray-800 text-gray-400'}`}>
              <ImageIcon size={20} /> AI Photo Gen
            </button>
            <button onClick={() => setActiveTab('video')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition ${activeTab === 'video' ? 'bg-amber-500 text-black font-bold' : 'hover:bg-gray-800 text-gray-400'}`}>
              <Video size={20} /> AI Video Gen
            </button>
            <button onClick={() => setActiveTab('gaming')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition ${activeTab === 'gaming' ? 'bg-amber-500 text-black font-bold' : 'hover:bg-gray-800 text-gray-400'}`}>
              <Gamepad2 size={20} /> Gaming News
            </button>
          </nav>
        </div>
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 text-xs text-gray-400 text-center">
          Created by <span className="text-amber-400 font-bold">HZ_PROGAMER</span>
        </div>
      </div>

      {/* Center Main View Area */}
      <div className="flex-1 flex">
        <div className="flex-1 bg-gray-900 border-r border-gray-800 flex flex-col">
          {/* 1. VS CODE STUDIO TAB */}
          {activeTab === 'code' && (
            <div className="h-full flex flex-col">
              <div className="p-3 bg-gray-800 text-xs font-mono text-gray-300 border-b border-gray-700">index.js - HZ Code Web Studio</div>
              <div className="flex-1">
                <Editor height="100%" defaultLanguage="javascript" theme="vs-dark" defaultValue="// Powered by HZ_PROGAMER AI Web Studio\nconsole.log('Scene aakum machane!');" />
              </div>
            </div>
          )}

          {/* 2. AI PHOTO GENERATOR TAB */}
          {activeTab === 'image' && (
            <div className="p-8 flex flex-col items-center overflow-y-auto">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">AI Photo Generator</h2>
              <div className="w-full max-w-xl flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={imgPrompt} 
                  onChange={(e) => setImgPrompt(e.target.value)}
                  placeholder="ഫോട്ടോ പ്രോംപ്റ്റ് അടിക്കുക (Eg: Cyberpunk Gaming Room)..." 
                  className="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:outline-none focus:border-amber-500" 
                />
                <button onClick={handleGenerateImage} className="bg-amber-500 font-bold text-black px-6 py-3 rounded-lg hover:bg-amber-400 flex items-center gap-2">
                  {imgLoading && <Loader2 className="animate-spin" size={18} />} Generate 🎨
                </button>
              </div>

              {generatedImg && (
                <div className="border border-gray-700 rounded-lg p-2 bg-gray-800 max-w-md">
                  <img src={generatedImg} alt="AI Generated" className="rounded-lg w-full h-auto" />
                </div>
              )}
            </div>
          )}

          {/* 3. AI VIDEO GENERATOR TAB */}
          {activeTab === 'video' && (
            <div className="p-8 flex flex-col items-center overflow-y-auto">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">AI Video Generator</h2>
              <div className="w-full max-w-xl flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={vidPrompt} 
                  onChange={(e) => setVidPrompt(e.target.value)}
                  placeholder="വീഡിയോ പ്രോംപ്റ്റ് അടിക്കുക (Eg: Space station orbiting Earth)..." 
                  className="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:outline-none focus:border-amber-500" 
                />
                <button onClick={handleGenerateVideo} className="bg-amber-500 font-bold text-black px-6 py-3 rounded-lg hover:bg-amber-400 flex items-center gap-2">
                  {vidLoading && <Loader2 className="animate-spin" size={18} />} Generate 🎬
                </button>
              </div>

              {generatedVid && (
                <div className="border border-gray-700 rounded-lg p-2 bg-gray-800 max-w-md">
                  <video src={generatedVid} controls autoPlay loop className="rounded-lg w-full h-auto" />
                </div>
              )}
            </div>
          )}

          {/* 4. GAMING NEWS TAB */}
          {activeTab === 'gaming' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Latest Gaming News 🎮</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="font-bold text-lg text-amber-300">GTA VI & Minecraft News</h3>
                  <p className="text-gray-400 text-sm mt-1">HZ_PROGAMER നിങ്ങൾക്കായി എത്തിക്കുന്ന ഏറ്റവും പുതിയ ഗെയിമിംഗ് ലീക്കുകളും അപ്‌ഡേറ്റുകളും!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Chatbot Right Panel */}
        <div className="w-96 flex flex-col justify-between bg-gray-950">
          <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center gap-2">
            <Bot className="text-amber-400" />
            <h3 className="font-bold">HZ Multilingual AI Bot</h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-lg text-sm max-w-[85%] ${m.sender === 'user' ? 'bg-amber-500 text-black font-semibold' : 'bg-gray-800 text-gray-200'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-amber-400 animate-pulse">HZ AI ആലോചിക്കുകയാണ്... 💭</div>}
          </div>

          <div className="p-4 border-t border-gray-800 flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ആരാ നിന്നെ ഉണ്ടാക്കിയേ എന്ന് ചോദിച്ചോ..." 
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
            <button onClick={handleSend} className="bg-amber-500 p-2 rounded-lg text-black font-bold hover:bg-amber-400">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
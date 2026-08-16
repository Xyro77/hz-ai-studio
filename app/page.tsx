'use client';

import React, { useState } from 'react';
import { Video, Sparkles, Play, Download, Film, Layers } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [style, setStyle] = useState('Cyberpunk Anime');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      // Direct Reliable AI Generation Endpoint
      const encodedPrompt = encodeURIComponent(`${prompt}, ${style} style, 4k resolution, cinematic lighting`);
      const generatedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
      
      // Simulate realistic AI generation loading
      setTimeout(() => {
        setVideoUrl(generatedUrl);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-white font-sans flex flex-col justify-between relative overflow-hidden">
      {/* Background Glowing Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-fuchsia-600 to-cyan-400 rounded-xl shadow-[0_0_15px_rgba(255,0,255,0.5)]">
            <Video className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            HZ_PROGAMER AI VIDEO STUDIO
          </h1>
        </div>
        <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full animate-pulse">
          AI GENERATOR ACTIVE
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Transform Text Into <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">AI Media</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            നിങ്ങൾക്ക് ആവശ്യമുള്ള വീഡിയോ/ആനിമേഷൻ പ്രോംപ്റ്റ് ടൈപ്പ് ചെയ്ത് കൊടുക്കൂ!
          </p>
        </div>

        {/* Input & Controls Card */}
        <div className="bg-[#0e0f17]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A cyberpunk warrior riding a neon lightcycle through rain..."
            className="w-full h-28 bg-[#05050a] border border-cyan-500/30 rounded-xl p-4 text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition text-sm"
          />

          {/* Style Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-fuchsia-400" />
              <span className="text-xs font-semibold text-gray-300">Style:</span>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="bg-[#151724] text-xs text-cyan-300 border border-cyan-500/30 rounded-lg px-3 py-2 focus:outline-none"
              >
                <option>Cyberpunk Anime</option>
                <option>3D Futuristic Realism</option>
                <option>Neon Pixel Art</option>
                <option>Cinematic Unreal Engine 5</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-pink-500 hover:opacity-90 text-black font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.4)] transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" /> Generating...
                </>
              ) : (
                <>
                  <Film className="w-4 h-4 text-black" /> Generate AI Media
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display Result Area */}
        <div className="mt-8">
          {videoUrl ? (
            <div className="relative group bg-[#0e0f17] border border-fuchsia-500/40 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,0,255,0.2)]">
              <img
                src={videoUrl}
                alt="AI Generated Preview"
                className="w-full h-[360px] object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
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
            <div className="h-64 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 gap-2">
              <Play className="w-8 h-8 text-gray-600 animate-pulse" />
              <p className="text-xs">Your generated media output will appear here.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-600 border-t border-white/5">
        HZ_PROGAMER Studio © Powered by High-Performance AI Engine
      </footer>
    </div>
  );
}
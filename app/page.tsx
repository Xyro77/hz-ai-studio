"use client";

import React, { useState, useEffect } from "react";
import { 
  Code2, Bot, Send, Sparkles, Play, Terminal, Layers, 
  Copy, Check, Eye, HelpCircle, Download, Monitor, Palette 
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "ഹലോ! ഞാൻ HZ_PROGAMER AI Studio Assistant. നിങ്ങളുടെ കോഡ് ഹെൽപ്പറും ക്രിയേറ്റീവ് പാർട്ണറുമാണ്! എങ്ങനെ സഹായിക്കണം?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [theme, setTheme] = useState<"cyber" | "neon" | "dark">("cyber");

  // Multi-file Code State
  const [htmlCode, setHtmlCode] = useState<string>(
    `<div class="card">\n  <h1>HZ_PROGAMER AI Studio</h1>\n  <p>Welcome to your ultra-colorful web IDE!</p>\n  <button onclick="showAlert()">Click Me</button>\n</div>`
  );
  const [cssCode, setCssCode] = useState<string>(
    `body { background: #0f172a; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 90vh; margin: 0; }\n.card { background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 2rem; border-radius: 1rem; text-align: center; box-shadow: 0 10px 25px rgba(236,72,153,0.5); }\nh1 { margin-top: 0; font-size: 1.8rem; }\nbutton { background: #00f2fe; border: none; padding: 0.6rem 1.2rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.2s; }\nbutton:hover { transform: scale(1.05); }`
  );
  const [jsCode, setJsCode] = useState<string>(
    `function showAlert() {\n  alert("Hello from HZ_PROGAMER AI Studio!");\n}`
  );

  const [activeFile, setActiveFile] = useState<"html" | "css" | "js">("html");
  const [output, setOutput] = useState<string>("");
  const [previewSrc, setPreviewSrc] = useState<string>("");

  // Get current active code string
  const getActiveCode = () => {
    if (activeFile === "html") return htmlCode;
    if (activeFile === "css") return cssCode;
    return jsCode;
  };

  const setActiveCode = (val: string) => {
    if (activeFile === "html") setHtmlCode(val);
    else if (activeFile === "css") setCssCode(val);
    else setJsCode(val);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [htmlCode, cssCode, jsCode, activeFile]);

  // Handle AI Chat & API
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      if (!apiKey) throw new Error("API Key കണ്ടെത്തിയില്ല. Vercel-ൽ NEXT_PUBLIC_GEMINI_API_KEY ചേർത്തിട്ടുണ്ടോ എന്ന് പരിശോധിക്കുക.");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are HZ_PROGAMER AI Studio Assistant. Provide energetic, helpful answers for developers.\nQuery: ${textToSend}` }] }],
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "API റൂട്ടിംഗ് പരാജയപ്പെട്ടു.");

      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "മറുപടി നൽകാൻ കഴിഞ്ഞില്ല.";
      setMessages((prev) => [...prev, { sender: "ai", text: responseText }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { sender: "ai", text: `Error: ${error?.message || "തകരാർ സംഭവിച്ചു."}` }]);
    } finally {
      setLoading(false);
    }
  };

  // Run Code & Build Live Preview
  const runCode = () => {
    setOutput("Executing project & generating Live Preview...\n");
    const combinedSrc = `
      <!DOCTYPE html>
      <html>
        <head><style>${cssCode}</style></head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
    setPreviewSrc(combinedSrc);
    setActiveTab("preview");

    try {
      let logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        logs.push(args.join(" "));
        originalLog(...args);
      };
      const evalFunc = new Function(jsCode);
      evalFunc();
      console.log = originalLog;
      setOutput(logs.join("\n") || "Code executed smoothly! Live Preview updated.");
    } catch (err: any) {
      setOutput(`JS Error: ${err?.message || err}`);
    }
  };

  // Explain Active Code with AI
  const explainCode = () => {
    const prompt = `ഈ ${activeFile.toUpperCase()} കോഡ് വിശദീകരിച്ചു തരൂ:\n\`\`\`${activeFile}\n${getActiveCode()}\n\`\`\``;
    handleSendMessage(prompt);
  };

  // Copy Code to Clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Code Files
  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([getActiveCode()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `index.${activeFile}`;
    document.body.appendChild(element);
    element.click();
  };

  // Theme Styles
  const themeBg = theme === "cyber" 
    ? "from-slate-950 via-purple-950 to-slate-900" 
    : theme === "neon" 
    ? "from-gray-950 via-blue-950 to-emerald-950" 
    : "from-black via-slate-950 to-zinc-950";

  return (
    <div className={`flex h-screen bg-gradient-to-br ${themeBg} text-slate-100 font-sans overflow-hidden`}>
      {/* Left IDE Panel */}
      <div className="w-1/2 border-r border-purple-900/40 flex flex-col backdrop-blur-md">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between p-3 bg-slate-900/80 border-b border-purple-800/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/20">
              <Code2 className="text-white w-5 h-5" />
            </div>
            <h1 className="font-extrabold text-lg bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              HZ_PROGAMER IDE
            </h1>
          </div>

          {/* Theme Selector & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "cyber" ? "neon" : theme === "neon" ? "dark" : "cyber")}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-pink-400 border border-pink-500/30 transition"
              title="Switch Theme"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={explainCode}
              className="flex items-center gap-1.5 bg-purple-900/50 hover:bg-purple-800 text-purple-300 border border-purple-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <HelpCircle className="w-3.5 h-3.5" /> AI Explain
            </button>
            <button
              onClick={runCode}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition shadow-lg shadow-emerald-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run & Preview
            </button>
          </div>
        </div>

        {/* File Tabs & Views */}
        <div className="flex justify-between items-center bg-slate-950/70 border-b border-purple-900/30 px-3 py-1.5 text-xs">
          <div className="flex gap-2">
            {(["html", "css", "js"] as const).map((file) => (
              <button
                key={file}
                onClick={() => { setActiveFile(file); setActiveTab("code"); }}
                className={`px-3 py-1 rounded-md font-mono transition uppercase ${
                  activeFile === file && activeTab === "code"
                    ? "bg-pink-600 text-white font-bold shadow-md shadow-pink-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                .{file}
              </button>
            ))}
          </div>

          {/* Code vs Live Preview Switch */}
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
                activeTab === "code" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> Editor
            </button>
            <button
              onClick={() => { runCode(); setActiveTab("preview"); }}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
                activeTab === "preview" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>
        </div>

        {/* Main Code Editor / Live Preview Display */}
        <div className="relative flex-1 bg-[#12141d]/90 overflow-hidden font-mono text-sm">
          {activeTab === "code" ? (
            <>
              {/* Copy/Download Action Floating Bar */}
              <div className="absolute right-4 top-4 z-20 flex gap-2">
                <button
                  onClick={copyCode}
                  className="bg-slate-800/80 hover:bg-slate-700 p-2 rounded-lg border border-slate-700 text-cyan-400 backdrop-blur"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={downloadCode}
                  className="bg-slate-800/80 hover:bg-slate-700 p-2 rounded-lg border border-slate-700 text-pink-400 backdrop-blur"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <textarea
                value={getActiveCode()}
                onChange={(e) => setActiveCode(e.target.value)}
                className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-pink-500 focus:outline-none resize-none z-10 font-mono leading-relaxed"
                style={{ WebkitTextFillColor: "transparent" }}
                spellCheck="false"
              />
              <pre className="absolute inset-0 m-0 p-4 pointer-events-none overflow-hidden font-mono leading-relaxed">
                <code className={`language-${activeFile === "html" ? "markup" : activeFile}`}>
                  {getActiveCode()}
                </code>
              </pre>
            </>
          ) : (
            <iframe
              srcDoc={previewSrc}
              title="Live Preview"
              className="w-full h-full bg-white border-none"
            />
          )}
        </div>

        {/* Terminal Section */}
        <div className="h-1/3 border-t border-purple-900/40 bg-slate-950/80 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-purple-900/30 text-xs text-slate-400">
            <span className="flex items-center gap-2 text-emerald-400 font-mono">
              <Terminal className="w-4 h-4" /> Studio Terminal Output
            </span>
          </div>
          <pre className="p-4 font-mono text-xs text-emerald-400 overflow-y-auto flex-1">
            {output || "റൺ ബട്ടൺ പ്രസ് ചെയ്താൽ റിസൾട്ട് ഇവിടെ കാണാം..."}
          </pre>
        </div>
      </div>

      {/* Right AI Assistant Chat Panel */}
      <div className="w-1/2 flex flex-col bg-slate-900/30 backdrop-blur-md">
        <div className="p-4 border-b border-purple-900/40 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-pink-400 w-5 h-5 animate-pulse" />
            <h2 className="font-bold text-slate-100">HZ Studio AI Assistant</h2>
          </div>
          <span className="text-xs px-2 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-300 font-mono">
            Gemini 3.7 Flash Active
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                    : "bg-slate-800/90 text-slate-100 border border-purple-500/30 rounded-bl-none shadow-purple-950/50"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 border border-purple-500/40 text-purple-300 text-xs rounded-2xl px-4 py-3 flex items-center gap-2 shadow-lg shadow-purple-950">
                <Sparkles className="w-4 h-4 animate-spin text-pink-400" />
                HZ AI കോഡുകൾ ചിന്തിച്ചു ഉണ്ടാക്കുന്നു...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-purple-900/40 bg-slate-900/80 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="AI-യോട് കോഡുകൾ ചോദിക്കൂ (eg: Make an awesome glowing button...)"
            className="flex-1 bg-slate-950 border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white p-3 rounded-xl transition shadow-lg shadow-pink-500/25 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
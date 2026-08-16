"use client";

import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Code2, Bot, Send, Sparkles, Play, Terminal, Layers } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup"; // HTML

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "ഹലോ! ഞാൻ HZ_PROGAMER AI Studio Assistant. നിങ്ങളെ എങ്ങനെയാണ് സഹായിക്കേണ്ടത്?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Code Editor state
  const [code, setCode] = useState<string>(
    `// HZ_PROGAMER AI Studio Code Editor\nfunction greet(name) {\n  console.log("Welcome to HZ_PROGAMER AI Studio, " + name + "!");\n}\n\ngreet("Developer");`
  );
  const [language, setLanguage] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("");

  // Auto detect code language based on simple syntax heuristics
  useEffect(() => {
    const trimmed = code.trim();
    if (trimmed.startsWith("<") || trimmed.includes("</div>") || trimmed.includes("<html>")) {
      setLanguage("html");
    } else if (trimmed.includes("def ") || (trimmed.includes("import ") && trimmed.includes("from ") && !trimmed.includes(";"))) {
      setLanguage("python");
    } else if (trimmed.includes("interface ") || trimmed.includes("type ") || trimmed.includes(": string") || trimmed.includes(": number")) {
      setLanguage("typescript");
    } else if (trimmed.includes("{") && (trimmed.includes("margin:") || trimmed.includes("color:") || trimmed.includes("padding:"))) {
      setLanguage("css");
    } else if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      setLanguage("json");
    } else {
      setLanguage("javascript");
    }
  }, [code]);

  // Trigger Prism syntax highlighting update
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      
      if (!apiKey) {
        throw new Error("API Key കണ്ടെത്തിയില്ല. Vercel-ൽ NEXT_PUBLIC_GEMINI_API_KEY ചേർത്തിട്ടുണ്ടോ എന്ന് ഉറപ്പുവരുത്തുക.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      // Updated model endpoint alias
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const prompt = `You are HZ_PROGAMER AI Studio Assistant created by HZ_PROGAMER. Answer succinctly and helpfully.\nUser query: ${input}`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text() || "എനിക്ക് മറുപടി നൽകാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.";

      const aiMessage: Message = {
        sender: "ai",
        text: responseText,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Error: ${error?.message || "API സേവനത്തിൽ തകരാർ സംഭവിച്ചു."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const runCode = () => {
    setOutput("Running code...\n");
    try {
      let logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        logs.push(args.join(" "));
        originalLog(...args);
      };

      const evalFunc = new Function(code);
      evalFunc();

      console.log = originalLog;
      setOutput(logs.join("\n") || "Code executed successfully with no output.");
    } catch (err: any) {
      setOutput(`Error: ${err?.message || err}`);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Left Panel: Code Editor with Syntax Highlighting */}
      <div className="w-1/2 border-r border-slate-800 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="text-cyan-400 w-5 h-5" />
            <h1 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              HZ_PROGAMER AI Studio Editor
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-md border border-slate-700 text-xs text-slate-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="capitalize font-mono text-cyan-300">{language}</span>
            </div>
            <button
              onClick={runCode}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-lg shadow-emerald-950"
            >
              <Play className="w-4 h-4 fill-current" /> Run Code
            </button>
          </div>
        </div>

        {/* Code Input & Highlight Layer */}
        <div className="relative flex-1 bg-[#1d1f21] overflow-hidden font-mono text-sm">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-cyan-400 focus:outline-none resize-none z-10 font-mono text-sm leading-relaxed"
            style={{ WebkitTextFillColor: "transparent" }}
            spellCheck="false"
          />
          <pre className="absolute inset-0 m-0 p-4 pointer-events-none overflow-hidden font-mono text-sm leading-relaxed">
            <code className={`language-${language}`}>{code}</code>
          </pre>
        </div>

        {/* Output Terminal */}
        <div className="h-1/3 border-t border-slate-800 bg-slate-900/50 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <Terminal className="w-4 h-4 text-emerald-400" /> Output Terminal
          </div>
          <pre className="p-4 font-mono text-xs text-emerald-400 overflow-y-auto flex-1">
            {output || "Click 'Run Code' to see execution results."}
          </pre>
        </div>
      </div>

      {/* Right Panel: AI Chat */}
      <div className="w-1/2 flex flex-col bg-slate-900/40">
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center gap-2">
          <Bot className="text-purple-400 w-5 h-5" />
          <h2 className="font-semibold text-slate-200">AI Assistant</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 text-slate-400 text-xs rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                HZ AI ചിന്തിക്കുന്നു...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="HZ AI-യോട് എന്തെങ്കിലും ചോദിക്കൂ..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-xl transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
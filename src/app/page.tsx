'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Search, Info, Github, Moon, Sun, Terminal, Lock, Box, Cpu, Copy, Check, ShieldCheck, EyeOff, FileText, Code, Eye, ChevronUp, Quote } from 'lucide-react';
import { InputSection } from '@/components/InputSection';
import { ChainViewer } from '@/components/ChainViewer';
import { cn } from '@/lib/utils';

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isCopied, setIsCopied] = useState(false);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [devView, setDevView] = useState<'none' | 'transcript' | 'raw'>('none');
  const [rawInput, setRawInput] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleAnalyze = async (content: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setRawInput(content);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Deep extraction failed');
      }

      const data = await response.json();
      setResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!result || !navigator?.clipboard) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy JSON:', err));
  };

  const generateTranscript = () => {
    if (!result) return '';
    return result.history.map((node: any, i: number) => {
      const header = `=== MESSAGE ${i + 1} (${i === 0 ? 'ORIGIN' : i === result.history.length - 1 ? 'LATEST' : 'HOP'}) ===`;
      const meta = `DATE: ${node.date_iso || node.date_raw || 'UNKNOWN'}
FROM: ${node.from?.name ? `${node.from.name} <${node.from.address}>` : node.from?.address || 'UNKNOWN'}
SUBJECT: ${node.subject || 'N/A'}`;

      return `${header}\n${meta}\n${'-'.repeat(50)}\n${node.text?.trim() || '(No content)'}`;
    }).join('\n\n\n');
  };

  const handleCopyText = () => {
    const text = generateTranscript();
    if (!text || !navigator?.clipboard) return;

    navigator.clipboard.writeText(text)
      .then(() => {
        setIsTextCopied(true);
        setTimeout(() => setIsTextCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy text:', err));
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Dynamic Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[10%] left-[20%] w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 transition-all duration-500 border-b border-white/10 dark:border-white/5 backdrop-blur-md bg-white/50 dark:bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-gradient-to-br from-slate-900 to-black p-3 rounded-2xl text-white shadow-2xl transition-transform group-hover:scale-105 group-hover:rotate-3">
                <Mail size={24} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase dark:text-white">
                Origin <span className="text-blue-500">Reveal</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Digital Forensic Engine v1.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:border-blue-500/20 active:scale-90 transition-all shadow-sm"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <a
              href="https://github.com/yodjii/email-origin-chain"
              target="_blank"
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:border-blue-500/20 active:scale-90 transition-all shadow-sm"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </nav>

      <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-32">
        {/* Cinematic Hero */}
        <section className="text-center space-y-8 mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-500/20 text-xs font-black uppercase tracking-widest animate-bounce">
            <Lock size={14} /> Encrypted Thread Analysis
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
            EXPOSE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-400">HIDDEN SOURCE</span> OF ANY EMAIL.
          </h2>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Reconstruct complete conversation trails with forensic precision. Upload .eml files to reveal depths that traditional clients hide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 opacity-80 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider cursor-help" title="Data is processed in-memory and instantly identified. No database storage.">
              <ShieldCheck size={14} /> Zero Retention
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider cursor-help" title="Execution occurs in volatile RAM environment only.">
              <Cpu size={14} /> RAM Processing Only
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider cursor-help" title="Your input is never logged to any permanent file or external server.">
              <EyeOff size={14} /> 100% Private
            </div>
          </div>
        </section>

        {/* Core Application Grid */}
        <div className="grid grid-cols-1 gap-16 relative">
          <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />

          {error && (
            <div className="p-6 bg-red-50 dark:bg-red-500/5 border-2 border-red-100 dark:border-red-500/20 rounded-3xl text-red-600 dark:text-red-400 font-bold flex items-center gap-4 animate-shake">
              <div className="bg-red-500 text-white p-2 rounded-xl">
                <Info size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest opacity-60">System Fault Detected</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {result && (
            <div id="results" className="space-y-12 pt-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20">
                      <Search size={22} />
                    </div>
                    Trace Analysis
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Reconstruction sequence based on hybrid detection patterns</p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all"
                      title="Copy raw analysis object"
                    >
                      {isCopied ? <Check size={14} className="text-emerald-500" /> : <Code size={14} />}
                      {isCopied ? "Copied" : "JSON"}
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
                    <button
                      onClick={() => setDevView(prev => prev === 'transcript' ? 'none' : 'transcript')}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                        devView === 'transcript'
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800"
                      )}
                      title="View sequential transcript"
                    >
                      {devView === 'transcript' ? <ChevronUp size={14} /> : <Eye size={14} />}
                      VIEW
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
                    <button
                      onClick={() => setDevView(prev => prev === 'raw' ? 'none' : 'raw')}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                        devView === 'raw'
                          ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800"
                      )}
                      title="View original EML source"
                    >
                      {devView === 'raw' ? <ChevronUp size={14} /> : <Terminal size={14} />}
                      RAW
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
                    <button
                      onClick={handleCopyText}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all"
                      title="Copy full transcript"
                    >
                      {isTextCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      {isTextCopied ? "Copied" : "Text"}
                    </button>
                  </div>

                  <div className="px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-[0.2em]">
                    {result.history.length} <span className="opacity-50">Hops</span>
                  </div>
                </div>
              </div>

              {/* Deep Source Content Preview */}
              <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/20">
                        <Quote size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Extracted Deep Source</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60">Cleaned Body Transcription</p>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Confidence</span>
                      <div className="flex gap-1 mt-1 justify-end">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 w-4 bg-emerald-500 rounded-full" />)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/50 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    <pre className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm italic">
                      {result.history[0]?.text || "No readable content found in the deepest source."}
                    </pre>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-slate-50 dark:border-slate-800/50 pt-6">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Originator</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {result.history[0]?.from?.name || result.history[0]?.from?.address || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subject Integrity</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 italic">
                          {result.history[0]?.subject || 'No Subject'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer Tools Panel */}
              {devView !== 'none' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
                      {devView === 'transcript' ? 'Sequential Audit Trail' : 'Original EML Source'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 font-mono text-[11px] overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                    <pre className={cn(
                      "text-slate-700 dark:text-slate-300 leading-relaxed",
                      devView === 'transcript' ? "whitespace-pre-wrap" : "whitespace-pre"
                    )}>
                      {devView === 'transcript' ? generateTranscript() : rawInput}
                    </pre>
                  </div>
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={() => setDevView('none')}
                      className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
                    >
                      <ChevronUp size={12} /> Hide Tools
                    </button>
                  </div>
                </div>
              )}

              <ChainViewer history={result.history} />
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center space-y-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Built for Transparency</p>
          <p className="text-sm text-slate-500 font-medium">© 2026 Email Origin Reveal. An Open Source Initiative by Flo (yodjii)</p>
        </div>
      </footer>
    </main>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputSectionProps {
    onAnalyze: (content: string) => void;
    isLoading: boolean;
}

export function InputSection({ onAnalyze, isLoading }: InputSectionProps) {
    const [tab, setTab] = useState<'text' | 'file'>('file');
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const processFile = async (file: File) => {
        setFileName(file.name);
        const content = await file.text();
        setText(content);
        if (content.trim()) {
            onAnalyze(content);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleSubmit = () => {
        if (!text.trim()) return;
        onAnalyze(text);
    };

    return (
        <div className="w-full glass-card rounded-2xl p-2 transition-all duration-500 hover:shadow-2xl">
            <div className="flex p-1 gap-1">
                <button
                    onClick={() => setTab('file')}
                    className={cn(
                        "flex-1 py-3 flex items-center justify-center gap-2 rounded-xl transition-all duration-300",
                        tab === 'file'
                            ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold"
                            : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/30"
                    )}
                >
                    <Upload size={16} />
                    <span className="text-sm">Upload EML</span>
                </button>
                <button
                    onClick={() => setTab('text')}
                    className={cn(
                        "flex-1 py-3 flex items-center justify-center gap-2 rounded-xl transition-all duration-300",
                        tab === 'text'
                            ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold"
                            : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/30"
                    )}
                >
                    <FileText size={16} />
                    <span className="text-sm">Direct Paste</span>
                </button>
            </div>

            <div className="p-4 pt-2">
                {tab === 'text' ? (
                    <div className="relative group">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Drop your email content here..."
                            className="w-full h-64 p-5 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none font-mono text-sm leading-relaxed"
                        />
                        {text === '' && (
                            <div className="absolute top-5 right-5 text-slate-300 dark:text-slate-700 group-focus-within:opacity-0 transition-opacity">
                                <Sparkles size={24} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500",
                            isDragging
                                ? "border-blue-500 bg-blue-50/20 scale-[0.99]"
                                : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                        )}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".eml,.txt" />
                        <div className={cn(
                            "p-5 rounded-2xl mb-4 transition-all duration-500",
                            isDragging ? "bg-blue-500 text-white scale-110 rotate-12" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        )}>
                            <Upload size={28} />
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 font-bold text-lg">
                            {fileName || "Drop your evidence"}
                        </p>
                        <p className="text-slate-400 text-sm mt-2 font-medium px-8 text-center leading-tight">
                            Drag your .eml file here to reconstruct the full conversation thread
                        </p>
                    </div>
                )}

                <div className="mt-4 flex gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !text.trim()}
                        className="flex-1 neo-button flex items-center justify-center gap-3 active:translate-y-0.5"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} className="transform -rotate-12" />}
                        <span className="tracking-tight uppercase font-bold text-sm">
                            {isLoading ? "Extracing Data..." : "Reveal Full Chain"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

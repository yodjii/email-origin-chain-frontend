'use client';

import React, { useState } from 'react';
import { Mail, Calendar, User, ChevronDown, CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert, Fingerprint, Layers, ExternalLink, Paperclip, File, FileText, ImageIcon, FileArchive, FileCode, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailNode {
    from?: { name?: string; address?: string } | null;
    subject?: string | null;
    date_raw?: string | null;
    date_iso?: string | null;
    text?: string | null;
    depth: number;
    flags: string[];
    attachments?: Array<{ filename?: string; contentType?: string; size?: number }>;
}

const getFileIcon = (contentType?: string) => {
    const type = contentType?.toLowerCase() || '';
    if (type.includes('pdf')) return <FileText size={16} className="text-red-500" />;
    if (type.includes('image')) return <ImageIcon size={16} className="text-blue-500" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return <FileArchive size={16} className="text-amber-500" />;
    if (type.includes('html') || type.includes('json') || type.includes('xml') || type.includes('javascript')) return <FileCode size={16} className="text-emerald-500" />;
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return <FileType size={16} className="text-green-600" />;
    return <File size={16} className="text-slate-400" />;
};

export function ChainViewer({ history }: { history: EmailNode[] }) {
    if (!history || history.length === 0) return null;

    const displayHistory = [...history];

    return (
        <div className="relative flex flex-col gap-12 py-10">
            {/* Dynamic Animated Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-500 via-emerald-400 to-blue-600 rounded-full opacity-20 dark:opacity-40" />

            <div className="animate-stagger-fade-in flex flex-col gap-10">
                {displayHistory.map((node, index) => (
                    <EmailCard
                        key={index}
                        node={node}
                        isLatest={index === displayHistory.length - 1}
                        isOrigin={index === 0}
                        idx={index}
                    />
                ))}
            </div>
        </div>
    );
}

function EmailCard({ node, isLatest, isOrigin, idx }: { node: EmailNode, isLatest: boolean, isOrigin: boolean, idx: number }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const isMissingFrom = !node.from || (!node.from.name && !node.from.address);
    const isMissingDate = !node.date_iso;
    const isMime = node.flags.includes('trust:high_mime');

    return (
        <div
            className="relative pl-16 group"
            style={{ animationDelay: `${idx * 150}ms` }}
        >
            {/* Futuristic Node Marker */}
            <div className={cn(
                "absolute left-[1.35rem] top-7 -translate-x-1/2 flex items-center justify-center z-10 transition-all duration-500",
                isOrigin ? "scale-125" : "scale-100"
            )}>
                <div className={cn(
                    "w-5 h-5 rounded-full border-[3px] border-white dark:border-slate-900 shadow-xl z-20 transition-all duration-300",
                    isOrigin ? "bg-emerald-500 shadow-emerald-500/50" :
                        isLatest ? "bg-blue-600 shadow-blue-500/50" : "bg-slate-400 group-hover:bg-blue-400"
                )} />
                {isOrigin && (
                    <div className="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping duration-[3000ms]" />
                )}
            </div>

            <div className={cn(
                "glass-card rounded-[2rem] overflow-hidden transition-all duration-500",
                isOrigin ? "ring-2 ring-emerald-500/50 dark:ring-emerald-400/30 scale-[1.02] shadow-2xl shadow-emerald-500/10" :
                    isLatest ? "ring-2 ring-blue-500/30 shadow-xl" : "hover:border-blue-400/50 hover:bg-white/90 cursor-pointer",
                !isExpanded && "max-h-24 overflow-hidden"
            )} onClick={() => !isExpanded && setIsExpanded(true)}>

                {/* Modern Glass Header */}
                <div className={cn(
                    "p-5 md:p-6 flex items-start justify-between gap-6",
                    isExpanded ? "pb-2" : ""
                )}>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                isOrigin ? "bg-emerald-500 text-white" :
                                    isLatest ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            )}>
                                {isOrigin ? "The Deep Source" : isLatest ? "Most Recent Message" : `Hop ${node.depth}`}
                            </span>

                            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 dark:bg-slate-950/40 rounded-full border border-slate-100 dark:border-slate-800">
                                {isMime ? (
                                    <>
                                        <ShieldCheck size={12} className="text-blue-500" />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Verified Meta</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldAlert size={12} className="text-amber-500" />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Text Scan</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 group/title">
                                {isMissingFrom ? (
                                    <span className="text-red-500 flex items-center gap-1.5 animate-pulse">
                                        <AlertTriangle size={18} /> ANONYMOUS SENDER
                                    </span>
                                ) : (
                                    <span className="truncate">{node.from?.name || node.from?.address}</span>
                                )}
                            </h3>

                            <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500 transition-colors group-hover:text-slate-700">
                                <div className={cn("flex items-center gap-1.5", isMissingDate && "text-red-500 font-bold")}>
                                    <Calendar size={14} />
                                    {isMissingDate ? "MISSING DATE METADATA" : node.date_raw}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {(isMissingFrom || isMissingDate) && (
                            <div className="bg-red-50 dark:bg-red-500/10 p-2 rounded-xl text-red-500 border border-red-100 dark:border-red-500/20 shadow-sm animate-bounce">
                                <AlertTriangle size={20} />
                            </div>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className={cn(
                                "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-all duration-500 hover:scale-110 active:scale-95",
                                isExpanded && "rotate-180 bg-blue-50 dark:bg-blue-900/20 text-blue-500"
                            )}
                        >
                            <ChevronDown size={20} />
                        </button>
                    </div>
                </div>

                {/* Detailed Inspector Panel */}
                {isExpanded && (
                    <div className="px-6 pb-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="space-y-6">
                            {/* Technical Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        <Fingerprint size={12} /> Digital Identity
                                    </span>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono break-all line-clamp-1 hover:line-clamp-none transition-all">{node.from?.address || "N/A"}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        <Layers size={12} /> Normalised Timestamp
                                    </span>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">{node.date_iso || "TIMESTAMP_UNDEFINED"}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Matter</label>
                                <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    {node.subject || "NO_SUBJECT_CAPSULE"}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Extracted Payload</label>
                                <div className="relative group/body">
                                    <div className="absolute inset-0 bg-blue-500/5 rounded-2xl opacity-0 group-hover/body:opacity-100 transition-opacity" />
                                    <div className="relative text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                                        {node.text?.trim() || <span className="italic text-slate-400 opacity-50 font-light">SYSTEM_MSG: Void Payload detected.</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            {node.attachments && node.attachments.length > 0 && (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                        <Paperclip size={12} className="text-blue-500" />
                                        Encapsulated Evidence ({node.attachments.length})
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {node.attachments.map((file, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-500/30 hover:bg-blue-50/10 transition-all group/file cursor-default">
                                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors group-hover/file:bg-white dark:group-hover/file:bg-slate-700">
                                                    {getFileIcon(file.contentType)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover/file:text-blue-600 dark:group-hover/file:text-blue-400 transition-colors">{file.filename || 'UNNAMED_ASSET'}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest border-r border-slate-100 dark:border-slate-800 pr-2">
                                                            {file.contentType?.split('/')[1] || 'BIN'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {((file.size || 0) / 1024).toFixed(1)} KB
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Attribution Tags */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                {node.flags.map((flag, fIdx) => (
                                    <span key={fIdx} className="px-2.5 py-1 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] border border-slate-200/50 dark:border-slate-800 font-black tracking-tight flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                                        {flag.toLocaleUpperCase().replace(/:/g, ' ❯')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

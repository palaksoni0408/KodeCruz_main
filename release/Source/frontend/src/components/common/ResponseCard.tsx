import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BarChart3, Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ResponseCardProps {
    response: string;
    loading: boolean;
    backgroundStyle?: React.CSSProperties;
}

export default function ResponseCard({ response, loading, backgroundStyle = {} }: ResponseCardProps) {
    if (!response && !loading) return null;

    return (
        <div
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col relative overflow-hidden"
            style={backgroundStyle}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 flex-shrink-0 relative z-10">
                {loading ? (
                    <>
                        <div className="relative">
                            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                            <div className="w-3 h-3 bg-cyan-400 rounded-full relative"></div>
                        </div>
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse">
                            Generating Response...
                        </h3>
                    </>
                ) : (
                    <>
                        <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                        <h3 className="text-xl font-bold text-white">AI Analysis</h3>
                    </>
                )}
            </div>

            {/* Content Area */}
            <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5 custom-scrollbar markdown-content relative z-10 shadow-inner" style={{ overflowY: 'auto', maxHeight: '600px' }}>
                {response ? (
                    <ReactMarkdown
                        components={{
                            code({ inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                const language = match ? match[1] : '';
                                const [copied, setCopied] = useState(false);

                                const handleCopy = () => {
                                    navigator.clipboard.writeText(String(children));
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                };

                                return !inline && match ? (
                                    <div className="relative group my-6 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                        <div className="absolute right-3 top-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={handleCopy}
                                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 hover:text-white transition-colors backdrop-blur-sm"
                                                title="Copy code"
                                            >
                                                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                        <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-gray-400 border-b border-white/5 flex items-center justify-between">
                                            <span className="uppercase font-mono tracking-wider">{language}</span>
                                        </div>
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={language}
                                            PreTag="div"
                                            className="!bg-[#1e1e1e] !p-4 !m-0 !rounded-none text-sm leading-relaxed"
                                            showLineNumbers={true}
                                            lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#6e7681', textAlign: 'right' }}
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-pink-300 text-sm font-mono border border-white/5" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-8 mb-6 pb-4 border-b border-white/10">{children}</h1>,
                            h2: ({ children }) => {
                                const text = String(children);
                                const isComplexity = text.includes('Complexity') || text.includes('Time') || text.includes('Space');
                                return (
                                    <div className="mt-8 mb-4">
                                        <h2 className={`text-2xl font-bold ${isComplexity ? 'text-emerald-300' : 'text-white'} flex items-center gap-3`}>
                                            {isComplexity && <BarChart3 className="w-7 h-7" />}
                                            {children}
                                        </h2>
                                        {isComplexity && <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mt-2"></div>}
                                    </div>
                                );
                            },
                            h3: ({ children }) => {
                                const text = String(children);
                                const isImportant = text.includes('Complexity') || text.includes('Optimization') || text.includes('Summary') || text.includes('Best');
                                return (
                                    <h3 className={`text-xl font-semibold ${isImportant ? 'text-cyan-300' : 'text-white'} mt-6 mb-3 flex items-center gap-2`}>
                                        {isImportant && <Sparkles className="w-5 h-5" />}
                                        {children}
                                    </h3>
                                );
                            },
                            p: ({ children }) => {
                                const text = String(children);
                                const hasComplexity = /O\([^)]+\)/.test(text);
                                if (hasComplexity) {
                                    return (
                                        <div className="bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-xl p-5 my-5 backdrop-blur-sm">
                                            <p className="text-emerald-100 mb-0 leading-relaxed font-mono text-base">
                                                {children}
                                            </p>
                                        </div>
                                    );
                                }
                                return <p className="text-gray-300 mb-4 leading-relaxed text-base">{children}</p>;
                            },
                            ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2 ml-4 marker:text-emerald-500">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2 ml-4 marker:text-cyan-500">{children}</ol>,
                            li: ({ children }) => <li className="pl-2">{children}</li>,
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-cyan-500/50 bg-cyan-500/5 pl-6 py-4 pr-4 my-6 rounded-r-xl text-gray-300 italic">
                                    {children}
                                </blockquote>
                            ),
                            a: ({ href, children }) => (
                                <a href={href} className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors" target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {response}
                    </ReactMarkdown>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4">
                        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white/30 animate-spin"></div>
                        <p className="italic">Waiting for AI response...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

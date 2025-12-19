import { Languages, Code, FileText, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import CodeEditor from '../components/common/CodeEditor';

interface PlaygroundProps {
    language: string;
    setLanguage: (lang: string) => void;
    code: string;
    setCode: (code: string) => void;
    stdin: string;
    setStdin: (stdin: string) => void;
    supportedLanguages: string[];
    executionResult: any;
    backgroundStyle?: React.CSSProperties;
}

export default function Playground({
    language,
    setLanguage,
    code,
    setCode,
    stdin,
    setStdin,
    supportedLanguages,
    executionResult,
    backgroundStyle = {}
}: PlaygroundProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <Languages className="w-4 h-4" />
                    Programming Language
                </label>
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 pl-11 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur-sm appearance-none cursor-pointer hover:bg-white/10"
                    >
                        {supportedLanguages.length > 0 ? (
                            supportedLanguages.map((lang) => (
                                <option key={lang} value={lang} className="bg-slate-800">
                                    {lang}
                                </option>
                            ))
                        ) : (
                            <>
                                <option value="Python" className="bg-slate-800">Python</option>
                                <option value="JavaScript" className="bg-slate-800">JavaScript</option>
                                <option value="TypeScript" className="bg-slate-800">TypeScript</option>
                                <option value="Java" className="bg-slate-800">Java</option>
                                <option value="C++" className="bg-slate-800">C++</option>
                                <option value="C" className="bg-slate-800">C</option>
                                <option value="Go" className="bg-slate-800">Go</option>
                                <option value="Rust" className="bg-slate-800">Rust</option>
                            </>
                        )}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <Code className="w-4 h-4" />
                    Code
                </label>
                <CodeEditor
                    language={language}
                    code={code}
                    onChange={(value) => setCode(value || '')}
                    height="500px"
                />
            </div>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <FileText className="w-4 h-4" />
                    Standard Input
                    <span className="text-xs font-normal text-yellow-400 ml-2">(Required if your code uses input())</span>
                </label>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-2">
                    <p className="text-xs text-blue-300">
                        <strong>When to use:</strong> If your code uses <code className="bg-blue-900/30 px-1 rounded">input()</code>, <code className="bg-blue-900/30 px-1 rounded">scanf()</code>, <code className="bg-blue-900/30 px-1 rounded">readline()</code>, or similar functions that read from stdin, enter the input values here (one per line or space-separated).
                    </p>
                </div>
                <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Example for Python:&#10;5&#10;10&#10;&#10;Example for C++:&#10;5 10&#10;&#10;Example for multiple inputs:&#10;value1&#10;value2&#10;value3"
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur-sm font-mono text-sm resize-none hover:bg-white/10"
                />
                <p className="text-xs text-gray-400">
                    💡 Tip: For programs that read multiple values, enter each value on a new line or space-separated depending on your code's input format.
                </p>
            </div>

            {executionResult && (
                <div
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col min-h-0 mt-4"
                    style={backgroundStyle}
                >
                    <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                        {executionResult.success ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <h3 className="text-lg font-bold text-white">
                            {executionResult.success ? 'Execution Successful' : 'Execution Failed'}
                        </h3>
                    </div>
                    <div className="space-y-3 custom-scrollbar pr-2" style={{ overflowY: 'auto', maxHeight: '400px' }}>
                        {executionResult.output && (
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-2 block">Output</label>
                                <div className="bg-slate-900/70 rounded-xl p-4 border border-white/10">
                                    <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                                        {executionResult.output}
                                    </pre>
                                </div>
                            </div>
                        )}
                        {executionResult.error && (
                            <div>
                                <label className="text-sm font-semibold text-red-300 mb-2 block">Error</label>
                                <div className="bg-red-900/30 rounded-xl p-4 border border-red-500/30">
                                    <pre className="text-red-300 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                                        {executionResult.error}
                                    </pre>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-4 text-xs text-gray-400">
                            {executionResult.language && (
                                <span>Language: <span className="text-white">{executionResult.language}</span></span>
                            )}
                            {executionResult.exit_code !== undefined && (
                                <span>Exit Code: <span className="text-white">{executionResult.exit_code}</span></span>
                            )}
                            {executionResult.version && (
                                <span>Version: <span className="text-white">{executionResult.version}</span></span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

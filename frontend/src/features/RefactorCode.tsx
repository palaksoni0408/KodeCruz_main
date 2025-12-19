import { Dispatch, SetStateAction } from 'react';

interface RefactorCodeProps {
    language: string;
    setLanguage: Dispatch<SetStateAction<string>>;
    code: string;
    setCode: Dispatch<SetStateAction<string>>;
    refactorType: string;
    setRefactorType: Dispatch<SetStateAction<string>>;
}

const REFACTOR_TYPES = [
    { value: 'general', label: 'General Improvements', description: 'Overall code quality and maintainability' },
    { value: 'performance', label: 'Performance', description: 'Optimize for speed and efficiency' },
    { value: 'readability', label: 'Readability', description: 'Improve code clarity' },
    { value: 'solid', label: 'SOLID Principles', description: 'Apply design patterns' },
    { value: 'dry', label: 'DRY (Remove Duplication)', description: 'Eliminate repeated code' },
    { value: 'extract_method', label: 'Extract Methods', description: 'Break down complex logic' },
    { value: 'simplify', label: 'Simplify Logic', description: 'Reduce complexity' },
];

export default function RefactorCode({
    language,
    setLanguage,
    code,
    setCode,
    refactorType,
    setRefactorType
}: RefactorCodeProps) {
    return (
        <div className="space-y-4">
            {/* Language Selector */}
            <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                    Programming Language
                </label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                </select>
            </div>

            {/* Refactor Type Selector */}
            <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                    Refactoring Focus
                </label>
                <select
                    value={refactorType}
                    onChange={(e) => setRefactorType(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                    {REFACTOR_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
                <p className="mt-2 text-xs text-white/60">
                    {REFACTOR_TYPES.find(t => t.value === refactorType)?.description}
                </p>
            </div>

            {/* Code Input */}
            <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                    Code to Refactor
                </label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste code that needs refactoring..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                    rows={12}
                />
            </div>

            {/* Info Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-sm text-amber-200">
                    <span className="font-bold">🔧 Improvements:</span> Better structure • Cleaner code • Enhanced performance • Easier maintenance • Best practices
                </p>
            </div>
        </div>
    );
}

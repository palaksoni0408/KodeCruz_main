import { Dispatch, SetStateAction } from 'react';

interface CodeReviewProps {
    language: string;
    setLanguage: Dispatch<SetStateAction<string>>;
    code: string;
    setCode: Dispatch<SetStateAction<string>>;
}

export default function CodeReview({
    language,
    setLanguage,
    code,
    setCode
}: CodeReviewProps) {
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="csharp">C#</option>
                </select>
            </div>

            {/* Code Input */}
            <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                    Code to Review
                </label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here for comprehensive review..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                    rows={12}
                />
            </div>

            {/* Info Box */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-sm text-red-200">
                    <span className="font-bold">💡 Tip:</span> Our AI will analyze your code for:
                    Security vulnerabilities • Performance issues • Best practices • Code quality • Design patterns
                </p>
            </div>
        </div>
    );
}

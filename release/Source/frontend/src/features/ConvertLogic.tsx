import { Languages, FileText, ChevronDown } from 'lucide-react';
import CodeEditor from '../components/common/CodeEditor';

interface ConvertLogicProps {
    language: string;
    setLanguage: (lang: string) => void;
    logic: string;
    setLogic: (logic: string) => void;
}

export default function ConvertLogic({
    language,
    setLanguage,
    logic,
    setLogic
}: ConvertLogicProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <Languages className="w-4 h-4" />
                    Target Language
                </label>
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 pl-11 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur-sm appearance-none cursor-pointer hover:bg-white/10"
                    >
                        <option value="python" className="bg-slate-800">Python</option>
                        <option value="javascript" className="bg-slate-800">JavaScript</option>
                        <option value="typescript" className="bg-slate-800">TypeScript</option>
                        <option value="java" className="bg-slate-800">Java</option>
                        <option value="cpp" className="bg-slate-800">C++</option>
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <FileText className="w-4 h-4" />
                    Logic/Pseudo-code
                </label>
                <CodeEditor
                    language="plaintext"
                    code={logic}
                    onChange={(value) => setLogic(value || '')}
                    height="450px"
                />
            </div>
        </div>
    );
}

import { GraduationCap, BookOpen, ChevronDown } from 'lucide-react';

interface RoadmapsProps {
    level: string;
    setLevel: (level: string) => void;
    topic: string;
    setTopic: (topic: string) => void;
}

export default function Roadmaps({
    level,
    setLevel,
    topic,
    setTopic
}: RoadmapsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <GraduationCap className="w-4 h-4" />
                    Level
                </label>
                <div className="relative">
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full px-4 py-3 pl-11 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur-sm appearance-none cursor-pointer hover:bg-white/10"
                    >
                        <option value="Beginner" className="bg-slate-800">Beginner</option>
                        <option value="Intermediate" className="bg-slate-800">Intermediate</option>
                        <option value="Advanced" className="bg-slate-800">Advanced</option>
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <BookOpen className="w-4 h-4" />
                    Topic
                </label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., full-stack development, data science"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur-sm hover:bg-white/10"
                />
            </div>
        </div>
    );
}

import { useEffect, useRef } from 'react';
import {
    ArrowLeft,
    Code2,
    GitCommit,
    Zap,
    Bug
} from 'lucide-react';

interface ChangelogPageProps {
    onBack: () => void;
}

export default function ChangelogPage({ onBack }: ChangelogPageProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card-animate').forEach(card => {
            observerRef.current?.observe(card);
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    const changes = [
        {
            version: "v1.0.0",
            date: "November 28, 2025",
            title: "Initial Launch",
            description: "KodesCruz is live! We've launched with a suite of powerful AI tools for developers.",
            type: "major",
            items: [
                "AI Code Explanation",
                "Smart Debugging",
                "Code Generation",
                "Real-time Collaboration Rooms"
            ]
        },
        {
            version: "v0.9.0",
            date: "November 15, 2025",
            title: "Beta Release",
            description: "Opened access to beta testers. Added core features and refined the UI.",
            type: "minor",
            items: [
                "Glassmorphism UI Design",
                "Authentication System",
                "Dashboard Implementation"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30 selection:text-white">
            <style>{`
                .card-animate { opacity: 0; transform: translateY(40px); filter: blur(8px); animation: fadeInSlideBlur 0.8s ease-out forwards; }
                .header-animate { opacity: 0; transform: translateY(-20px); filter: blur(4px); animation: fadeInSlideBlur 0.6s ease-out forwards; animation-delay: 0.1s; }
                .title-animate { opacity: 0; transform: translateY(30px); filter: blur(6px); animation: fadeInSlideBlur 0.8s ease-out forwards; animation-delay: 0.3s; }
                .card-animate:nth-child(1) { animation-delay: 0.2s; }
                .card-animate:nth-child(2) { animation-delay: 0.3s; }
                @keyframes fadeInSlideBlur {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                        filter: blur(0px);
                    }
                }
                .glass-frosted {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
            `}</style>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                            <Code2 className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-white">KodesCruz</span>
                    </div>
                    <div className="w-24"></div> {/* Spacer for centering */}
                </div>
            </nav>

            <main className="pt-32 pb-20 px-4 sm:px-6">
                <div className="mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 header-animate">
                            Change<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">log</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto title-animate">
                            Stay up to date with the latest improvements and features.
                        </p>
                    </div>

                    <div className="space-y-12 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-8 top-8 bottom-8 w-px bg-white/10 hidden md:block"></div>

                        {changes.map((change, index) => (
                            <div key={index} className="card-animate relative pl-0 md:pl-24">
                                {/* Timeline Dot */}
                                <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-orange-500 hidden md:block z-10"></div>

                                <div className="glass-frosted rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono font-medium border border-orange-500/20">
                                                    {change.version}
                                                </span>
                                                <span className="text-slate-500 text-sm">{change.date}</span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-white">{change.title}</h2>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {change.type === 'major' ? (
                                                <span className="flex items-center gap-1 text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                                                    <Zap className="w-3 h-3" /> Major Update
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                                    <GitCommit className="w-3 h-3" /> Minor Update
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-slate-400 mb-6 leading-relaxed">
                                        {change.description}
                                    </p>

                                    <ul className="space-y-3">
                                        {change.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

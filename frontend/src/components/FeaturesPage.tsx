import { useEffect, useRef } from 'react';
import {
    Code2,
    Bug,
    Users,
    Sparkles,
    Shield,
    CheckCircle,
    Play,
    ArrowLeft,
    BarChart3,
    ArrowRightLeft,
    FileCode,
    Lightbulb,
    Map,
    Terminal,
    FlaskConical,
    Wrench
} from 'lucide-react';

interface FeaturesPageProps {
    onBack: () => void;
}

export default function FeaturesPage({ onBack }: FeaturesPageProps) {
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

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30 selection:text-white">
            <style>{`
                .card-animate { opacity: 0; transform: translateY(40px); filter: blur(8px); animation: fadeInSlideBlur 0.8s ease-out forwards; }
                .header-animate { opacity: 0; transform: translateY(-20px); filter: blur(4px); animation: fadeInSlideBlur 0.6s ease-out forwards; animation-delay: 0.1s; }
                .title-animate { opacity: 0; transform: translateY(30px); filter: blur(6px); animation: fadeInSlideBlur 0.8s ease-out forwards; animation-delay: 0.3s; }
                .card-animate:nth-child(1) { animation-delay: 0.2s; }
                .card-animate:nth-child(2) { animation-delay: 0.3s; }
                .card-animate:nth-child(3) { animation-delay: 0.4s; }
                .card-animate:nth-child(4) { animation-delay: 0.5s; }
                .card-animate:nth-child(5) { animation-delay: 0.6s; }
                .card-animate:nth-child(6) { animation-delay: 0.7s; }
                @keyframes fadeInSlideBlur {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                        filter: blur(0px);
                    }
                }
                .font-instrument-serif { font-family: 'Instrument Serif', serif; }
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
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 header-animate">
                            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">Features</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto title-animate">
                            Everything you need to master coding, from AI explanations to real-time collaboration.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">

                        {/* Explain Code Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Code2 className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-blue-400/20 text-blue-200 rounded-full font-medium">Core</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">AI Explanation</p>
                                    <p className="text-blue-200 text-lg mt-2">Understand Code</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-blue-200 text-2xl font-mono">Instant</p>
                                        <p className="text-blue-300 text-sm font-light">analysis</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-blue-500/30 pt-6">
                                <p className="text-blue-100/80 text-sm leading-relaxed font-light">
                                    Get detailed, human-readable explanations for complex code snippets in seconds.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">SMART</span>
                                        <CheckCircle className="w-4 h-4 text-blue-200" />
                                    </div>
                                    <span className="text-blue-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Try it now</span>
                                </div>
                            </div>
                        </div>

                        {/* Debug Code Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Bug className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-red-400/20 text-red-200 rounded-full font-medium">Essential</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Smart Debug</p>
                                    <p className="text-red-200 text-lg mt-2">Fix Errors Fast</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-red-200 text-2xl font-mono">Auto</p>
                                        <p className="text-red-300 text-sm font-light">fix</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-red-500/30 pt-6">
                                <p className="text-red-100/80 text-sm leading-relaxed font-light">
                                    Identify bugs instantly and get automated solution suggestions to fix them.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">PRECISE</span>
                                        <CheckCircle className="w-4 h-4 text-red-200" />
                                    </div>
                                    <span className="text-red-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Debug now</span>
                                </div>
                            </div>
                        </div>

                        {/* Generate Code Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Sparkles className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-purple-400/20 text-purple-200 rounded-full font-medium">Creative</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Code Gen</p>
                                    <p className="text-purple-200 text-lg mt-2">Create from Text</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-purple-200 text-2xl font-mono">AI</p>
                                        <p className="text-purple-300 text-sm font-light">powered</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-purple-500/30 pt-6">
                                <p className="text-purple-100/80 text-sm leading-relaxed font-light">
                                    Generate production-ready code from simple natural language descriptions.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">FAST</span>
                                        <CheckCircle className="w-4 h-4 text-purple-200" />
                                    </div>
                                    <span className="text-purple-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Generate</span>
                                </div>
                            </div>
                        </div>

                        {/* Collaborative Rooms Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Users className="w-8 h-8 text-violet-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-violet-400/20 text-violet-200 rounded-full font-medium">Team</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Collaboration</p>
                                    <p className="text-violet-200 text-lg mt-2">Real-time Coding</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-violet-200 text-2xl font-mono">Live</p>
                                        <p className="text-violet-300 text-sm font-light">sync</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-violet-500/30 pt-6">
                                <p className="text-violet-100/80 text-sm leading-relaxed font-light">
                                    Code together with your team in real-time rooms with synchronized editing.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">SYNC</span>
                                        <CheckCircle className="w-4 h-4 text-violet-200" />
                                    </div>
                                    <span className="text-violet-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Join room</span>
                                </div>
                            </div>
                        </div>

                        {/* Complexity Analysis Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <BarChart3 className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-orange-400/20 text-orange-200 rounded-full font-medium">Optimize</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Complexity</p>
                                    <p className="text-orange-200 text-lg mt-2">Analyze Performance</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-orange-200 text-2xl font-mono">O(n)</p>
                                        <p className="text-orange-300 text-sm font-light">metrics</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-orange-500/30 pt-6">
                                <p className="text-orange-100/80 text-sm leading-relaxed font-light">
                                    Analyze time and space complexity to optimize your algorithms.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">SPEED</span>
                                        <CheckCircle className="w-4 h-4 text-orange-200" />
                                    </div>
                                    <span className="text-orange-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Analyze</span>
                                </div>
                            </div>
                        </div>

                        {/* Convert Logic Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <ArrowRightLeft className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-green-400/20 text-green-200 rounded-full font-medium">Translate</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Convert Logic</p>
                                    <p className="text-green-200 text-lg mt-2">Cross-Language</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-green-200 text-2xl font-mono">Any</p>
                                        <p className="text-green-300 text-sm font-light">lang</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-green-500/30 pt-6">
                                <p className="text-green-100/80 text-sm leading-relaxed font-light">
                                    Translate code logic between different programming languages effortlessly.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">FLEXIBLE</span>
                                        <CheckCircle className="w-4 h-4 text-green-200" />
                                    </div>
                                    <span className="text-green-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Convert</span>
                                </div>
                            </div>
                        </div>

                        {/* Trace Code Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Play className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-cyan-400/20 text-cyan-200 rounded-full font-medium">Visualize</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Trace Code</p>
                                    <p className="text-cyan-200 text-lg mt-2">Step-by-Step</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-cyan-200 text-2xl font-mono">Run</p>
                                        <p className="text-cyan-300 text-sm font-light">flow</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-cyan-500/30 pt-6">
                                <p className="text-cyan-100/80 text-sm leading-relaxed font-light">
                                    Visualize code execution step-by-step to understand logic flow.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">FLOW</span>
                                        <CheckCircle className="w-4 h-4 text-cyan-200" />
                                    </div>
                                    <span className="text-cyan-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Trace</span>
                                </div>
                            </div>
                        </div>

                        {/* Code Snippets Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <FileCode className="w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-pink-400/20 text-pink-200 rounded-full font-medium">Library</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Snippets</p>
                                    <p className="text-pink-200 text-lg mt-2">Reusable Code</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-pink-200 text-2xl font-mono">Save</p>
                                        <p className="text-pink-300 text-sm font-light">time</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-pink-500/30 pt-6">
                                <p className="text-pink-100/80 text-sm leading-relaxed font-light">
                                    Access a vast library of reusable code snippets for common tasks.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">USEFUL</span>
                                        <CheckCircle className="w-4 h-4 text-pink-200" />
                                    </div>
                                    <span className="text-pink-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Browse</span>
                                </div>
                            </div>
                        </div>

                        {/* Project Ideas Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Lightbulb className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-yellow-400/20 text-yellow-200 rounded-full font-medium">Inspire</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Project Ideas</p>
                                    <p className="text-yellow-200 text-lg mt-2">Get Inspired</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-yellow-200 text-2xl font-mono">New</p>
                                        <p className="text-yellow-300 text-sm font-light">ideas</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-yellow-500/30 pt-6">
                                <p className="text-yellow-100/80 text-sm leading-relaxed font-light">
                                    Generate creative project ideas tailored to your skills and interests.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">CREATE</span>
                                        <CheckCircle className="w-4 h-4 text-yellow-200" />
                                    </div>
                                    <span className="text-yellow-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Get ideas</span>
                                </div>
                            </div>
                        </div>

                        {/* Learning Roadmaps Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Map className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-indigo-400/20 text-indigo-200 rounded-full font-medium">Guide</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Roadmaps</p>
                                    <p className="text-indigo-200 text-lg mt-2">Learning Path</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-indigo-200 text-2xl font-mono">Step</p>
                                        <p className="text-indigo-300 text-sm font-light">by step</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-indigo-500/30 pt-6">
                                <p className="text-indigo-100/80 text-sm leading-relaxed font-light">
                                    Get personalized learning roadmaps to master new technologies.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">LEARN</span>
                                        <CheckCircle className="w-4 h-4 text-indigo-200" />
                                    </div>
                                    <span className="text-indigo-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Start path</span>
                                </div>
                            </div>
                        </div>

                        {/* Code Playground Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Terminal className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-emerald-400/20 text-emerald-200 rounded-full font-medium">Run</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Playground</p>
                                    <p className="text-emerald-200 text-lg mt-2">Execute Code</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-emerald-200 text-2xl font-mono">Live</p>
                                        <p className="text-emerald-300 text-sm font-light">editor</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-emerald-500/30 pt-6">
                                <p className="text-emerald-100/80 text-sm leading-relaxed font-light">
                                    Write and execute code in multiple languages directly in the browser.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">EXECUTE</span>
                                        <CheckCircle className="w-4 h-4 text-emerald-200" />
                                    </div>
                                    <span className="text-emerald-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Open editor</span>
                                </div>
                            </div>
                        </div>

                        {/* Code Review Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Shield className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-red-400/20 text-red-200 rounded-full font-medium">Audit</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Code Review</p>
                                    <p className="text-red-200 text-lg mt-2">Quality Check</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-red-200 text-2xl font-mono">Best</p>
                                        <p className="text-red-300 text-sm font-light">practices</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-red-500/30 pt-6">
                                <p className="text-red-100/80 text-sm leading-relaxed font-light">
                                    Get AI-powered code reviews to improve quality and security.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">SECURE</span>
                                        <CheckCircle className="w-4 h-4 text-red-200" />
                                    </div>
                                    <span className="text-red-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Review</span>
                                </div>
                            </div>
                        </div>

                        {/* Test Generator Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <FlaskConical className="w-8 h-8 text-teal-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-teal-400/20 text-teal-200 rounded-full font-medium">Test</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Test Gen</p>
                                    <p className="text-teal-200 text-lg mt-2">Auto Tests</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-teal-200 text-2xl font-mono">100%</p>
                                        <p className="text-teal-300 text-sm font-light">coverage</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-teal-500/30 pt-6">
                                <p className="text-teal-100/80 text-sm leading-relaxed font-light">
                                    Automatically generate unit tests for your code in various frameworks.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">ROBUST</span>
                                        <CheckCircle className="w-4 h-4 text-teal-200" />
                                    </div>
                                    <span className="text-teal-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Generate tests</span>
                                </div>
                            </div>
                        </div>

                        {/* Refactor Code Card */}
                        <div className="card-animate flex flex-col sm:p-10 w-full aspect-[3/5] hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Wrench className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs px-3 py-1.5 bg-amber-400/20 text-amber-200 rounded-full font-medium">Clean</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Refactor</p>
                                    <p className="text-amber-200 text-lg mt-2">Clean Code</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-right">
                                        <p className="text-amber-200 text-2xl font-mono">Better</p>
                                        <p className="text-amber-300 text-sm font-light">code</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-amber-500/30 pt-6">
                                <p className="text-amber-100/80 text-sm leading-relaxed font-light">
                                    Improve code structure, readability, and performance with AI refactoring.
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs tracking-wider">CLEAN</span>
                                        <CheckCircle className="w-4 h-4 text-amber-200" />
                                    </div>
                                    <span className="text-amber-200 text-sm hover:underline transition-colors font-medium cursor-pointer">Refactor</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

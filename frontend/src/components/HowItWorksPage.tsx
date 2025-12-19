import { useEffect, useRef } from 'react';
import {
    ArrowLeft,
    Code2,
    UserPlus,
    LayoutDashboard,
    Keyboard,
    Sparkles
} from 'lucide-react';

interface HowItWorksPageProps {
    onBack: () => void;
}

export default function HowItWorksPage({ onBack }: HowItWorksPageProps) {
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

    const steps = [
        {
            icon: UserPlus,
            title: "1. Create an Account",
            description: "Sign up for free to access our powerful AI coding tools. It takes less than a minute to get started.",
            color: "blue"
        },
        {
            icon: LayoutDashboard,
            title: "2. Choose a Feature",
            description: "Navigate to your dashboard and select from a wide range of tools like Code Explanation, Debugging, or Generation.",
            color: "purple"
        },
        {
            icon: Keyboard,
            title: "3. Input Your Code",
            description: "Paste your code snippet or describe the problem you're trying to solve. Our interface is designed for developers.",
            color: "orange"
        },
        {
            icon: Sparkles,
            title: "4. Get Instant Results",
            description: "Our advanced AI analyzes your input and provides accurate, helpful responses in seconds.",
            color: "green"
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
                .card-animate:nth-child(3) { animation-delay: 0.4s; }
                .card-animate:nth-child(4) { animation-delay: 0.5s; }
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
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 header-animate">
                            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Works</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto title-animate">
                            Mastering your code has never been easier. Follow these simple steps to supercharge your development workflow.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                        {steps.map((step, index) => (
                            <div key={index} className="card-animate flex flex-col p-8 w-full hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl shadow-2xl glass-frosted relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${step.color}-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-${step.color}-500/20`}></div>

                                <div className="mb-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-${step.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <step.icon className={`w-8 h-8 text-${step.color}-400`} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center card-animate">
                        <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-orange-500 to-purple-600">
                            <button onClick={onBack} className="px-8 py-4 rounded-full bg-[#0a0a0a] hover:bg-zinc-900 text-white font-semibold transition-all duration-300 flex items-center gap-2 group">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-500 group-hover:text-white transition-colors">
                                    Get Started Now
                                </span>
                                <ArrowLeft className="w-4 h-4 rotate-180 text-purple-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

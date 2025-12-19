import { useEffect, useRef } from 'react';
import {
    ArrowLeft,
    Code2,
    Users,
    Globe,
    Award,
    Linkedin
} from 'lucide-react';

interface AboutPageProps {
    onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
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
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 header-animate">
                            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">Us</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto title-animate">
                            We are on a mission to democratize software development by building the world's most advanced AI-powered coding assistant.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        <div className="card-animate glass-frosted p-8 rounded-3xl border border-white/10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                                <Globe className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Global Reach</h3>
                            <p className="text-slate-400">
                                Empowering developers from over 100 countries to build better software faster.
                            </p>
                        </div>
                        <div className="card-animate glass-frosted p-8 rounded-3xl border border-white/10" style={{ animationDelay: '0.2s' }}>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                                <Users className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Community First</h3>
                            <p className="text-slate-400">
                                Built by developers, for developers. We believe in open collaboration and shared knowledge.
                            </p>
                        </div>
                        <div className="card-animate glass-frosted p-8 rounded-3xl border border-white/10" style={{ animationDelay: '0.4s' }}>
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                                <Award className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Excellence</h3>
                            <p className="text-slate-400">
                                Striving for the highest quality in our AI models, user experience, and code generation.
                            </p>
                        </div>
                    </div>

                    {/* Story Section */}
                    <div className="card-animate glass-frosted p-10 md:p-16 rounded-3xl border border-white/10 mb-24 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                                <p>
                                    KodesCruz began with a simple question: "What if your IDE could understand your intent, not just your syntax?"
                                </p>
                                <p>
                                    Founded in 2024, we set out to bridge the gap between human creativity and machine efficiency. We realized that developers spend a significant amount of time on repetitive tasks, debugging obscure errors, and searching for documentation.
                                </p>
                                <p>
                                    We built KodesCruz to be the partner that handles the heavy lifting, allowing you to focus on the logic, architecture, and innovation that truly matters. Today, we are proud to support thousands of developers in building the future.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Team Section (Placeholder) */}
                    <div className="text-center mb-12 card-animate">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12">Meet the Team</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Palak Soni",
                                    role: "Founder Product & Strategy, Backend & AI",
                                    linkedin: "https://www.linkedin.com/in/palak-soni-292280288/",
                                    image: "/images/team/palak.jpeg"
                                }
                            ].map((member, i) => (
                                <div key={i} className="group">
                                    <div className="w-full aspect-square rounded-3xl bg-white/5 mb-6 overflow-hidden relative">
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6 z-10">
                                            <div className="text-left flex items-center gap-2 text-white hover:text-orange-400 transition-colors">
                                                <Linkedin className="w-5 h-5" />
                                                <span className="font-semibold">Connect on LinkedIn</span>
                                            </div>
                                        </a>

                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700 group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Fallback if image fails (e.g. HEIC not supported)
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                            <div className="hidden absolute inset-0 flex items-center justify-center">
                                                <Users className="w-16 h-16" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

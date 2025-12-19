import { useEffect, useRef } from 'react';
import {
    ArrowLeft,
    Code2,
    Calendar,
    Clock,
    ArrowRight
} from 'lucide-react';

interface BlogPageProps {
    onBack: () => void;
}

export default function BlogPage({ onBack }: BlogPageProps) {
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

    const posts = [
        {
            title: "The Future of AI-Assisted Coding",
            excerpt: "Explore how Large Language Models are reshaping the software development landscape and what it means for developers.",
            date: "Nov 28, 2025",
            readTime: "5 min read",
            category: "AI Trends",
            color: "blue"
        },
        {
            title: "Mastering KodesCruz Debugger",
            excerpt: "A deep dive into our smart debugging tools. Learn how to identify and fix complex race conditions in seconds.",
            date: "Nov 20, 2025",
            readTime: "8 min read",
            category: "Tutorials",
            color: "purple"
        },
        {
            title: "Scaling Your Dev Team with AI",
            excerpt: "Best practices for integrating AI tools into your team's workflow without compromising code quality or security.",
            date: "Nov 15, 2025",
            readTime: "6 min read",
            category: "Team Management",
            color: "orange"
        },
        {
            title: "Introducing KodesCruz v1.0",
            excerpt: "We are thrilled to announce the general availability of our platform. Here is everything you need to know about the launch.",
            date: "Nov 01, 2025",
            readTime: "4 min read",
            category: "Announcements",
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
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Blog</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto title-animate">
                            Insights, tutorials, and updates from the KodesCruz team.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {posts.map((post, index) => (
                            <div key={index} className="card-animate group cursor-pointer">
                                <div className="h-full glass-frosted rounded-3xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className={`px-3 py-1 rounded-full bg-${post.color}-500/10 text-${post.color}-400 text-xs font-mono font-medium border border-${post.color}-500/20`}>
                                            {post.category}
                                        </span>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-400 transition-colors">{post.title}</h2>
                                    <p className="text-slate-400 mb-8 leading-relaxed flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-medium text-white group-hover:translate-x-2 transition-transform">
                                        Read Article <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

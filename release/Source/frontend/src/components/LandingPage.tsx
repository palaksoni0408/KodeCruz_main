import { useState } from 'react';
import { ArrowRight, Code2, Bug, Sparkles, Users, Zap, Shield } from 'lucide-react';
import AuthModal from './auth/AuthModal';
import Layout from './layout/Layout';

export default function LandingPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const features = [
        {
            icon: Code2,
            title: "AI Code Explanation",
            description: "Understand complex code snippets instantly with detailed, human-readable explanations.",
            color: "blue"
        },
        {
            icon: Bug,
            title: "Smart Debugging",
            description: "Identify and fix bugs in seconds with intelligent analysis and solution suggestions.",
            color: "red"
        },
        {
            icon: Users,
            title: "Real-time Collaboration",
            description: "Code together with your team in real-time rooms with synchronized editing and chat.",
            color: "violet"
        },
        {
            icon: Sparkles,
            title: "Code Generation",
            description: "Generate production-ready code from natural language descriptions in multiple languages.",
            color: "purple"
        },
        {
            icon: Zap,
            title: "Instant Conversion",
            description: "Convert logic or code between different programming languages seamlessly.",
            color: "green"
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your code and data are protected with enterprise-grade security and encryption.",
            color: "emerald"
        }
    ];

    return (
        <Layout>
            <div className="flex-1 flex flex-col">
                {/* Hero Section */}
                <div className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-sm font-medium text-emerald-200">AI-Powered Coding Assistant v2.0</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                Master Coding with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                                    AI Intelligence
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                                Experience the future of development. Real-time collaboration, smart debugging, and instant code generation—all in one powerful platform.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                                >
                                    Get Started Free
                                    <ArrowRight size={20} />
                                </button>
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
                </div>

                {/* Features Grid */}
                <div className="container mx-auto px-4 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="group p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10"
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg py-12">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-400">
                            © 2025 KodesCruxx. Built with <span className="text-red-500">♥</span> by <a href="https://www.linkedin.com/in/palak-soni-292280288/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">PALAK SONI</a>.
                        </p>
                    </div>
                </footer>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </Layout>
    );
}

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Code2,
    Book,
    Terminal,
    Layers,
    Cpu,
    Search,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';

interface DocsPageProps {
    onBack: () => void;
}

export default function DocsPage({ onBack }: DocsPageProps) {
    const [activeSection, setActiveSection] = useState('introduction');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sections = [
        { id: 'introduction', title: 'Introduction', icon: Book },
        { id: 'getting-started', title: 'Getting Started', icon: Layers },
        { id: 'core-features', title: 'Core Features', icon: Terminal },
        { id: 'api-reference', title: 'API Reference', icon: Cpu },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
            setIsSidebarOpen(false);
        }
    };

    // Intersection Observer to update active section on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30 selection:text-white flex flex-col">
            <style>{`
                .glass-frosted {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .sidebar-link.active {
                    background: rgba(249, 115, 22, 0.1);
                    color: #f97316;
                    border-right: 2px solid #f97316;
                }
            `}</style>

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400 hover:text-white">
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                            <Code2 className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-white hidden sm:block">KodesCruz Docs</span>
                    </div>
                </div>

                <div className="flex-1 max-w-xl mx-4 hidden md:block">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-purple-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative flex items-center bg-[#0e0e0e] rounded-lg border border-white/10 px-3 py-1.5">
                            <Search className="w-4 h-4 text-slate-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                            />
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-slate-500 font-mono border border-white/5">
                                <span>⌘</span><span>K</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to App</span>
                </button>
            </nav>

            <div className="flex pt-16 flex-1 relative">
                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/5 pt-20 pb-10 px-6 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] lg:overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`sidebar-link w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-r-lg transition-colors text-left ${activeSection === section.id ? 'active' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <section.icon className="w-4 h-4" />
                                {section.title}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">Resources</h4>
                        <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-orange-500 transition-colors">
                            <span>Community Forum</span>
                        </a>
                        <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-orange-500 transition-colors">
                            <span>GitHub Repo</span>
                        </a>
                        <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-orange-500 transition-colors">
                            <span>Status Page</span>
                        </a>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-10 lg:py-12 overflow-y-auto h-[calc(100vh-64px)] scroll-smooth">
                    <div className="max-w-4xl mx-auto space-y-16 pb-20">

                        {/* Introduction */}
                        <section id="introduction" className="scroll-mt-24">
                            <div className="mb-6">
                                <span className="text-orange-500 font-mono text-sm tracking-wider uppercase">Overview</span>
                                <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Introduction to KodesCruz</h1>
                                <p className="text-xl text-slate-400 leading-relaxed">
                                    KodesCruz is an advanced AI-powered development platform designed to supercharge your coding workflow.
                                    Whether you're debugging complex issues, generating boilerplate code, or seeking detailed explanations for legacy codebases,
                                    KodesCruz provides the tools you need to build faster and smarter.
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 mt-8">
                                <div className="glass-frosted p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Code2 className="text-blue-400 w-5 h-5" /> For Developers</h3>
                                    <p className="text-slate-400 text-sm">Streamline your daily tasks with intelligent code assistance and automated debugging.</p>
                                </div>
                                <div className="glass-frosted p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Layers className="text-purple-400 w-5 h-5" /> For Teams</h3>
                                    <p className="text-slate-400 text-sm">Collaborate in real-time with shared contexts and unified AI assistance.</p>
                                </div>
                            </div>
                        </section>

                        {/* Getting Started */}
                        <section id="getting-started" className="scroll-mt-24 pt-8 border-t border-white/5">
                            <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
                            <p className="text-slate-400 mb-8">Follow these simple steps to set up your environment and start using KodesCruz.</p>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold">1</div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                                        <p className="text-slate-400 mb-4">Sign up using your email or GitHub account. We offer a free tier for individual developers to explore the platform.</p>
                                        <div className="bg-[#0e0e0e] border border-white/10 rounded-lg p-4 font-mono text-sm text-slate-300">
                                            <span className="text-green-400">$</span> npm install -g kodescruxx-cli<br />
                                            <span className="text-green-400">$</span> kodescruxx login
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold">2</div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Configure Your Profile</h3>
                                        <p className="text-slate-400">Set your preferred programming languages and IDE themes in the settings dashboard to personalize your AI responses.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Core Features */}
                        <section id="core-features" className="scroll-mt-24 pt-8 border-t border-white/5">
                            <h2 className="text-3xl font-bold mb-6">Core Features</h2>

                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-2xl font-semibold mb-4 text-blue-400">AI Code Explanation</h3>
                                    <p className="text-slate-400 mb-4">
                                        Paste any code snippet, and our AI will break it down line-by-line, explaining the logic, potential side effects, and time complexity.
                                    </p>
                                    <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                                        <li>Supports over 30+ languages including Python, JavaScript, Rust, and Go.</li>
                                        <li>Identifies security vulnerabilities in the explained code.</li>
                                        <li>Suggests modern alternatives for deprecated methods.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold mb-4 text-red-400">Smart Debugging</h3>
                                    <p className="text-slate-400 mb-4">
                                        Don't just find the error—understand it. KodesCruz analyzes stack traces and code context to pinpoint the root cause of bugs.
                                    </p>
                                    <div className="glass-frosted p-6 rounded-xl border-l-4 border-red-500">
                                        <h4 className="font-semibold mb-2">Pro Tip</h4>
                                        <p className="text-sm text-slate-400">Provide the full error log along with the relevant code snippet for the most accurate debugging results.</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold mb-4 text-purple-400">Code Generation</h3>
                                    <p className="text-slate-400 mb-4">
                                        Describe what you want to build in plain English, and watch as KodesCruz generates production-ready code, complete with comments and type definitions.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* API Reference */}
                        <section id="api-reference" className="scroll-mt-24 pt-8 border-t border-white/5">
                            <h2 className="text-3xl font-bold mb-6">API Reference</h2>
                            <p className="text-slate-400 mb-6">
                                Integrate KodesCruz capabilities directly into your own tools and workflows using our REST API.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">POST</span>
                                        <code className="text-sm font-mono text-white">/v1/explain</code>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-3">Generates an explanation for the provided code snippet.</p>
                                    <div className="bg-[#0e0e0e] rounded-lg p-4 border border-white/10 overflow-x-auto">
                                        <pre className="text-xs font-mono text-slate-300">
                                            {`curl -X POST https://api.kodescruxx.com/v1/explain \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "console.log('Hello World')",
    "language": "javascript"
  }'`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">POST</span>
                                        <code className="text-sm font-mono text-white">/v1/debug</code>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-3">Analyzes code and error logs to provide debugging suggestions.</p>
                                </div>
                            </div>
                        </section>

                    </div>
                </main>
            </div>
        </div>
    );
}

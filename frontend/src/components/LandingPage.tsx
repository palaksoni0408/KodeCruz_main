import { useState, useEffect, useRef } from 'react';
import {
    Code2,
    Bug,
    Users,
    Sparkles,
    Shield,
    ArrowRight,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';
import AuthModal from './auth/AuthModal';

interface LandingPageProps {
    onNavigate?: (page: 'landing' | 'features' | 'pricing' | 'how-it-works' | 'changelog' | 'docs' | 'about' | 'blog' | 'careers' | 'contact') => void;
}


export default function LandingPage({ onNavigate }: LandingPageProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Custom auth handlers - show modal instead of redirecting
    const handleSignup = () => {
        setIsAuthModalOpen(true);
    };

    const handleLogin = () => {
        setIsAuthModalOpen(true);
    };

    const scrollSectionRef = useRef<HTMLDivElement>(null);
    const scrollTrackRef = useRef<HTMLDivElement>(null);
    const customCursorRef = useRef<HTMLDivElement>(null);

    // Navbar Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Custom Cursor Logic
    useEffect(() => {
        const cursor = customCursorRef.current;
        if (!cursor) return;

        const moveCursor = (e: MouseEvent) => {
            cursor.style.transform = `translate(${e.clientX - 8}px, ${e.clientY - 8}px)`;
        };

        const handleMouseEnter = () => {
            cursor.classList.add('scale-[2.5]', 'bg-orange-500');
            cursor.classList.remove('mix-blend-difference');
        };

        const handleMouseLeave = () => {
            cursor.classList.remove('scale-[2.5]', 'bg-orange-500');
            cursor.classList.add('mix-blend-difference');
        };

        document.addEventListener('mousemove', moveCursor);

        const interactives = document.querySelectorAll('a, button, input');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, [isMobileMenuOpen]);

    // Horizontal Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 1024 || !scrollSectionRef.current || !scrollTrackRef.current) return;

            const section = scrollSectionRef.current;
            const track = scrollTrackRef.current;

            const stickyTop = section.offsetTop;
            const stickyHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            const start = stickyTop;
            const end = stickyTop + stickyHeight - windowHeight;

            let progress = (scrollY - start) / (end - start);
            progress = Math.max(0, Math.min(1, progress));

            const trackWidth = track.scrollWidth;
            const viewportWidth = window.innerWidth;
            const maxTranslate = trackWidth - viewportWidth;

            const translateX = -(progress * maxTranslate);
            track.style.transform = `translateX(${translateX}px)`;
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll(); // Initial call

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
    };

    return (
        <div className="text-slate-400 selection:bg-orange-500/30 selection:text-white antialiased">

            {/* Custom Cursor Element */}
            <div
                ref={customCursorRef}
                id="custom-cursor"
                className="w-4 h-4 rounded-full bg-white hidden md:block fixed pointer-events-none z-[9999] top-0 left-0 mix-blend-difference transition-transform duration-100 ease-out"
            ></div>

            {/* Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
                    ? 'bg-[#050505]/80 backdrop-blur-md border-white/5 py-4'
                    : 'border-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] transition-all duration-500">
                            <Code2 className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-white group-hover:text-orange-100 transition-colors">KodesCruz</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => onNavigate?.('features')} className="text-sm font-medium hover:text-white transition-colors">Features</button>
                        <button onClick={() => onNavigate?.('how-it-works')} className="text-sm font-medium hover:text-white transition-colors">How it Works</button>
                        <button onClick={() => onNavigate?.('pricing')} className="text-sm font-medium hover:text-white transition-colors">Pricing</button>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={handleLogin} className="text-sm font-mono hover:text-white transition-colors">Log In</button>
                        <button onClick={handleSignup} className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95">
                            Get Started
                        </button>
                    </div>

                    <button onClick={toggleMobileMenu} className="md:hidden text-white hover:text-orange-500 transition-colors">
                        <Menu />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-[#050505] pt-24 px-6 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="flex flex-col gap-8 text-2xl font-semibold tracking-tight text-white">
                    <button onClick={() => { toggleMobileMenu(); onNavigate?.('features'); }} className="text-left hover:text-orange-500">Features</button>
                    <button onClick={() => { toggleMobileMenu(); onNavigate?.('how-it-works'); }} className="text-left hover:text-orange-500">How it Works</button>
                    <button onClick={() => { toggleMobileMenu(); onNavigate?.('pricing'); }} className="text-left hover:text-orange-500">Pricing</button>
                    <hr className="border-white/10" />
                    <button onClick={() => { toggleMobileMenu(); handleLogin(); }} className="text-left text-orange-500 font-mono text-lg">Log In</button>
                    <button onClick={() => { toggleMobileMenu(); handleSignup(); }} className="text-left text-lg">Get Started</button>
                </div>
                <button onClick={toggleMobileMenu} className="absolute top-6 right-6 text-white">
                    <X />
                </button>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

                {/* Animated Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] animate-blob-bounce pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-blob-bounce pointer-events-none" style={{ animationDelay: '2s' }}></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        <span className="text-xs font-mono uppercase tracking-widest text-orange-400">Nomad Neural V4</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.1] mb-8 text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Master Coding with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                            AI Intelligence
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Experience the future of development. Real-time collaboration, smart debugging, and instant code generation—all in one powerful platform.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <button onClick={handleSignup} className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Start Coding Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-slate-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                        </button>

                        <button onClick={handleSignup} className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
                            View Demo
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500 opacity-50">
                    <ChevronDown className="w-6 h-6" />
                </div>
            </section>

            {/* Horizontal Scroll Section (Features) */}
            <div ref={scrollSectionRef} id="scroll-section" className="relative bg-[#050505] hidden lg:block h-[400vh]">
                <div className="sticky-wrapper flex items-center">
                    <div ref={scrollTrackRef} id="scroll-track" className="flex gap-8 px-20 w-max will-change-transform">

                        {/* Title Card */}
                        <div className="w-[40vw] shrink-0 pr-20 flex flex-col justify-center">
                            <h2 className="text-6xl font-semibold tracking-tight mb-6 text-white">Powerful <br /> Features</h2>
                            <p className="text-xl text-slate-400 max-w-md">Everything you need to build faster, smarter, and better than ever before.</p>
                        </div>

                        {/* Feature 1 */}
                        <div className="w-[400px] h-[500px] glass-card rounded-3xl p-10 flex flex-col justify-between shrink-0 hover:border-blue-500/30 transition-all group hover:-translate-y-2 duration-300">
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-blue-500/20">
                                    <Code2 className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-3xl font-semibold tracking-tight mb-4 text-white">AI Code Explanation</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">Understand complex code snippets instantly with detailed, human-readable explanations.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors">
                                Explore <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="w-[400px] h-[500px] glass-card rounded-3xl p-10 flex flex-col justify-between shrink-0 hover:border-red-500/30 transition-all group hover:-translate-y-2 duration-300">
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-red-500/20">
                                    <Bug className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-3xl font-semibold tracking-tight mb-4 text-white">Smart Debugging</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">Identify and fix bugs in seconds with intelligent analysis and automated solution suggestions.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-slate-500 group-hover:text-red-400 transition-colors">
                                Explore <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="w-[400px] h-[500px] glass-card rounded-3xl p-10 flex flex-col justify-between shrink-0 hover:border-violet-500/30 transition-all group hover:-translate-y-2 duration-300">
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-violet-500/20">
                                    <Users className="w-8 h-8 text-violet-500" />
                                </div>
                                <h3 className="text-3xl font-semibold tracking-tight mb-4 text-white">Real-time Collab</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">Code together with your team in real-time rooms with synchronized editing and integrated chat.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-slate-500 group-hover:text-violet-400 transition-colors">
                                Explore <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="w-[400px] h-[500px] glass-card rounded-3xl p-10 flex flex-col justify-between shrink-0 hover:border-purple-500/30 transition-all group hover:-translate-y-2 duration-300">
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-purple-500/20">
                                    <Sparkles className="w-8 h-8 text-purple-500" />
                                </div>
                                <h3 className="text-3xl font-semibold tracking-tight mb-4 text-white">Code Generation</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">Generate production-ready code from natural language descriptions in multiple languages.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-slate-500 group-hover:text-purple-400 transition-colors">
                                Explore <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Feature 5 */}
                        <div className="w-[400px] h-[500px] glass-card rounded-3xl p-10 flex flex-col justify-between shrink-0 hover:border-emerald-500/30 transition-all group hover:-translate-y-2 duration-300">
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-emerald-500/20">
                                    <Shield className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-3xl font-semibold tracking-tight mb-4 text-white">Secure & Private</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">Your code and data are protected with enterprise-grade security and end-to-end encryption.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-slate-500 group-hover:text-emerald-400 transition-colors">
                                Explore <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Spacer at end */}
                        <div className="w-[20vw] shrink-0"></div>
                    </div>
                </div>
            </div>

            {/* Mobile Features Grid (Fallback) */}
            <div className="lg:hidden py-24 px-6 bg-[#050505]">
                <h2 className="text-4xl font-semibold tracking-tight mb-12 text-center text-white">Powerful Features</h2>
                <div className="grid grid-cols-1 gap-6">
                    {/* Mobile Feature Items */}
                    <div className="glass-card rounded-2xl p-8 border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                            <Code2 className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight mb-3 text-white">AI Code Explanation</h3>
                        <p className="text-slate-400">Understand complex code snippets instantly with detailed explanations.</p>
                    </div>

                    <div className="glass-card rounded-2xl p-8 border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                            <Bug className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight mb-3 text-white">Smart Debugging</h3>
                        <p className="text-slate-400">Identify and fix bugs in seconds with intelligent analysis.</p>
                    </div>

                    <div className="glass-card rounded-2xl p-8 border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/20">
                            <Users className="w-6 h-6 text-violet-500" />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight mb-3 text-white">Real-time Collab</h3>
                        <p className="text-slate-400">Code together with your team in real-time rooms.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-500/5 pointer-events-none"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-white">Ready to start?</h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Join thousands of developers building the future with KodesCruz.</p>
                    <button onClick={handleSignup} className="px-10 py-5 bg-orange-500 text-white rounded-full font-semibold text-xl hover:bg-orange-600 transition-all shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] transform hover:-translate-y-1">
                        Get Started for Free
                    </button>
                </div>
            </section>

            {/* Built By Section */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-white">Built By</h2>
                        <p className="text-lg text-slate-400">Meet the creator behind KodesCruz</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="glass-card rounded-3xl p-8 md:p-12 border border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-purple-900/20 backdrop-blur-xl">
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                {/* Profile Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                        <img
                                            src="/palak-profile.jpg"
                                            alt="Palak Soni"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Profile Content */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-3xl font-bold tracking-tight mb-2 text-white">Palak Soni</h3>
                                    <p className="text-lg text-purple-300 mb-6">Aspiring Data Scientist | Oracle Certified</p>

                                    <div className="space-y-3 mb-6 text-slate-300">
                                        <p className="flex items-center gap-2 justify-center md:justify-start">
                                            <Shield className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm">B.Tech Mathematics & Computing @ RGIPT</span>
                                        </p>
                                        <p className="flex items-center gap-2 justify-center md:justify-start">
                                            <Code2 className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm">Mancherial, Telangana, India</span>
                                        </p>
                                    </div>

                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Passionate about Machine Learning, Data Science, and AI Applications. Experienced in
                                        building analytical frameworks and AI-driven solutions using Python, LangChain, and cutting-edge
                                        technologies. Oracle Data Science Professional Certified with a strong foundation in
                                        computational methods and research.
                                    </p>

                                    {/* Contact Buttons */}
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
                                        <a
                                            href="mailto:23mc3035@rgipt.ac.in"
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-sm text-purple-300 transition-all"
                                        >
                                            <Shield className="w-4 h-4" />
                                            Email: 23mc3035@rgipt.ac.in
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/in/palak-soni-292280288/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm text-blue-300 transition-all"
                                        >
                                            <Users className="w-4 h-4" />
                                            LinkedIn
                                        </a>
                                    </div>

                                    {/* Skills Tags */}
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300">Machine Learning</span>
                                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300">Data Science</span>
                                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300">AI Applications</span>
                                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300">Python & LangChain</span>
                                        <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-300">Oracle Certified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black pt-24 pb-12 overflow-hidden relative border-t border-white/5">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 rounded bg-orange-500 flex items-center justify-center">
                                    <Code2 className="text-white w-6 h-6" />
                                </div>
                                <span className="text-2xl font-semibold tracking-tight text-white">KodesCruz</span>
                            </div>
                            <p className="text-slate-400 max-w-md text-lg leading-relaxed">
                                Empowering developers with AI-driven tools to write, debug, and understand code faster than ever before.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 tracking-wide">Product</h4>
                            <ul className="space-y-4 text-slate-500 text-sm">
                                <li><button onClick={() => onNavigate?.('features')} className="hover:text-orange-500 transition-colors">Features</button></li>
                                <li><button onClick={() => onNavigate?.('pricing')} className="hover:text-orange-500 transition-colors">Pricing</button></li>
                                <li><button onClick={() => onNavigate?.('changelog')} className="hover:text-orange-500 transition-colors">Changelog</button></li>
                                <li><button onClick={() => onNavigate?.('docs')} className="hover:text-orange-500 transition-colors">Docs</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 tracking-wide">Company</h4>
                            <ul className="space-y-4 text-slate-500 text-sm">
                                <li><button onClick={() => onNavigate?.('about')} className="text-orange-500 text-base font-extrabold hover:text-orange-400 transition-colors flex items-center gap-2">About <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></span></button></li>
                                <li><button onClick={() => onNavigate?.('blog')} className="hover:text-orange-500 transition-colors">Blog</button></li>
                                <li><button onClick={() => onNavigate?.('careers')} className="hover:text-orange-500 transition-colors">Careers</button></li>
                                <li><button onClick={() => onNavigate?.('contact')} className="hover:text-orange-500 transition-colors">Contact</button></li>
                            </ul>
                        </div>
                    </div>

                    {/* Big Typography Footer */}
                    <div className="relative border-t border-white/5 pt-12">
                        <h1 className="text-[12vw] leading-none font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent select-none pointer-events-none text-center">
                            KODESCRUZ
                        </h1>

                        <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-6">
                            <p className="text-slate-600 font-mono text-xs">
                                © 2025 KodesCruz Inc. All rights reserved.
                            </p>

                            <div className="flex items-center gap-6">
                                <a href="https://www.linkedin.com/in/palak-soni-292280288/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                                    <span className="text-xs font-mono tracking-widest">BUILT BY AND FOUNDED BY PALAK SONI</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Auth Modal */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}

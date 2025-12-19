import { useEffect, useRef, useState } from 'react';
import {
    ArrowLeft,
    Code2,
    Mail,
    MessageSquare,
    Send
} from 'lucide-react';

interface ContactPageProps {
    onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
            setName('');
            setEmail('');
            setMessage('');
        }, 1500);
    };

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
                <div className="mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 header-animate">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">Touch</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto title-animate">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="card-animate glass-frosted p-6 rounded-2xl border border-white/10 text-center">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 text-blue-500">
                                <Mail className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold mb-1">Email Us</h3>
                            <p className="text-sm text-slate-400">support@kodescruxx.com</p>
                        </div>
                        <div className="card-animate glass-frosted p-6 rounded-2xl border border-white/10 text-center" style={{ animationDelay: '0.2s' }}>
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4 text-purple-500">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold mb-1">Live Chat</h3>
                            <p className="text-sm text-slate-400">Available Mon-Fri, 9am-5pm</p>
                        </div>
                        <div className="card-animate glass-frosted p-6 rounded-2xl border border-white/10 text-center" style={{ animationDelay: '0.4s' }}>
                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 text-orange-500">
                                <Code2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold mb-1">Follow Us</h3>
                            <p className="text-sm text-slate-400">@KodesCruz on Twitter</p>
                        </div>
                    </div>

                    <div className="card-animate glass-frosted p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
                        {isSent ? (
                            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 text-green-500">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-slate-400 mb-8">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button onClick={() => setIsSent(false)} className="text-orange-500 hover:text-orange-400 font-medium">
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        rows={6}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl py-4 hover:opacity-90 transition-all active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    {!isSubmitting && <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

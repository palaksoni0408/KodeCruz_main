import { useEffect, useRef } from 'react';
import {
    CheckCircle,
    ArrowLeft,
    Code2,
    Zap,
    Shield
} from 'lucide-react';

interface PricingPageProps {
    onBack: () => void;
}

export default function PricingPage({ onBack }: PricingPageProps) {
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
                            Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">Pricing</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto title-animate">
                            Choose the plan that fits your needs. Start for free, upgrade as you grow.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto">

                        {/* Free Plan */}
                        <div className="card-animate flex flex-col p-8 w-full hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border-2 border-orange-500/50 rounded-3xl shadow-2xl justify-between glass-frosted relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                CURRENT PLAN
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-zinc-800/50 rounded-2xl">
                                        <Code2 className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-sm px-3 py-1.5 bg-zinc-800/50 text-zinc-300 rounded-full font-medium">Starter</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Free</p>
                                    <p className="text-zinc-400 text-lg mt-2">Forever free for individuals</p>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold tracking-tight">$0</span>
                                    <span className="text-zinc-400">/month</span>
                                </div>
                            </div>
                            <div className="space-y-6 border-t border-white/10 pt-8 mt-8">
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        <span>Basic Code Explanation</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        <span>Simple Debugging</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        <span>Code Generation (Limited)</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        <span>Community Support</span>
                                    </li>
                                </ul>
                                <button className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors shadow-lg shadow-orange-500/20 cursor-default">
                                    Current Plan
                                </button>
                            </div>
                        </div>

                        {/* Pro Plan */}
                        <div className="card-animate flex flex-col p-8 w-full hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                                        <Zap className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <span className="text-sm px-3 py-1.5 bg-purple-500/20 text-purple-200 rounded-full font-medium">Popular</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Pro</p>
                                    <p className="text-zinc-400 text-lg mt-2">For serious developers</p>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold tracking-tight">$2</span>
                                    <span className="text-zinc-400">/month</span>
                                </div>
                            </div>
                            <div className="space-y-6 border-t border-white/10 pt-8 mt-8">
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                        <span>Advanced AI Models</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                        <span>Unlimited Code Generation</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                        <span>Real-time Collaboration</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                        <span>Priority Support</span>
                                    </li>
                                </ul>
                                <button disabled className="w-full py-4 rounded-xl bg-white/5 text-zinc-500 font-semibold border border-white/5 cursor-not-allowed">
                                    Not Available (Dev Phase)
                                </button>
                            </div>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="card-animate flex flex-col p-8 w-full hover:scale-105 transition-all duration-300 hover:shadow-3xl group text-white bg-zinc-900/50 border border-white/10 rounded-3xl shadow-2xl justify-between glass-frosted">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                                        <Shield className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <span className="text-sm px-3 py-1.5 bg-blue-500/20 text-blue-200 rounded-full font-medium">Business</span>
                                </div>
                                <div>
                                    <p className="text-3xl tracking-tight font-semibold">Enterprise</p>
                                    <p className="text-zinc-400 text-lg mt-2">For large teams</p>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold tracking-tight">$10</span>
                                    <span className="text-zinc-400">/month</span>
                                </div>
                            </div>
                            <div className="space-y-6 border-t border-white/10 pt-8 mt-8">
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span>Custom AI Model Training</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span>SSO & Advanced Security</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span>Dedicated Success Manager</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span>SLA Guarantee</span>
                                    </li>
                                </ul>
                                <button disabled className="w-full py-4 rounded-xl bg-white/5 text-zinc-500 font-semibold border border-white/5 cursor-not-allowed">
                                    Not Available (Dev Phase)
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

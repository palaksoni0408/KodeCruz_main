import { useEffect, useRef } from 'react';
import {
    ArrowLeft,
    Code2,
    Briefcase,
    MapPin,
    DollarSign,
    ArrowRight
} from 'lucide-react';

interface CareersPageProps {
    onBack: () => void;
}

export default function CareersPage({ onBack }: CareersPageProps) {
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

    const jobs: any[] = [
        // {
        //     title: "Senior Frontend Engineer",
        //     department: "Engineering",
        //     location: "Remote / San Francisco",
        //     type: "Full-time",
        //     salary: "$140k - $180k",
        //     color: "blue"
        // },
        // {
        //     title: "AI Research Scientist",
        //     department: "Research",
        //     location: "New York, NY",
        //     type: "Full-time",
        //     salary: "$160k - $220k",
        //     color: "purple"
        // },
        // {
        //     title: "Product Designer",
        //     department: "Design",
        //     location: "Remote",
        //     type: "Full-time",
        //     salary: "$120k - $160k",
        //     color: "orange"
        // },
        // {
        //     title: "Developer Advocate",
        //     department: "Marketing",
        //     location: "London, UK",
        //     type: "Full-time",
        //     salary: "$100k - $140k",
        //     color: "green"
        // }
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
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 header-animate">
                            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">Mission</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto title-animate">
                            Help us build the future of software development. We are looking for passionate individuals to join our team.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <div key={index} className="card-animate group">
                                    <div className="glass-frosted rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{job.title}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.department}</span>
                                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                                                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary}</span>
                                            </div>
                                        </div>
                                        <button className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                                            Apply Now <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 card-animate glass-frosted rounded-2xl border border-white/5">
                                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No Open Positions</h3>
                                <p className="text-slate-400">We don't have any open roles right now, but check back soon!</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-20 text-center card-animate">
                        <p className="text-slate-400 mb-6">Don't see a role that fits? We are always looking for talent.</p>
                        <button className="text-orange-500 hover:text-orange-400 font-medium hover:underline transition-all">
                            Send us an open application
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

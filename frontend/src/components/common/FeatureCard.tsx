import { ReactNode } from 'react';
import { LucideIcon, Code2, Sparkles, Play } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    icon?: LucideIcon;
    children: ReactNode;
    onSubmit: () => void;
    loading: boolean;
    isPlayground?: boolean;
    backgroundStyle?: React.CSSProperties;
    videoUrl?: string;
    error?: string;
}

export default function FeatureCard({
    title,
    icon: Icon = Code2,
    children,
    onSubmit,
    loading,
    isPlayground = false,
    backgroundStyle = {},
    videoUrl,
    error
}: FeatureCardProps) {
    return (
        <div
            className="group relative glass-frosted rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-emerald-900/20 overflow-hidden"
            style={backgroundStyle}
        >
            {/* Video Background */}
            {videoUrl && (
                <div className="absolute inset-0 z-0 opacity-80">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 to-slate-900/80" />
                </div>
            )}

            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8 flex-shrink-0 relative z-10">
                <div className="p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                        {title}
                    </h2>
                    <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </div>

            {/* Content Section */}
            <div className="mb-8 relative z-10">
                {children}
            </div>

            {/* Action Button */}
            <button
                onClick={onSubmit}
                disabled={loading && isPlayground}
                className="group relative inline-flex gap-3 uppercase transition-all cursor-pointer text-sm font-medium text-white tracking-wider opacity-100 border-transparent border-2 rounded-xl items-center justify-center w-full disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                    padding: '16px 20px',
                    background: 'linear-gradient(0deg, #000, #272727)',
                    borderRadius: '10px',
                    border: 'none',
                    color: 'white',
                    position: 'relative',
                    cursor: loading && isPlayground ? 'not-allowed' : 'pointer',
                    fontWeight: 900,
                    transitionDuration: '.2s'
                }}
            >
                <div className="absolute left-0 top-0 w-full h-full rounded-xl pointer-events-none" style={{ left: '-2px', top: '-2px', borderRadius: '10px', background: 'linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000)', backgroundSize: '400%', width: 'calc(100% + 4px)', height: 'calc(100% + 4px)', zIndex: -1, animation: 'steam 20s linear infinite' }}></div>
                <div className="absolute left-0 top-0 w-full h-full rounded-xl pointer-events-none" style={{ left: '-2px', top: '-2px', borderRadius: '10px', background: 'linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000)', backgroundSize: '400%', width: 'calc(100% + 4px)', height: 'calc(100% + 4px)', zIndex: -1, animation: 'steam 20s linear infinite', filter: 'blur(50px)' }}></div>

                <span className="relative z-30 font-medium flex items-center gap-3">
                    {loading && isPlayground ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            {isPlayground ? (
                                <>
                                    <Play className="w-5 h-5 fill-current" />
                                    <span>Run Code</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                    <span>Generate</span>
                                </>
                            )}
                        </>
                    )}
                </span>
            </button>

            {/* Error Display */}
            {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 backdrop-blur-md animate-in fade-in slide-in-from-top-2 relative z-10">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <p className="font-bold mb-1 text-sm text-red-100">Something went wrong</p>
                            <p className="text-sm opacity-90">{error}</p>
                            {error.includes('Cannot connect to backend') && (
                                <div className="mt-3 p-3 bg-black/30 rounded-xl text-xs font-mono border border-white/5">
                                    <p className="font-bold mb-2 text-emerald-400">Troubleshooting:</p>
                                    <ol className="list-decimal list-inside space-y-1.5 opacity-80">
                                        <li>Check if backend is running</li>
                                        <li>Verify port 8000 is open</li>
                                        <li>Refresh the page</li>
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

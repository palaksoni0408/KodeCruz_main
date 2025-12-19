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
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/10 flex flex-col transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-emerald-900/20 overflow-hidden"
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
                className="relative z-10 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 overflow-hidden group/btn"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />

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

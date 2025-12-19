import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Activity, TrendingUp, Zap, Clock } from 'lucide-react';

import { Code2, Bug, Sparkles, ArrowRightLeft, BarChart3, Play, FileCode, Lightbulb, Map, Users, Terminal, Shield, FlaskConical, Wrench } from 'lucide-react';

interface DashboardStats {
    total_uses: number;
    features_used: number;
    success_rate: number;
    avg_duration_ms: number;
}

interface ActivityItem {
    id: string;
    feature: string;
    language: string | null;
    success: boolean;
    timestamp: string;
    duration_ms: number | null;
}

const features = [
    { id: 'explain', icon: Code2, label: 'Explain Code', color: 'blue' },
    { id: 'debug', icon: Bug, label: 'Debug Code', color: 'red' },
    { id: 'generate', icon: Sparkles, label: 'Generate Code', color: 'purple' },
    { id: 'convert', icon: ArrowRightLeft, label: 'Convert Logic', color: 'green' },
    { id: 'complexity', icon: BarChart3, label: 'Analyze Complexity', color: 'orange' },
    { id: 'trace', icon: Play, label: 'Trace Code', color: 'cyan' },
    { id: 'snippets', icon: FileCode, label: 'Code Snippets', color: 'pink' },
    { id: 'projects', icon: Lightbulb, label: 'Project Ideas', color: 'yellow' },
    { id: 'roadmaps', icon: Map, label: 'Learning Roadmaps', color: 'indigo' },
    { id: 'playground', icon: Terminal, label: 'Code Playground', color: 'emerald' },
    { id: 'collaborate', icon: Users, label: 'Collaborative Rooms', color: 'violet' },
    { id: 'review', icon: Shield, label: 'Code Review', color: 'red' },
    { id: 'tests', icon: FlaskConical, label: 'Test Generator', color: 'teal' },
    { id: 'refactor', icon: Wrench, label: 'Refactor Code', color: 'amber' },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setStats({
                total_uses: 0,
                features_used: 0,
                success_rate: 0,
                avg_duration_ms: 0
            });

            setRecentActivity([]);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFeatureLabel = (feature: string) => {
        const labels: Record<string, string> = {
            explain: 'Explain Code',
            debug: 'Debug Code',
            generate: 'Generate Code',
            convert: 'Convert Logic',
            complexity: 'Analyze Complexity',
            trace: 'Trace Code',
            snippets: 'Code Snippets',
            projects: 'Project Ideas',
            roadmaps: 'Learning Roadmaps',
            playground: 'Code Playground',
            review: 'Code Review',
            tests: 'Test Generator',
            refactor: 'Refactor Code',
        };
        return labels[feature] || feature;
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white/60">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12">

            {/* Welcome Header */}
            <header className="mb-10 animate-enter">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-white mb-3">
                            Welcome back, <span className="text-gradient-hero">{user?.first_name || 'Creator'}</span>
                        </h1>
                        <p className="text-white/40 text-lg font-light tracking-wide">
                            Here's what's happening with your AI assistant
                        </p>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-enter delay-100">

                {/* Total Uses */}
                <div className="border-gradient rounded-[1.5rem] p-6 relative overflow-hidden group glass-liquid hover:bg-white/[0.08] transition-colors duration-300">


                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="p-2.5 bg-[#0F1115] rounded-xl border border-white/10 icon-glow-blue shadow-inner">
                            <Activity className="w-5 h-5 text-blue-400/90" />
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40 font-medium tracking-wide uppercase">
                            All Time
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-4xl font-medium text-white mb-1.5 tracking-tight">
                            {stats?.total_uses.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-white/30 font-normal">Total AI Requests</div>
                    </div>
                </div>

                {/* Features Used */}
                <div className="border-gradient rounded-[1.5rem] p-6 relative overflow-hidden group glass-liquid hover:bg-white/[0.08] transition-colors duration-300">


                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="p-2.5 bg-[#0F1115] rounded-xl border border-white/10 icon-glow-purple shadow-inner">
                            <Zap className="w-5 h-5 text-purple-400/90" />
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40 font-medium tracking-wide uppercase">
                            Explored
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-4xl font-medium text-white mb-1.5 tracking-tight">
                            {stats?.features_used || 0}
                        </div>
                        <div className="text-xs text-white/30 font-normal">Features Used</div>
                    </div>
                </div>

                {/* Success Rate */}
                <div className="border-gradient rounded-[1.5rem] p-6 relative overflow-hidden group glass-liquid hover:bg-white/[0.08] transition-colors duration-300">


                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="p-2.5 bg-[#0F1115] rounded-xl border border-white/10 icon-glow-green shadow-inner">
                            <TrendingUp className="w-5 h-5 text-emerald-400/90" />
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40 font-medium tracking-wide uppercase">
                            Reliability
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-4xl font-medium text-white mb-1.5 tracking-tight">
                            {stats?.success_rate || 0}<span className="text-2xl text-white/40 align-top">%</span>
                        </div>
                        <div className="text-xs text-white/30 font-normal">Success Rate</div>
                    </div>
                </div>

                {/* Avg Duration */}
                <div className="border-gradient rounded-[1.5rem] p-6 relative overflow-hidden group glass-liquid hover:bg-white/[0.08] transition-colors duration-300">


                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="p-2.5 bg-[#0F1115] rounded-xl border border-white/10 icon-glow-orange shadow-inner">
                            <Clock className="w-5 h-5 text-orange-400/90" />
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40 font-medium tracking-wide uppercase">
                            Latency
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-4xl font-medium text-white mb-1.5 tracking-tight">
                            {stats?.avg_duration_ms ? (stats.avg_duration_ms / 1000).toFixed(1) : '0.0'}<span className="text-2xl text-white/40 align-baseline">s</span>
                        </div>
                        <div className="text-xs text-white/30 font-normal">Avg Response Time</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="border-gradient rounded-[2rem] p-1 animate-enter delay-200 glass-liquid">
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-medium text-white tracking-tight">Recent Activity</h2>
                        <button className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.1] text-xs font-medium text-white/60 transition-all duration-300">
                            <span>View All</span>
                            <div className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-0.5 transition-transform flex items-center justify-center">
                                →
                            </div>
                        </button>
                    </div>

                    <div className="space-y-1">
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-16 text-white/30 border-2 border-dashed border-white/5 rounded-2xl">
                                <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="font-medium">No activity yet. Start creating!</p>
                            </div>
                        ) : (
                            recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="group flex items-center justify-between p-3 md:p-4 rounded-2xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.04] transition-all duration-200 cursor-default"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                                            {(() => {
                                                const Icon = features.find(f => f.id === activity.feature)?.icon || Activity;
                                                const color = features.find(f => f.id === activity.feature)?.color || 'blue';
                                                return <Icon className={`w-5 h-5 text-${color}-400`} />;
                                            })()}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="text-sm text-white/90 font-medium tracking-tight">
                                                {getFeatureLabel(activity.feature)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {activity.language && (
                                                    <div className="text-[10px] font-mono text-white/30 bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.05] uppercase">
                                                        {activity.language}
                                                    </div>
                                                )}
                                                {activity.language && <div className="w-1 h-1 rounded-full bg-white/10"></div>}
                                                <div className="text-[11px] text-white/30 font-light">
                                                    {activity.success ? 'Completed' : 'Failed'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[11px] font-medium text-white/30 tracking-tight">
                                        {formatTimestamp(activity.timestamp)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

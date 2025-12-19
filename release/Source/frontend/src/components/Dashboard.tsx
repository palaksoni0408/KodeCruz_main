import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Activity, TrendingUp, Zap, Clock } from 'lucide-react';

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

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsData, activityData] = await Promise.all([
                apiService.getDashboardStats(),
                apiService.getRecentActivity()
            ]);
            setStats(statsData);
            setRecentActivity(activityData.activities);
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
        <div className="min-h-screen p-6 space-y-6">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome back, {user?.username}! 👋
                </h1>
                <p className="text-white/60">Here's what's happening with your AI assistant</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Uses */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Activity className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="text-2xl">📊</div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {stats?.total_uses.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-white/60">Total AI Requests</div>
                </div>

                {/* Features Used */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Zap className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="text-2xl">⚡</div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {stats?.features_used || 0}
                    </div>
                    <div className="text-sm text-white/60">Features Explored</div>
                </div>

                {/* Success Rate */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="text-2xl">✨</div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {stats?.success_rate || 100}%
                    </div>
                    <div className="text-sm text-white/60">Success Rate</div>
                </div>

                {/* Avg Duration */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-500/20 rounded-xl">
                            <Clock className="w-6 h-6 text-orange-400" />
                        </div>
                        <div className="text-2xl">⏱️</div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {stats?.avg_duration_ms ? `${(stats.avg_duration_ms / 1000).toFixed(1)}s` : 'N/A'}
                    </div>
                    <div className="text-sm text-white/60">Avg Response Time</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>

                {recentActivity.length === 0 ? (
                    <div className="text-center py-12 text-white/40">
                        <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No activity yet. Start using features to see your history!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-2 h-2 rounded-full ${activity.success ? 'bg-green-400' : 'bg-red-400'}`} />
                                    <div>
                                        <div className="text-white font-medium">
                                            {getFeatureLabel(activity.feature)}
                                        </div>
                                        {activity.language && (
                                            <div className="text-sm text-white/60">
                                                {activity.language}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-white/40">
                                    {formatTimestamp(activity.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

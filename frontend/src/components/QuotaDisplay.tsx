import { useQuota } from '../context/QuotaContext';

export default function QuotaDisplay() {
    const { quota, loading } = useQuota();

    if (loading || !quota) {
        return null;
    }

    const getColor = (remaining: number, limit: number) => {
        const percentage = (remaining / limit) * 100;
        if (percentage > 50) return 'text-green-400 border-green-500/30 bg-green-500/5';
        if (percentage > 25) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5';
        return 'text-red-400 border-red-500/30 bg-red-500/5';
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getColor(quota.quota_remaining, quota.quota_limit)}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium">
                {quota.quota_remaining}/{quota.quota_limit} queries left
            </span>
        </div>
    );
}

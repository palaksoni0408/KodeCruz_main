import { useQuota } from '../context/QuotaContext';

interface QuotaExhaustedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function QuotaExhaustedModal({ isOpen, onClose }: QuotaExhaustedModalProps) {
    const { quota } = useQuota();

    if (!isOpen || !quota) return null;

    const formatResetTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return 'Soon';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-red-400 mb-3 text-center">
                    Daily Quota Exhausted
                </h2>

                {/* Message */}
                <p className="text-gray-300 mb-6 text-center">
                    You've used all <span className="font-bold text-white">{quota.quota_limit} queries</span> for today.
                    Your quota will automatically reset at:
                </p>

                {/* Reset Time */}
                <div className="bg-slate-800/50 border border-red-500/20 rounded-lg p-4 mb-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-400 mb-1">Reset Time</p>
                        <p className="text-xl font-mono text-emerald-400 font-bold">
                            {formatResetTime(quota.reset_at)}
                        </p>
                    </div>
                </div>

                {/* Current Usage */}
                <div className="flex justify-between items-center bg-slate-800/30 rounded-lg p-3 mb-6">
                    <span className="text-sm text-gray-400">Queries Used Today</span>
                    <span className="text-lg font-bold text-red-400">{quota.quota_used}/{quota.quota_limit}</span>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 py-3 rounded-lg font-medium transition-colors"
                >
                    I Understand
                </button>

                {/* Info Text */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    Need more queries? Contact support to upgrade your plan.
                </p>
            </div>
        </div>
    );
}

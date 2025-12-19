import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, GitBranch, Code2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

interface SidebarProps {
    onDashboardClick?: () => void;
    onWorkflowClick?: () => void;
    features: any[];
    activeFeature: string;
    setActiveFeature: (id: string) => void;
    onFeatureChange?: () => void;
}

export default function Sidebar({ features, activeFeature, setActiveFeature, onFeatureChange, onDashboardClick, onWorkflowClick }: SidebarProps) {
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleFeatureClick = (featureId: string) => {
        setActiveFeature(featureId);
        if (onFeatureChange) onFeatureChange();
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <div className="lg:col-span-1">
            {/* Mobile Header Bar */}
            <div className="lg:hidden flex items-center justify-between bg-slate-900/80 backdrop-blur-md p-4 sticky top-0 z-40 border-b border-white/10 mb-4 rounded-xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                        <Code2 className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-white">KodesCruz</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <div className={`
        fixed inset-0 z-50 lg:static lg:z-auto lg:inset-auto
        flex flex-col gap-4 transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 bg-slate-950/95 backdrop-blur-xl p-4' : '-translate-x-full lg:translate-x-0 lg:bg-transparent lg:p-0'}
      `}>
                {/* Mobile Close Button */}
                <div className="lg:hidden flex justify-end mb-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-400 hover:text-white p-2"
                    >
                        <X size={24} />
                    </button>
                </div>



                {/* Dashboard Button */}
                {onDashboardClick && (
                    <button
                        onClick={() => {
                            console.log('Dashboard button clicked');
                            onDashboardClick();
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full glass-frosted border-gradient hover:bg-white/10 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md group"
                    >
                        <LayoutDashboard size={20} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                        <span className="tracking-wide">Dashboard</span>
                    </button>
                )}

                {/* Workflow Button */}
                {isAuthenticated && onWorkflowClick && (
                    <button
                        onClick={() => {
                            onWorkflowClick();
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full glass-frosted border-gradient hover:bg-white/10 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md group mt-2"
                    >
                        <GitBranch size={20} className="text-pink-400 group-hover:text-pink-300 transition-colors" />
                        <span className="tracking-wide">Workflows</span>
                    </button>
                )}

                {/* Navigation Links */}
                <div className="border-gradient rounded-2xl p-2 space-y-1 flex-1 overflow-y-auto custom-scrollbar shadow-xl glass-liquid">
                    {features.map((feature) => {
                        const isActive = activeFeature === feature.id;
                        const Icon = feature.icon;

                        return (
                            <button
                                key={feature.id}
                                onClick={() => handleFeatureClick(feature.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm group relative overflow-hidden ${isActive
                                    ? `text-white shadow-lg`
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <div className={`absolute inset-0 bg-gradient-to-r from-${feature.color}-500/20 to-transparent opacity-100 transition-opacity duration-300`} />
                                )}

                                <div className={`relative z-10 p-1.5 rounded-lg transition-colors duration-300 ${isActive ? `bg-${feature.color}-500/20 text-${feature.color}-300` : 'bg-white/5 group-hover:bg-white/10'}`}>
                                    <Icon size={18} />
                                </div>

                                <span className="font-medium truncate relative z-10">{feature.label}</span>

                                {isActive && (
                                    <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-${feature.color}-400 shadow-[0_0_8px_currentColor] flex-shrink-0 relative z-10`}></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
}

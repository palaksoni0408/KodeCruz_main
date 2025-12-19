import { useState, useEffect } from 'react';
import { LogOut, LogIn, Menu, X, LayoutDashboard, GitBranch } from 'lucide-react';
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
    const { user, logout, isAuthenticated } = useAuth();
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
                <span className="font-bold text-white text-lg">Menu</span>
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

                {/* User Profile / Auth Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-lg">
                    {isAuthenticated && user ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-inner">
                                    {user.username[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-white truncate">{user.username}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-xs text-emerald-400 font-medium truncate">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-200 text-xs font-medium flex-shrink-0"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                        >
                            <LogIn size={18} />
                            Sign In
                        </button>
                    )}
                </div>

                {/* Dashboard Button */}
                {isAuthenticated && onDashboardClick && (
                    <button
                        onClick={() => {
                            console.log('Dashboard button clicked');
                            onDashboardClick();
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md group"
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
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md group mt-2"
                    >
                        <GitBranch size={20} className="text-pink-400 group-hover:text-pink-300 transition-colors" />
                        <span className="tracking-wide">Workflows</span>
                    </button>
                )}

                {/* Navigation Links */}
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-2 space-y-1 border border-white/10 flex-1 overflow-y-auto custom-scrollbar shadow-xl">
                    {features.map((feature) => {
                        const isActive = activeFeature === feature.id;
                        const Icon = feature.icon;

                        return (
                            <button
                                key={feature.id}
                                onClick={() => handleFeatureClick(feature.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm group ${isActive
                                    ? `bg-gradient-to-r from-${feature.color}-500/20 to-${feature.color}-600/10 text-white shadow-md border border-${feature.color}-500/30 translate-x-1`
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white hover:translate-x-1'
                                    }`}
                            >
                                <Icon
                                    size={20}
                                    className={`flex-shrink-0 transition-all duration-200 ${isActive ? `text-${feature.color}-400` : 'text-gray-400 group-hover:text-white'
                                        }`}
                                />
                                <span className="font-medium truncate">{feature.label}</span>
                                {isActive && (
                                    <div className={`ml-auto w-2 h-2 rounded-full bg-${feature.color}-400 animate-pulse flex-shrink-0`}></div>
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

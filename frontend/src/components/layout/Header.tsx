import { AlertCircle, Code2, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    backendConnected: boolean | null;
}

export default function Header({ backendConnected }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <div className="flex items-center justify-between bg-slate-900/20 backdrop-blur-xl py-2 px-4 sticky top-0 z-40 border-b border-white/5 mb-4 rounded-xl">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                        <Code2 className="text-white w-4 h-4" />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-white">KodesCruz</span>
                </div>

                {/* Backend Status Indicator */}
                {backendConnected === false && (
                    <div className="hidden md:inline-flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md text-red-200 backdrop-blur-sm text-[10px]">
                        <AlertCircle className="w-3 h-3" />
                        <span>Backend Disconnected</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* User Profile Section - Always Visible */}
                <div className="hidden md:flex items-center gap-4 pl-4 border-l border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-inner border border-white/10">
                            {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{user?.first_name || 'User'}</span>
                            <span className="text-xs text-white/40">{user?.email || ''}</span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="text-white/40 hover:text-white transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        </div>
    );
}
